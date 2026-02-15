const express = require("express");
const cors = require("cors");

const userDetailRoute = require("./routes/userDetailRoute");
const issueRoutes = require("./routes/issueRoute");
const feedbackRoute = require("./routes/feedbackRoute");
const saveRoutes = require("./routes/saveRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api/user", userDetailRoute);
app.use("/api", issueRoutes);
app.use("/api", feedbackRoute);
app.use("/api", saveRoutes);

module.exports = app;
