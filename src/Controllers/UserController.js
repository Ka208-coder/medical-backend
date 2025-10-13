import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const Signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log("Signup request:", req.body);

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
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

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    console.log("User signup successful");

  } catch (err) {
    console.error("Error in signup:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not Registered" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.role = role || user.role;

  
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error in updateUser:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id);
    if (!user){
      res.status(404).json({message: "User not found"});
    }
    await user.deleteOne();
    res.status(200).json({message: "User deleted successfully"});
    console.log("User Deletes By Admin Side..........")
  }
  catch (err) {
    console.error("Error:", err);
    res.status(500).json({message: "internal Server issues.............."});
  }
};


export const getalluser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users){
      res.status(404).json({message: "User not found"});
    }

    // console.log("user................",users);

    res.status(200).json({
      status: "success",
      total:users.length,
      users:users
    });

  }
  catch (err) {
    console.error("Error:", err);
    res.status(500).json({message: "internal Server issues.............."});
  }
}