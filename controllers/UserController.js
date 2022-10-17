const User = require("../models/User");
const Product = require("../models/Product");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// helpers

const getToken = require("../helpers/get-token");
const createUserToken = require("../helpers/create-user-token");
const getUserByToken = require("../helpers/get-user-by-token");
const { imageUpload } = require("../helpers/image-upload");
const validateUser = require("../helpers/validateUser");

module.exports = class UserController {
  static async register(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const cpf = req.body.cpf;
    const birthday = req.body.birthday;
    const password = req.body.password;
    const isAdmin = req.body.isAdmin;
    const image = req.body.image;

    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(422).json({
        message: "Por favor, utilize outro e-mail!",
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name: name,
      email: email,
      cpf: cpf,
      birthday: birthday,
      password: passwordHash,
      isAdmin: isAdmin,
      image: image,
    });

    if (!validateUser(user)) {
      res.status(422).json({
        message: "Preencha todos os campos marcados com *!",
      });
      return;
    }

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({
        message: "erro",
      });
      return;
    }
  }

  static async login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(422).json({
        message: "Usuário ou senha inválidos!",
      });
      return;
    }
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({
        message: "Usuário ou senha inválidos!",
      });
      return;
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "nossosecret");

      currentUser = await User.findById(decoded.id);

      currentUser.password = undefined;
    } else {
      res.status(400).send({ erro: "não autorizado" });
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    res.status(200).json({ user });
  }

  static async getUserByEmail(req, res) {
    const email = req.params.email;

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    await createUserToken(user, req, res);
  }

  static async editUser(req, res) {
    const id = req.params.id;

    //check if user exists
    const user = await User.findById(id);

    const { name, email, cpf, birthday } = req.body;

    if (req.file) {
      user.image = req.file.filename;
    }

    //validations

    // check if email has already taken
    const userExists = await User.findOne({ email: email });

    if (user.email !== email && userExists) {
      res.status(422).json({
        message: "Por favor, utilize outro e-mail!",
      });
      cl;
      return;
    }

    user.name = name;

    user.email = email;

    user.cpf = cpf;

    user.birthday = birthday;

    try {
      //returns user updated data
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );
      res.status(200).json({
        message: "Usuário atualizado com sucesso",
      });
    } catch (err) {
      res.status(500).json({ message: err });
      return;
    }
  }

  static async addPaymentMethod(req, res) {
    try {
      const id = req.params.id;

      const { name, number, cvc, expiry } = req.body;

      const user = await User.findOne({ _id: id });

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado!" });
        return;
      }

      const updateData = user.paymentMethod || [];

      updateData.push({ name, number, cvc, expiry });

      await User.findByIdAndUpdate(id, { paymentMethod: updateData });

      res.status(200).json({
        message: "Método de pagamento adicionado com sucesso!",
      });
    } catch (err) {
      res.status(500).json({ message: err });
      return;
    }
  }

  static async addAddress(req, res) {
    try {
      const id = req.params.id;
      const { street, number, borough, city, zipCode, state, country, phone } =
        req.body;

      const user = await User.findOne({ _id: id });

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado!" });
        return;
      }

      const updateData = {
        street,
        number,
        borough,
        city,
        zipCode,
        state,
        country,
        phone,
      };

      await User.findByIdAndUpdate(id, { address: updateData });
      res.status(200).json({
        message: "Informações de contato atualizadas com sucesso!",
      });
    } catch (err) {
      res.status(500).json({ message: err });
      return;
    }
  }

  static async deletePaymentMethodByID(req, res) {
    try {
      const id = req.params.id;

      const { paymentID } = req.body;

      const user = await User.findOne({ _id: id });

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado!" });
        return;
      }

      const updateData = user.paymentMethod || [];

      updateData.forEach((payment) => {
        if (payment._id.toString() === paymentID) {
          updateData.splice(updateData.indexOf(payment), 1);
        }
      });

      await User.findByIdAndUpdate(id, {
        paymentMethod: updateData,
      });
      res.status(200).json({
        message: "Método de pagamento removido com sucesso!",
      });
    } catch (err) {
      res.status(500).json({ message: err });
      return;
    }
  }

  static async getAll(req, res) {
    try {
      const users = await User.find();
      res.status(200).json({
        users,
      });
    } catch (err) {
      res.status(500).json({ message: err });
      return;
    }
  }

  static async updateUser(req, res) {
    const id = req.params.id;
    const { name, email, cpf, birthday, plan } = req.body;

    const updateData = {};

    // check if product exists
    const user = await User.findOne({ _id: id });

    if (!user) {
      res.status(404).json({ message: "Produto não encontrado!" });
      return;
    }

    const token = getToken(req);

    if (validateUser(user)) {
      updateData.name = name;
      updateData.email = email;
      updateData.cpf = cpf;
      updateData.birthday = birthday;
      updateData.plan = plan;

      await User.findByIdAndUpdate(id, {
        name: updateData.name,
        email: updateData.email,
        cpf: updateData.cpf,
        birthday: updateData.birthday,
        plan: updateData.plan,
      });

      res.status(200).json({
        message: "Usuário atualizado com sucesso!",
      });

      return;
    }

    res.status();
  }

  static async checkoutSession(req, res) {
    const { line_items, shipping_cost } = req.body;
    try {
      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: "https://example.com/success",
        cancel_url: "http://localhost:3000/shopping-cart",
        shipping_options: [{ shipping_rate: shipping_cost }],
      });
      res.status(200).json({ url: session.url });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
};
