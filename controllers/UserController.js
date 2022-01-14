const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

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
        });

        if (!validateUser(user)) {
            res.status(422).json({
                message: "Preencha todos os campos marcados com *!",
            });
        }

        try {
            const newUser = await user.save();
            await createUserToken(newUser, req, res);
        } catch (error) {
            res.status(500).json({ message: "error" });
        }
    }

    static async login(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email });
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!user || !checkPassword) {
            return res.status(422).json({
                message: "Usuário ou senha inválidos!",
            });
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
            currentUser = null;
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
        const token = getToken(req);
        const user = await getUserByToken(token);

        const { name, email, cpf, date, password, confirmPassword } = req.body;

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

        user.email = email;

        user.cpf = cpf;

        user.birthday = birthday;

        if (password !== confirmPassword) {
            res.status(422).json({
                message: "As senhas não conferem!",
            });
            return;
        } else if (password === confirmPassword && password !== null) {
            // creating password
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);

            user.password = passwordHash;
        }
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
};
