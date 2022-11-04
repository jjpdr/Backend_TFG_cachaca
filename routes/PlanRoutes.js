const router = require("express").Router();
const PlanController = require("../controllers/PlanController");

router.get("/", PlanController.getAllPlans);

module.exports = router;
