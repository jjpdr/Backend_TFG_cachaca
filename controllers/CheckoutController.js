const stripe = require("stripe")(
  "sk_test_51LrVO8JQSrJ9pyRJdyxFUYf5gVhvosbtY6oNaDk0x1OK4Dhm8krmuLdwPZL8o1xqt8gEMRndHTQrz8vvwV3mXQ8D00C0cSrSTb"
);

module.exports = class CheckoutController {
  static async getAllShippingRates(req, res) {
    try {
      const shippingRates = await stripe.shippingRates.list({});
      res.status(200).json({ shippingRates: shippingRates.data });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  static async getCheckoutItems(req, res) {
    const sessionID = req.params.id;
    console.log(sessionID);
    try {
      const products = await stripe.checkout.sessions.listLineItems(
        String(sessionID)
      );
      console.log(products);
      res.status(200).json({ products: products.data });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
};
