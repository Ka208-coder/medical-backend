import express from "express";
import { Signup, login, updateUser, deleteUser, getalluser, forgotPassword, resetPassword, generateOtp, checkmail } from "../controllers/UserController.js";
import { checkAdmin } from "../middleware/Authcheck.js";
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", login);
router.get("/update/:id", checkAdmin, updateUser);
router.delete("/delete/:id", checkAdmin, deleteUser);
router.get("/getall", checkAdmin, getalluser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/generate-otp", generateOtp);
router.post("/checkmail", checkmail);
export default router;