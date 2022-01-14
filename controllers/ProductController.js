const Product = require("../models/Product");
const path = require("path");

//helpers
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const ObjectId = require("mongoose").Types.ObjectId;
const validateProduct = require("../helpers/validateProduct");

module.exports = class ProductController {
    // create a Product

    static async create(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token);

        const {
            name,
            brand,
            category,
            description,
            manufacturer,
            info,
            price,
        } = req.body;

        //create a product
        const product = new Product({
            name,
            brand,
            category,
            description,
            manufacturer,
            info,
            price,
            available,
            images,
            user: {
                _id: user._id,
                image: user.image,
            },
        });

        try {
            const newProduct = await product.save();
            res.status(201).json({
                message: "Produto cadastrado com sucesso!",
                newProduct,
            });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const products = await Product.find().sort("-createdAt");

        res.status(200).json({
            products,
        });
    }

    static async getAllUserProducts(req, res) {
        // get user
        const token = getToken(req);
        const user = await getUserByToken(token);

        const products = await Product.find({ "user._id": user._id }).sort(
            "-createdAt"
        );

        res.status(200).json({
            products,
        });
    }

    static async getAllUserCompras(req, res) {
        // get user
        const token = getToken(req);
        const user = await getUserByToken(token);

        const products = await Product.find({ "compra._id": user._id }).sort(
            "-createdAt"
        );

        res.status(200).json({
            products,
        });
    }

    static async getProductById(req, res) {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        // check if product exist
        const product = await Product.findOne({ _id: id });

        if (!product) {
            res.status(404).json({
                message: "Produto não encontrado!",
            });
        }

        res.status(200).json({
            product,
        });
    }

    static async removeProductById(req, res) {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        const product = await Product.findOne({ _id: id });

        if (!product) {
            res.status(404).json({ message: "Produto não encontrado!" });
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        if (
            user.isAdmin ||
            product.user_id.toString() === user._id.toString()
        ) {
            await Product.findByIdAndRemove(id);
            res.status(200).json({ message: "Produto removido com sucesso!" });
            return;
        }

        res.status(404).json({
            message:
                "Houve um problema em processar sua solicitação, tente novamente mais tarde!",
        });
    }

    static async getImage(req, res) {
        const { id } = req.params;

        res.sendFile(path.resolve(`public/images/products/${id}`));
    }

    static async updateProduct(req, res) {
        const id = req.params.id;
        const name = req.body.name;
        const brand = req.body.brand;
        const category = req.body.category;
        const description = req.body.description;
        const manufacturer = req.body.manufacturer;
        const info = req.body.info;
        const price = req.body.price;
        const available = req.body.available;

        const updateData = {};

        // check if product exists
        const product = await Product.findOne({ _id: id });

        if (!product) {
            res.status(404).json({ message: "Produto não encontrada!" });
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        if (
            product.user._id.toString() !== user._id.toString() &&
            !user.isAdmin
        ) {
            res.status(401).json({
                message:
                    "Você não possui permissões para atualizar esse produto!",
            });
            return;
        }

        if (validateProduct(product)) {
            updateData.name = name;
            updateData.brand = brand;
            updateData.category = category;
            updateData.description = description;
            updateData.manufacturer = manufacturer;
            updateData.info = info;
            updateData.price = price;
            await Product.findByIdAndUpdate(id, updateData);

            res.status(200).json({
                product,
                message: "Produto atualizado com sucesso!",
            });
            return;
        }

        res.status();
    }
};
