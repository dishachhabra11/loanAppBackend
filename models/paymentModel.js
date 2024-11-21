import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
      min: [0, "Payment amount must be greater than or equal to 0"],
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", PaymentSchema);
