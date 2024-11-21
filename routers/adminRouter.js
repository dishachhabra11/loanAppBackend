import { Router } from "express";
import { adminAuthMiddleware } from "../middleware/authMiddleware.js";
import { adminSignIn, adminSignUp } from "../controllers/authController.js";
import { getAllLoans, approveLoan } from "../controllers/loanController.js";

const adminRouter = Router();

adminRouter.post("/signin", (req, res) => {
  adminSignIn(req, res);
});

adminRouter.post("/signup", (req, res) => {
  adminSignUp(req, res);
});

adminRouter.get("/loans", adminAuthMiddleware, (req, res) => {
  getAllLoans(req, res);
});

adminRouter.put("/approveLoan/:id", adminAuthMiddleware, (req, res) => {
  approveLoan(req, res);
});

export default adminRouter;
