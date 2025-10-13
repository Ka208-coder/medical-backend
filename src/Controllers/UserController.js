import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorresponse, successresponse } from "../services/Errorhandler.js";
export const Signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log("Signup request:", req.body);

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorresponse(res, 400, "User already exists with this email");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return successresponse(res, 200, "Signup successful", {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch{
    
   return errorresponse(res, 500, "internal server");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return errorresponse(res,400, "User not Registered");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorresponse(res,400, "Invalid email or password" );
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return successresponse(res,200,
       "Login successful",{
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    }
    );

  } catch {
  
  return errorresponse(res, 500, "internal server");
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return errorresponse(res,404, "User not found" );
    }

    user.username = username || user.username;
    user.role = role || user.role;

  
    await user.save();

    return successresponse(res,200,
      "User updated successfully",{
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch  {
    return errorresponse(res, 500, "internal server");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id);
    if (!user){
     return errorresponse(res,404, "User not found");
    }
    await user.deleteOne();
    return successresponse(res,200, "User deleted successfully");
  }
  catch {
  return errorresponse(res, 500, "internal server");
  }
};


export const getalluser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      return errorresponse(res, 404, "No users found");
    }
    return successresponse(res, 200, "Users fetched successfully", {
      total: users.length,
      users,
    });
  } 
  catch  {
  
   return errorresponse(res, 500, "internal server");
  }
};

