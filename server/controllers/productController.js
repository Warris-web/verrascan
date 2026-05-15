const Product           = require("../models/Product");
const BrandRegistration = require("../models/BrandRegistration");

// Add a product to existing brand account
// exports.addProduct = async (req, res) => {
//   try {
//     const { product_name, nafdac_number, pantone_code, batch_format, category } = req.body;

//     if (!product_name || !nafdac_number)
//       return res.status(400).json({ error: "Product name and NAFDAC number required" });

//     // Find their brand account
//     const brand = await BrandRegistration.findOne({
//       contact_email: req.user.email,
//       status:        "active",
//     });

//     if (!brand)
//       return res.status(403).json({ error: "No active brand account found. Please complete onboarding first." });

//     // Check for duplicate product
//     const existing = await Product.findOne({
//       brand_id:     brand._id,
//       nafdac_number,
//     });
//     if (existing)
//       return res.status(400).json({ error: "A product with this NAFDAC number already exists in your account." });

//     const product = await Product.create({
//       brand_id:      brand._id,
//       contact_email: req.user.email,
//       product_name,
//       nafdac_number,
//       pantone_code,
//       batch_format,
//       category: category || "general",
//     });

//     return res.status(201).json({ success: true, product });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };
exports.addProduct = async (req, res) => {
  try {
    const { product_name, nafdac_number, pantone_code, batch_format, category } = req.body;

    if (!product_name || !nafdac_number)
      return res.status(400).json({ error: "Product name and NAFDAC number required" });

    // Find brand by email — active OR pending (pending means just registered, payment processing)
    const brand = await BrandRegistration.findOne({
      contact_email: req.user.email,
    });

    if (!brand)
      return res.status(403).json({
        error: "No brand account found. Please complete onboarding at /onboard first.",
      });

    // Check duplicate
    const Product = require("../models/Product");
    const existing = await Product.findOne({
      brand_id: brand._id, nafdac_number,
    });
    if (existing)
      return res.status(400).json({ error: "A product with this NAFDAC number already exists." });

    const product = await Product.create({
      brand_id:      brand._id,
      contact_email: req.user.email,
      product_name,
      nafdac_number,
      pantone_code,
      batch_format,
      category: category || "general",
    });

    return res.status(201).json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get all products for logged-in brand
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ contact_email: req.user.email })
      .sort({ created_at: -1 });
    return res.json({ success: true, products });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id:           req.params.id,
      contact_email: req.user.email,
    });
    if (!product)
      return res.status(404).json({ error: "Product not found" });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// All products — NAFDAC admin view
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand_id", "company_name contact_email status")
      .sort({ created_at: -1 });
    return res.json({ success: true, products });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};