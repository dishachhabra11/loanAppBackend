import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    loanTerm: {
      type: Number, // Loan term in weeks
      required: true,
      min: [1, "Loan term must be greater than or equal to 1 week"],
    },
    loanAmount: {
      type: Number,
      required: true, //loan cannot be negetive
      min: [0, "Loan amount must be greater than or equal to 0"],
    },
    loanStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "PAID"],
      default: "PENDING",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

LoanSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "loan",
});

export default mongoose.model("Loan", LoanSchema);
