const router = require("express").Router();
const CheckoutController = require("../controllers/CheckoutController");

router.get("/shippings", CheckoutController.getAllShippingRates);

module.exports = router;
