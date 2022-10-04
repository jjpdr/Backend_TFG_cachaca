const router = require("express").Router();
const ProductController = require("../controllers/ProductController");

// middlewares
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post(
  "/create",
  verifyToken,
  imageUpload.single("images"),
  ProductController.create
);

router.get("/", ProductController.getAll);
router.get("/meusProdutos", ProductController.getAllUserProducts);
router.get("/listaCompras", verifyToken, ProductController.getAllUserCompras);
router.get("/:id", ProductController.getProductById);
router.delete("/:id", verifyToken, ProductController.removeProductById);
router.put(
  "/:id",
  verifyToken,
  imageUpload.single("images"),
  ProductController.updateProduct
);
router.get("/image/:id", ProductController.getImage);

module.exports = router;
