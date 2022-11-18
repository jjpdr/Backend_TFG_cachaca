const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Destination to store image
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = "";

        if (req.baseUrl.includes("users")) {
            folder = "public/images/users";
        } else if (req.baseUrl.includes("products")) {
            folder = "public/images/products";
        }

        console.log(folder);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() +
                String(Math.floor(Math.random() * 100)) +
                path.extname(file.originalname)
        );
    },
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            // upload only png and jpg format
            return cb(new Error("Por favor, envie apenas png ou jpg!"));
        }
        cb(undefined, true);
    },
});

module.exports = { imageUpload };
