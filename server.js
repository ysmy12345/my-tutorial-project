const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Hello! testing</h1>");
});

app.listen(3000, () => {
  console.log("✅ start running：http://localhost:3000");
});