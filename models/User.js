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
    },
    { timestamps: true }
  )
);

module.exports = User;
