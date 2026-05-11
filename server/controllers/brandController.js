const axios = require("axios");
const BrandRegistration = require("../models/BrandRegistration");

exports.registerBrand = async (req, res) => {
  try {
    const {
      company_name, product_name, nafdac_number,
      pantone_code, batch_format, contact_email,
    } = req.body;

    if (!company_name || !product_name || !nafdac_number || !contact_email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create pending registration first
    const brand = await BrandRegistration.create({
      company_name, product_name, nafdac_number,
      pantone_code, batch_format, contact_email,
      status: "pending",
    });

    // If no Squad keys, return success with mock payment
    if (!process.env.SQUAD_SECRET_KEY || process.env.SQUAD_SECRET_KEY.trim() === "") {
      return res.json({
        success:     true,
        mock:        true,
        brand_id:    brand._id,
        payment_url: null,
        message:     "Brand registered. Add Squad keys to .env for live payment.",
      });
    }

    // Initiate Squad payment
      const squadRes = await axios.post(
      `${process.env.SQUAD_BASE_URL}/transaction/initiate`,
      {
        amount:          "5000000",
        email:           contact_email,
        currency:        "NGN",
        initiate_type:   "inline",
        transaction_ref: `VS-${brand._id}`,
        callback_url:    "http://localhost:5173/onboard?status=success",
        pass_charge:     false,
        customer_name:   company_name,
      },
      {
        headers: {
          Authorization:  `Bearer ${process.env.SQUAD_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    await BrandRegistration.findByIdAndUpdate(brand._id, {
      squad_reference: squadRes.data?.data?.transaction_ref || `VS-${brand._id}`,
    });

    return res.json({
      success:     true,
      brand_id:    brand._id,
      payment_url: squadRes.data?.data?.checkout_url || null,
      reference:   squadRes.data?.data?.transaction_ref,
    });

  } catch (err) {
    console.error("Brand register error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Registration failed", detail: err.message });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await BrandRegistration.find().sort({ created_at: -1 });
    return res.json({ success: true, brands });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
