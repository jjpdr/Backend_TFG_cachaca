const router = require("express").Router();

const UserController = require("../controllers/UserController");
const { imageUpload } = require("../helpers/image-upload");
// middleware
const verifyToken = require("../helpers/verify-token");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.get("/email/:email", UserController.getUserByEmail);
router.patch(
  "/edit/:id",
  verifyToken,
  imageUpload.single("image"),
  UserController.editUser
);
router.post("/payment-method/:id", UserController.addPaymentMethod);

module.exports = router;
