const PromoCode = require('../Models/PromoCode'); // Assuming a PromoCode model exists

const applyPromoCode = async (req, res, next) => {
  const { promoCode } = req.body;

  if (!promoCode) {
    req.discount = 0; // No promo code applied
    return next();
  }

  try {
    const promo = await PromoCode.findOne({ code: promoCode });

    if (!promo) {
      return res.status(400).json({ message: "Invalid promo code" });
    }

    if (new Date() > promo.validUntil) {
      return res.status(400).json({ message: "Promo code has expired" });
    }

    req.discount = promo.discount; // Apply the discount
    req.promoCode = promoCode; // Pass the promo code to the next middleware
    next();
  } catch (error) {
    res.status(500).json({ message: "Error validating promo code", error });
  }
};
