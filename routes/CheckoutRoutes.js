const router = require("express").Router();
const CheckoutController = require("../controllers/CheckoutController");

router.get("/shippings", CheckoutController.getAllShippingRates);
router.get("/list-items/:id", CheckoutController.getCheckoutItems);

module.exports = router;
