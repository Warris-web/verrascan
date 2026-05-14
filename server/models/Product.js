const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  brand_id:      { type: mongoose.Schema.Types.ObjectId, ref: "BrandRegistration", required: true },
  contact_email: { type: String, required: true },
  product_name:  { type: String, required: true },
  nafdac_number: { type: String, required: true },
  pantone_code:  { type: String },
  batch_format:  { type: String },
  category:      { type: String, default: "general" },
  status:        { type: String, enum: ["active", "inactive"], default: "active" },
  scan_count:    { type: Number, default: 0 },
  fake_count:    { type: Number, default: 0 },
  created_at:    { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);