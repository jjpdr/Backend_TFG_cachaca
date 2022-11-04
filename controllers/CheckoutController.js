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
    try {
      const products = await stripe.checkout.sessions.listLineItems(
        String(sessionID)
      );
      res.status(200).json({ products: products.data });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  static async paymentCheckoutSession(req, res) {
    const { line_items, shipping_cost } = req.body;
    try {
      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url:
          "http://localhost:3000/checkout/purchase-success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/shopping-cart",
        shipping_options: [{ shipping_rate: shipping_cost }],
      });
      res.status(200).json({ url: session.url });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  static async planCheckoutSession(req, res) {
    const { price } = req.body;
    try {
      const session = await stripe.checkout.sessions.create({
        billing_address_collection: "auto",
        line_items: [
          {
            price,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url:
          "http://localhost:3000/checkout/purchase-success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/shopping-cart",
      });
      res.status(200).json({ url: session.url });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
};
