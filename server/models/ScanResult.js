const mongoose = require("mongoose");

const SignalSchema = new mongoose.Schema({
  name:   { type: String },
  status: { type: String, enum: ["PASS", "FAIL", "WARN"] },
  detail: { type: String },
  score:  { type: Number },
});

const ScanResultSchema = new mongoose.Schema({
  product_name:     { type: String, required: true },
  product_category: { type: String, required: true },
  verdict:          { type: String, enum: ["GENUINE", "SUSPICIOUS", "COUNTERFEIT"], required: true },
  confidence:       { type: Number, required: true },
  signals:          [SignalSchema],
  region:           { type: String },
  image_hash:       { type: String },
  created_at:       { type: Date, default: Date.now },
});

module.exports = mongoose.model("ScanResult", ScanResultSchema);
