const crypto = require("crypto");
const BrandRegistration = require("../models/BrandRegistration");

exports.handleWebhook = async (req, res) => {
  try {
    // Verify Squad webhook signature
    const squadSignature = req.headers["x-squad-encrypted-body"];
    const payload        = JSON.stringify(req.body);
    const hash           = crypto
      .createHmac("sha512", process.env.SQUAD_SECRET_KEY)
      .update(payload)
      .digest("hex")
      .toUpperCase();

    if (squadSignature && hash !== squadSignature) {
      console.warn("Invalid Squad webhook signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const { Event, Body } = req.body;

    if (Event === "charge_successful") {
      const ref     = Body?.transaction_ref || "";
      const brandId = ref.replace("VS-", "");

      if (brandId) {
        await BrandRegistration.findByIdAndUpdate(brandId, {
          status:          "active",
          squad_reference: ref,
        });
        console.log(`Brand ${brandId} activated via Squad webhook`);
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
