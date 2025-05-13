import express from "express";
import userRoutes from "./routes/user.routes";

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

export default app;