const express = require("express");
const cors = require("cors");

const userDetailRoute = require("./routes/userDetailRoute");
const issueRoutes = require("./routes/issueRoute");
const feedbackRoute = require("./routes/feedbackRoute");
const saveRoutes = require("./routes/saveRoutes");

const app = express();

/* =======================
   CORS — PRODUCTION SAFE
   ======================= */
app.use(
  cors({
    origin: [
      "https://vital-wellness.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// ❌ REMOVE app.options("*", cors());

app.use(express.json());

/* =======================
   ROUTES
   ======================= */
app.use("/api/user", userDetailRoute);
app.use("/api", issueRoutes);
app.use("/api", feedbackRoute);
app.use("/api", saveRoutes);

module.exports = app;
