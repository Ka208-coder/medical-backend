import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Server running...");
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
