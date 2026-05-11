const axios = require("axios");
const crypto = require("crypto");
const ScanResult = require("../models/ScanResult");

exports.scanProduct = async (req, res) => {
  try {
    const { image, product_category, product_name, region } = req.body;

    if (!image) return res.status(400).json({ error: "No image provided" });

    // Hash image for deduplication
    const image_hash = crypto
      .createHash("sha256")
      .update(image)
      .digest("hex");

    // Call Boluwatife's AI microservice
    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/verify`,
      { image, category: product_category || "general" },
      { timeout: 15000 }
    );

    const { verdict, confidence, signals } = aiResponse.data;

    // Save to MongoDB
    const scan = await ScanResult.create({
      product_name:     product_name || "Unknown",
      product_category: product_category || "general",
      verdict,
      confidence,
      signals,
      region:     region || "Unknown",
      image_hash,
    });

    return res.json({
      success: true,
      scan_id:    scan._id,
      verdict,
      confidence,
      signals,
      image_hash,
    });
  } catch (err) {
    // If AI service is down, return mock for demo
    if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT") {
      return res.json({
        success:    true,
        mock:       true,
        verdict:    "COUNTERFEIT",
        confidence: 91,
        signals: [
          { name: "NAFDAC Number Validation", status: "FAIL",  detail: "Reg. A4-1234 — format invalid.",                        score: 12 },
          { name: "Typography Forensics",     status: "FAIL",  detail: "Kerning anomaly on manufacturer name. +0.3pt drift.",    score: 18 },
          { name: "Colour Profile Analysis",  status: "FAIL",  detail: "Red band 3% warmer than Pantone 186C reference.",       score: 8  },
          { name: "Geometric Ratio Analysis", status: "WARN",  detail: "Logo ratio 1.04 vs reference 1.00. Minor compression.", score: 45 },
          { name: "Print Quality & Halftone", status: "FAIL",  detail: "Ink bleed at 0.2mm beyond boundary on batch region.",   score: 22 },
          { name: "OCR Batch Code Check",     status: "FAIL",  detail: "Expiry format MM/YYYY — genuine uses MM-YYYY.",         score: 5  },
        ],
      });
    }
    console.error("Scan error:", err.message);
    return res.status(500).json({ error: "Scan failed", detail: err.message });
  }
};
