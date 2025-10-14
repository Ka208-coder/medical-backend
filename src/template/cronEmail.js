import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

export const cronEmail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const __dirname = path.resolve();
    const templatePath = path.join(__dirname, "src", "template", "emailTemplate.ejs");

    
    const htmlContent = await ejs.renderFile(templatePath, { data });
    await transporter.sendMail({
      from: `"System Bot" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Automated Admin Report",
      html: htmlContent,
    });

    console.log("✅ Report email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending report:", error.message);
  }
};
