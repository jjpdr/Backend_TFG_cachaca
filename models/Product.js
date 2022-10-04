const mongoose = require("../db/conn");
const { Schema } = mongoose;

const product = mongoose.model(
  "product",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      brand: {
        type: String,
        required: true,
      },
      category: {
        type: String,
      },
      description: {
        type: String,
      },
      manufacturer: {
        type: String,
      },
      info: {
        type: String,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = product;
