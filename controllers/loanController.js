import Loan from "../models/loanModel.js";
import Payment from "../models/paymentModel.js";

export const createLoan = async (req, res) => {
  try {
    const { loanTerm, loanAmount } = req.body;

    if (!loanTerm || !loanAmount) {
      return res.status(400).json({ error: "Loan term and amount are required" });
    }
    
    const userId = req.user._id || "673d8fafe1b94e8eeaa0b93d";
    const newLoan = new Loan({
      user: userId,
      loanTerm,
      loanAmount,
      loanStatus: "PENDING",
    });

    let repaymentAmount = Math.floor(loanAmount / loanTerm);
    let remainingAmount = loanAmount - repaymentAmount * loanTerm;

    const payments = [];
    let paymentDate = new Date();
    paymentDate.setDate(paymentDate.getDate() + 7);

    for (let i = 0; i < loanTerm; i++) {
      let amountToPay = repaymentAmount;
      if (i === loanTerm - 1) {
        amountToPay += remainingAmount;
      }

      payments.push({
        loan: newLoan._id,
        dueDate: paymentDate,
        paymentAmount: amountToPay,
        status: "PENDING",
      });

      paymentDate.setDate(paymentDate.getDate() + 7);
    }

    await newLoan.save();
    await Payment.insertMany(payments);

    res.status(201).json({
      message: "Loan and payments created successfully",
      loan: newLoan,
      payments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserLoans = async (req, res) => {
  try {
    console.log("user is",String(req.user._id));
    const userId = req.user._id ;

    const loans = await Loan.find({ user: userId }).populate("payments").populate("user");

    if (!loans.length) {
      return res.status(404).json({ message: "No loans found for this user" });
    }

    res.status(200).json({
      message: "Loans retrieved successfully",
      loans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("user");

    if (!loans.length) {
      return res.status(404).json({ message: "No loans found" });
    }

    res.status(200).json({
      message: "All loans retrieved successfully",
      loans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const approveLoan = async (req, res) => {
  try {
    const loanId = req.params.id;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // Update loan status to approved
    loan.loanStatus = "APPROVED";
    await loan.save();

    res.status(200).json({
      message: "Loan approved successfully",
      loan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const loanId = req.params.id;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    await Payment.deleteMany({ loan: loanId });

    await Loan.findByIdAndDelete(loanId);

    res.status(200).json({
      message: "Loan and its payments deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
