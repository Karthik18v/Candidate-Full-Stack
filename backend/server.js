const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const candidateRoutes = require("./routes/candidateRoutes");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/candidates", candidateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Runnning At http://localhost:5000`));
