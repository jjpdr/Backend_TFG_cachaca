const Marca = require("../models/Marca");
const path = require("path");

//helpers
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const ObjectId = require("mongoose").Types.ObjectId;
const validateMarca = require("../helpers/validateMarca");

module.exports = class MarcaController {
    // create a Marca

    static async create(req, res) {
        const {
            nome,
            marca_produto,
            categoria,
            descricao,
            fabricante,
            caracteristica,
            preco,
            image,
        } = req.body;

        const token = getToken(req);
        const user = await getUserByToken(token);

        //create a marca
        const marca = new Marca({
            nome,
            marca_produto,
            categoria,
            descricao,
            fabricante,
            caracteristica,
            preco,
            available,
            images,
            user: {
                _id: user._id,
                image: user.image,
            },
        });

        if (validateMarca(marca)) {
            const newMarca = await marca.save();
            res.status(201).json({
                message: "Marca Cadastrada Com Sucesso!",
                newMarca,
            });
            return;
        }

        res.status(500).json({ message: error });
    }

    static async getAll(req, res) {
        const marcas = await Marca.find().sort("-createdAt");

        res.status(200).json({
            marcas: marcas,
        });
    }

    static async getAllUserMarcas(req, res) {
        // get user
        const token = getToken(req);
        const user = await getUserByToken(token);

        const marcas = await Marca.find({ "user._id": user._id }).sort(
            "-createdAt"
        );

        res.status(200).json({
            marcas,
        });
    }

    static async getAllUserCompras(req, res) {
        // get user
        const token = getToken(req);
        const user = await getUserByToken(token);

        const marcas = await Marca.find({ "compra._id": user._id }).sort(
            "-createdAt"
        );

        res.status(200).json({
            marcas,
        });
    }

    static async getMarcaById(req, res) {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        // check if marca exist
        const marca = await Marca.findOne({ _id: id });

        if (!marca) {
            res.status(404).json({
                message: "Marca não encontrada!",
            });
        }

        res.status(200).json({
            marca: marca,
        });
    }

    static async removeMarcaById(req, res) {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        const marca = await Marca.findOne({ _id: id });

        if (!marca) {
            res.status(404).json({ message: "Cachaça não encontrada!" });
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        if (user.isAdmin || marca.user_id.toString() === user._id.toString()) {
            await Marca.findByIdAndRemove(id);
            res.status(200).json({ message: "Cachaça removida com sucesso!" });
            return;
        }

        res.status(404).json({
            message:
                "Houve um problema em processar sua solicitação, tente novamente mais tarde!",
        });
    }

    static async getImage(req, res) {
        const { id } = req.params;

        res.sendFile(path.resolve(`public/images/marcas/${id}`));
    }

    static async updateMarca(req, res) {
        const id = req.params.id;
        const nome = req.body.nome;
        const marca_produto = req.body.marca_produto;
        const categoria = req.body.categoria;
        const descricao = req.body.descricao;
        const fabricante = req.body.fabricante;
        const caracteristica = req.body.caracteristica;
        const preco = req.body.preco;
        const available = req.body.available;

        const updateData = {};

        // check if marca exists
        const marca = await Marca.findOne({ _id: id });

        if (!marca) {
            res.status(404).json({ message: "Produto não encontrada!" });
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        if (marca.user._id.toString() !== user._id.toString()) {
            res.status(401).json({
                message:
                    "Você não possui permissões para atualizar esse produto!",
            });
            return;
        }

        // validations

        if (validateMarca(marca)) {
            updateData.nome = nome;
            updateData.marca_produto = marca_produto;
            updateData.categoria = categoria;
            updateData.descricao = descricao;
            updateData.fabricante = fabricante;
            updateData.caracteristica = caracteristica;
            updateData.preco = preco;
            await Marca.findByIdAndUpdate(id, updateData);

            res.status(200).json({
                marca: marca,
                message: "Marca atualizado com sucesso!",
            });
            return;
        }

        res.status()
    }
};
