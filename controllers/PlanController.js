const stripe = require("stripe")(
  "sk_test_51LrVO8JQSrJ9pyRJdyxFUYf5gVhvosbtY6oNaDk0x1OK4Dhm8krmuLdwPZL8o1xqt8gEMRndHTQrz8vvwV3mXQ8D00C0cSrSTb"
);

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
