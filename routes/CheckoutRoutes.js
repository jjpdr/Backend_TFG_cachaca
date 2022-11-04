const router = require("express").Router();
const CheckoutController = require("../controllers/CheckoutController");

router.get("/shippings", CheckoutController.getAllShippingRates);
router.get("/list-items/:id", CheckoutController.getCheckoutItems);
router.post(
  "/product-checkout-session",
  CheckoutController.paymentCheckoutSession
);
router.post(
    "/plan-checkout-session",
    CheckoutController.planCheckoutSession
  );

module.exports = router;
