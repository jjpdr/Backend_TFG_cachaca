const mongoose = require("../db/conn");
const { Schema } = mongoose;

const User = mongoose.model(
  "User",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
      cpf: {
        type: String,
        required: true,
      },
      birthday: {
        type: Date,
        required: true,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
      plan: {
        type: String,
        enum: ["FREE", "MEDIUM", "PREMIUM"],
        default: "FREE",
      },
      address: {
        street: String,
        city: String,
        country: String,
        phone: String,
        zipCode: String,
        state: String,
      },
      paymentMethod: [
        {
          number: String,
          cvc: String,
          expiry: String,
          name: String,
        },
      ],
    },
    { timestamps: true }
  )
);

module.exports = User;
