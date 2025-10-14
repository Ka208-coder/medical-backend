import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Missing email credentials in environment variables");
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendOTP = async (to, otp) => {
  try {
   
    const mailOptions = {  
      from: process.env.EMAIL_USER,
      to,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
      
    };
    console.log("sending ",process.env.EMAIL_USER)

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email sent to", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error; 
  }
};
