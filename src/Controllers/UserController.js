import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorresponse, successresponse } from "../services/Errorhandler.js";
import { sendOTP } from "../services/sendMail.js";
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
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
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

  } catch {

    return errorresponse(res, 500, "internal server");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return errorresponse(res, 400, "User not Registered");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorresponse(res, 400, "Invalid email or password");
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return successresponse(res, 200,
      "Login successful", {
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
      return errorresponse(res, 404, "User not found");
    }

    user.username = username || user.username;
    user.role = role || user.role;


    await user.save();

    return successresponse(res, 200,
      "User updated successfully", {
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch {
    return errorresponse(res, 500, "internal server");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return errorresponse(res, 404, "User not found");
    }
    await user.deleteOne();
    return successresponse(res, 200, "User deleted successfully");
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
  catch {

    return errorresponse(res, 500, "internal server");
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📧 Forgot Password Request:", email);

    const user = await User.findOne({ email });
    if (!user) return errorresponse(res, 400, "User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await user.save({ validateBeforeSave: false });

    await sendOTP(user.email, otp);

    return successresponse(res, 200, "OTP sent to your email");
  } catch {
    return errorresponse(res, 500, "Something went wrong");
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // console.log(" Reset Password ", email);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });


    if (!user.resetOtp || user.resetOtp !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }


    if (Date.now() > user.resetOtpExpire) {
      return res.status(400).json({ message: "OTP expired" });
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;


    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return successresponse(res, 200, "Password reset successful. Please login again.");
  } catch {

    return errorresponse(res, 500, "Something went wrong");
  }
};

export const generateOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return successresponse(res,400, "User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 5 * 60 * 1000; // valid for 5 min
    await user.save({ validateBeforeSave: false });

    console.log("Generated OTP (Profile flow, testing only):", otp);

    return successresponse(res,200, "OTP generated successfully", otp ); 
  } catch  {
    ;
    return errorresponse(res,500, "Something went wrong" );
  }
};

export const checkmail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Checkmail request for:", email);

    if (!email) {
      return errorresponse(res,400, "Email is required" );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorresponse(res,404, "Email not found" );
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 min valid

  
    user.resetOtp = otp;
    user.resetOtpExpire = expiry;
    await user.save({ validateBeforeSave: false });

    
    await sendOTP(user.email, otp);

    return successresponse(res,200,
       "OTP sent to your email",{
      email: user.email,
      otp,
    });
  } catch  {
 
    return(res, 500, "Something went wrong" );
  }
};










