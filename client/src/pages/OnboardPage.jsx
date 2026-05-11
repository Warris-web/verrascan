import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const STEPS = ["Company Details", "Product Specs", "Squad Payment", "Active"];

export default function OnboardPage() {
  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const [form, setForm] = useState({
    company_name: "", product_name: "", nafdac_number: "",
    pantone_code: "", batch_format: "", contact_email: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await axios.post(`${API}/api/brands/register`, form);
      if (data.payment_url) window.open(data.payment_url, "_blank");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Check server.");
    } finally { setLoading(false); }
  };

  const inp = { width: "100%", background: "#111", border: "1px solid #2A2A2A", borderRadius: 7, padding: "10px 13px", fontSize: 13, color: "#fff", outline: "none", fontFamily: "inherit" };
  const lbl = { fontSize: 11, color: "#666", marginBottom: 5, display: "block" };
  const btn = { background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" };
  const sec = { background: "transparent", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: "11px 20px", fontSize: 13, cursor: "pointer" };

  return (
    <div style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Brand Onboarding</div>
      <div style={{ fontSize: 12, color: "#555", marginBottom: 24 }}>Register your product. Protect it from counterfeits. Powered by Squad API.</div>

      {/* Stepper */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? "#00C9A7" : i === step ? "rgba(0,201,167,0.15)" : "#1A1A1A", border: `1px solid ${step >= i ? "#00C9A7" : "#2A2A2A"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: step > i ? "#000" : i === step ? "#00C9A7" : "#555", marginBottom: 5 }}>
                {step > i ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 9.5, color: step >= i ? "#00C9A7" : "#444", whiteSpace: "nowrap" }}>{label}</div>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: step > i ? "#00C9A7" : "#2A2A2A", margin: "0 6px", marginBottom: 18 }} />}
          </div>
        ))}
      </div>

      <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "24px 26px" }}>

        {step === 0 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Company Details</div>
            {[["Company Name", "company_name", "e.g. Roche Nigeria Ltd"], ["Contact Email", "contact_email", "brand@company.com"]].map(([label, key, ph]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={lbl}>{label}</label>
                <input placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} style={inp} />
              </div>
            ))}
            <button onClick={() => setStep(1)} disabled={!form.company_name || !form.contact_email} style={{ ...btn, opacity: !form.company_name || !form.contact_email ? 0.5 : 1, marginTop: 6 }}>
              Continue →
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Product Security Specifications</div>
            {[
              ["Product Name",        "product_name",  "e.g. Coartem 20/120mg"],
              ["NAFDAC Reg. Number",  "nafdac_number", "e.g. A4-1234"],
              ["Pantone Colour Code", "pantone_code",  "e.g. 186C"],
              ["Batch Code Format",   "batch_format",  "e.g. MM-YYYY-XXXX"],
            ].map(([label, key, ph]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={lbl}>{label}</label>
                <input placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} style={inp} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button onClick={() => setStep(0)} style={sec}>Back</button>
              <button onClick={() => setStep(2)} disabled={!form.product_name || !form.nafdac_number} style={{ ...btn, opacity: !form.product_name || !form.nafdac_number ? 0.5 : 1 }}>Continue →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Squad Payment</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 18 }}>Powered by Squad Checkout API · GTBank SquadCo</div>
            <div style={{ background: "#111", border: "1px solid #2A2A2A", borderRadius: 10, padding: "16px 18px", marginBottom: 18 }}>
              {[["Product", form.product_name], ["Company", form.company_name], ["NAFDAC No.", form.nafdac_number], ["Monthly Fee", "₦50,000"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12 }}>
                  <span style={{ color: "#666" }}>{k}</span>
                  <span style={{ color: k === "Monthly Fee" ? "#00C9A7" : "#fff", fontWeight: k === "Monthly Fee" ? 700 : 400 }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #2A2A2A", paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700 }}>
                <span>Total Due</span><span style={{ color: "#00C9A7" }}>₦50,000/mo</span>
              </div>
            </div>
            {error && <div style={{ fontSize: 11, color: "#E53935", marginBottom: 12, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6 }}>{error}</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={sec}>Back</button>
              <button onClick={submit} disabled={loading} style={{ ...btn, flex: 1, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Processing..." : "Pay ₦50,000 via Squad →"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(0,201,167,0.1)", border: "2px solid #00C9A7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 16px" }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#00C9A7", marginBottom: 8 }}>Registration Submitted</div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>Squad webhook will confirm payment and activate your protection pipeline.</div>
            <div style={{ background: "#0D2E24", border: "1px solid #009B82", borderRadius: 8, padding: "14px 16px", textAlign: "left" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#00C9A7", marginBottom: 8 }}>What happens next</div>
              {["Squad payment webhook received", "Product specs ingested into verification database", "EfficientNet model fine-tuning initiated", "VeraScann protection active within 24 hours"].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#00C9A7", fontSize: 11 }}>✓</span>
                  <span style={{ fontSize: 11, color: "#666" }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setStep(0); setForm({ company_name: "", product_name: "", nafdac_number: "", pantone_code: "", batch_format: "", contact_email: "" }); }} style={{ ...sec, marginTop: 16 }}>
              Register Another Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}