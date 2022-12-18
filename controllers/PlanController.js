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
      const stripePrices = await stripe.prices.list({
        type: "recurring",
        limit: 100,
      });
      const stripeProducts = await stripe.products.list({ limit: 100 });
      stripePrices.data.map((item) => {
        if (stripeProducts.data.length > 0) {
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
      res.status(400).json({ error: "erro" });
    }
  }

  static async getPlanById(req, res) {
    const id = req.params.id; //priceID
    try {
      const price = await stripe.prices.retrieve(id); //retrieving all prices
      const plan = await stripe.products.retrieve(price.product);

      res.status(200).json({ plan: plan });
    } catch {
      res.status(400).json({ error: "erro" });
    }
  }
};
