const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/auth");
const { registerBrand, getBrands } = require("../controllers/brandController");

router.post("/register", registerBrand);
router.get("/",          auth(["brand", "nafdac"]), getBrands);
router.get("/mine",      auth(["brand"]), async (req, res) => {
  const BrandRegistration = require("../models/BrandRegistration");
  try {
    const brands = await BrandRegistration.find({ contact_email: req.user.email }).sort({ created_at: -1 });
    return res.json({ success: true, brands });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;