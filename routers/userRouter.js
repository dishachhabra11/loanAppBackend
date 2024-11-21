import { Router } from "express";
import { userAuthMiddleware } from "../middleware/authMiddleware.js";
import { signupUser, signInUser } from "../controllers/authController.js";
import { getUserLoans, createLoan, deleteLoan } from "../controllers/loanController.js";
import { payPayment } from "../controllers/paymentController.js";

const userRouter = Router();

userRouter.post("/signup", (req, res) => {
  signupUser(req, res);
});

userRouter.post("/signin", (req, res) => {
  signInUser(req, res);
});

userRouter.get("/loans", userAuthMiddleware, (req, res) => {
  getUserLoans(req, res);
});

userRouter.post("/createLoan", userAuthMiddleware, (req, res) => {
  createLoan(req, res); 
});

userRouter.delete("/deleteLoan/:id", userAuthMiddleware, (req, res) => {
  deleteLoan(req, res); 
});

userRouter.put("/payPayment/:id", userAuthMiddleware, (req, res) => {
  payPayment(req, res); 
});

export default userRouter;
