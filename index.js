import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRoutes from "./src/routes/UserRoutes.js";
import AssetsRoutes from "./src/Routes/AssetsRoutes.js";
import "./src/services/cronjob.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/user", UserRoutes);
app.use("/api/assets", AssetsRoutes);


app.use("/uploads", express.static("uploads"));




mongoose.connect(process.env.Database_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
