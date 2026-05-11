const express    = require("express");
const router     = express.Router();
const { scanProduct } = require("../controllers/scanController");

router.post("/", scanProduct);
module.exports = router;
