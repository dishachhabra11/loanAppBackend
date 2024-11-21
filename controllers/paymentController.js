import Payment from "../models/paymentModel.js";

export const payPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if (payment.status === "PAID") {
      return res.status(400).json({ error: "This payment is already paid" });
    }

    payment.status = "PAID";
    await payment.save();

    res.status(200).json({
      message: "Payment marked as paid successfully",
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
