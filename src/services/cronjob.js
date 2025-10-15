// src/cron/cronJob.js
import cron from "node-cron";
import { cronEmail } from "../template/cronEmail.js";
import { getDashboardStats } from "../functions/function.js";

cron.schedule("*/40 * * * *", async () => {
  console.log("⏰ Sending report email...");

  try {
    const stats = await getDashboardStats();

    const data = [
      { title: "Total Users", value: stats.totalUsers },
      { title: "New Signups Today", value: stats.todayUsers },
      { title: "Total Assets", value: stats.totalAssets },
      { title: "Assets Added Today", value: stats.todayAssets },
      { title: "Server Status", value: "🟢 Online" },
    ];

    await cronEmail(data);
    console.log("✅ Report email sent successfully");
  } catch (error) {
    console.error("❌ Error sending report email:", error);
  }
});
