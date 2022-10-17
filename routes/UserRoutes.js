const router = require("express").Router();

const UserController = require("../controllers/UserController");
const { imageUpload } = require("../helpers/image-upload");
// middleware
const verifyToken = require("../helpers/verify-token");

router.get("/", UserController.getAll);
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
router.put("/:id", verifyToken, UserController.updateUser);
router.post("/payment-method/:id", UserController.addPaymentMethod);
router.put("/payment-method/:id", UserController.deletePaymentMethodByID);
router.post("/address/:id", UserController.addAddress);

router.post("/create-checkout-session", UserController.checkoutSession);

module.exports = router;
