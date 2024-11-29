const Payment = require("../models/Payment");

async function generatePaymentId() {
  let paymentNumber = await Payment.countDocuments({});
  return paymentNumber < 9
    ? "p00" + (paymentNumber + 1)
    : "p0" + (paymentNumber + 1);
}

const addPayment = async (req, res) => {
  const newPayment = new Payment(req.body);
  try {
    newPayment.paymentId = await generatePaymentId();
    try {
      const payment = await newPayment.save();
      res.status(200).json(payment);
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    console.log(err);
  }
};

const getOnePayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId });
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllPayments = async (req, res) => {
  const paymentId = req.params.paymentId;
  try {
    let payments;
    if (paymentId) {
      payments = await Payment.findOne({ paymentId: req.params.paymentId });
    } else {
      payments = await Payment.find();
    }
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { paymentId: req.params.paymentId },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedPayment);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findOneAndDelete({
      paymentId: req.params.paymentId,
    });
    console.log(deletedPayment);
    res.status(200).json("Payment has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  addPayment,
  getAllPayments,
  getOnePayment,
  updatePayment,
  deletePayment,
};
