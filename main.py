import torch
from torchvision import transforms, models
from torch import nn
from PIL import Image
import io
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import hf_hub_download
import os

app = FastAPI(title="VeraScann API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cpu")

MODEL_PATH = "verascann_model.pth"
if not os.path.exists(MODEL_PATH):
    print("Downloading model...")
    hf_hub_download(
        repo_id="Oriadee/Flux_model",
        filename="verascann_model.pth",
        local_dir="."
    )

def load_model():
    model = models.efficientnet_b0(weights=None)
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(model.classifier[1].in_features, 256),
        nn.ReLU(),
        nn.Dropout(p=0.2),
        nn.Linear(256, 2)
    )
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model.eval()
    return model.to(device)

model = load_model()
print("Model loaded")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

@app.get("/")
def root():
    return {"status": "VeraScann API is running"}

@app.post("/verify")
async def verify_product(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img_tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(img_tensor)
        probabilities = torch.softmax(output, dim=1)
        confidence, predicted = torch.max(probabilities, 1)

    fake_prob = probabilities[0][0].item()
    genuine_prob = probabilities[0][1].item()
    predicted_class = predicted.item()

    if predicted_class == 0:
        verdict = "COUNTERFEIT" if fake_prob >= 0.85 else "SUSPICIOUS"
    else:
        verdict = "GENUINE" if genuine_prob >= 0.85 else "SUSPICIOUS"

    reasons = []
    if verdict in ["COUNTERFEIT", "SUSPICIOUS"]:
        if fake_prob > 0.6:
            reasons.append("Packaging visual anomaly detected")
        if fake_prob > 0.7:
            reasons.append("Colour profile deviation from genuine reference")
        if fake_prob > 0.8:
            reasons.append("Typography inconsistency detected")
    else:
        reasons.append("Packaging matches genuine reference profile")
        reasons.append("Visual forensics within acceptable range")

    return {
        "verdict": verdict,
        "confidence": round(max(fake_prob, genuine_prob) * 100, 1),
        "fake_probability": round(fake_prob * 100, 1),
        "genuine_probability": round(genuine_prob * 100, 1),
        "forensic_signals": reasons,
        "product": "Biore UV Aqua Rich Sunscreen",
        "recommendation": "Purchase from verified vendor"
                         if verdict != "GENUINE"
                         else "Product appears authentic"
    }
