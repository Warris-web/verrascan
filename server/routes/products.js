const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/auth");
const {
  addProduct,
  getMyProducts,
  deleteProduct,
  getAllProducts,
} = require("../controllers/productController");

router.post("/",         auth(["brand"]),           addProduct);
router.get("/mine",      auth(["brand"]),            getMyProducts);
router.delete("/:id",    auth(["brand"]),            deleteProduct);
router.get("/all",       auth(["nafdac"]),           getAllProducts);

module.exports = router;