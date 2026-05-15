// const express = require("express");
// const router  = express.Router();
// const auth    = require("../middleware/auth");
// const { registerBrand, getBrands } = require("../controllers/brandController");

// router.post("/register", registerBrand);
// router.get("/",          auth(["brand", "nafdac"]), getBrands);
// router.get("/mine",      auth(["brand"]), async (req, res) => {
//   const BrandRegistration = require("../models/BrandRegistration");
//   try {
//     const brands = await BrandRegistration.find({ contact_email: req.user.email }).sort({ created_at: -1 });
//     return res.json({ success: true, brands });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express           = require("express");
const router            = express.Router();
const auth              = require("../middleware/auth");
const BrandRegistration = require("../models/BrandRegistration");
// const { registerBrand, getBrands } = require("../controllers/brandController");
// const { registerBrand, getBrands, activateByEmail } = require("../controllers/brandController");
const { registerBrand, getBrands, activateByEmail, activateByReference } = require("../controllers/brandController");



router.post("/activate-by-reference", activateByReference);
router.post("/register",        registerBrand);
router.post("/activate-by-email", activateByEmail);
router.get("/",                 auth(["brand", "nafdac"]), getBrands);
router.get("/mine",             auth(["brand"]), async (req, res) => {
  try {
    const brands = await BrandRegistration.find({ contact_email: req.user.email }).sort({ created_at: -1 });
    return res.json({ success: true, brands });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});
router.patch("/:id/activate",   auth(["nafdac"]), async (req, res) => {
  try {
    const brand = await BrandRegistration.findByIdAndUpdate(
      req.params.id, { status: "active" }, { new: true }
    );
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    return res.json({ success: true, brand });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

module.exports = router;