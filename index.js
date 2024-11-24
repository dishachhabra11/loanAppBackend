import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRouter from "./routers/adminRouter.js";
import userRouter from "./routers/userRouter.js";
import {connectDB} from "./config/db.js";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173","https://loanappfrontend-dishachhabra.onrender.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log("Server is running on port 5000");
});
