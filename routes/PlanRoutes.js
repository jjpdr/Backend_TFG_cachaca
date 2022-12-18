const router = require("express").Router();
const PlanController = require("../controllers/PlanController");

router.get("/", PlanController.getAllPlans);
router.get("/:id", PlanController.getPlanById);

module.exports = router;
