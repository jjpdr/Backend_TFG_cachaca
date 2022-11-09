const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = class PlanController {
  static async getAllPlans(req, res) {
    let planObject = {
      priceID: "",
      productID: "",
      name: "",
      description: "",
      price: 0,
      lookup_key: "",
    };
    let plans = [];
    try {
      const stripePrices = await stripe.prices.list({});
      const stripeProducts = await stripe.products.list({});
      stripePrices.data.map((item) => {
        if (item.type === "recurring" && stripeProducts.data) {
          const product = stripeProducts.data.find(
            (product) => product.id === item.product
          );
          planObject = {
            priceID: item.id,
            productID: item.product,
            name: product.name,
            description: product.description || "",
            price: item.unit_amount / 100,
            lookup_key: item.lookup_key,
          };
          plans.push(planObject);
        }
      });
      res.status(200).json({ plans: plans });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
};
