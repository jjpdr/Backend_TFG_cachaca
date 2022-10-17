const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Config JSON response
app.use(express.json());

// Solve CORS
app.use(cors());

// Public folder for images
app.use(express.static("public"));

// Routes

const UserRoutes = require("./routes/UserRoutes");
const ProductRoutes = require("./routes/ProductRoutes");

app.use("/users", UserRoutes);
app.use("/products", ProductRoutes);

app.listen(5000);
