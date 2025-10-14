import cron from "node-cron";
import { cronEmail } from "../template/cronEmail.js";
const getData = () => [
  { title: "Total Users", value: 123 },
  { title: "New Signups", value: 8 },
  { title: "Server Status", value: "🟢 Online" },
];
cron.schedule("*/30 * * * *", async () => {
  console.log(" Sending report email...");
  const data = getData();
  await cronEmail(data);
});
