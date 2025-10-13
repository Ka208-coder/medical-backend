import express from "express";
import {Signup,login,updateUser,deleteUser,getalluser} from "../Controllers/UserController.js";
import {checkAdmin} from "../middleware/Authcheck.js";
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", login);
router.get("/update/:id",checkAdmin,updateUser );
router.delete("/delete/:id", checkAdmin, deleteUser);
router.get("/getall", checkAdmin, getalluser);
export default router;