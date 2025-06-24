require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("📦 Parcel Server is running");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
