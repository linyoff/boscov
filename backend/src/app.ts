import express from "express";
import userRoutes from "./routes/user.routes";
import { setupSwagger } from "./swagger";

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

setupSwagger(app);

export default app;