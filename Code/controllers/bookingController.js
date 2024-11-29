const Booking = require("../models/Booking");
const User = require("../models/User");
const Train = require("../models/Train");

async function generateBookingId() {
  let bookingNumber = await Booking.countDocuments({});
  return bookingNumber < 9
    ? "b00" + (bookingNumber + 1)
    : "b0" + (bookingNumber + 1);
}

const addBooking = async (req, res) => {
  const newBooking = new Booking(req.body);
  try {
    newBooking.bookingId = await generateBookingId();
    try {
      const booking = await newBooking.save();
      res.status(200).json(booking);
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    console.log(err);
  }
};

const getOneBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId,
    }).populate("train").populate("user");
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllBookings = async (req, res) => {
  const bookingId = req.params.bookingId;
  try {
    let bookings;
    if (bookingId) {
      bookings = await Booking.findOne({ bookingId: req.params.bookingId }).populate("train").populate("user");
    } else {
      bookings = await Booking.find().populate("train").populate("user");
    }
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findOneAndUpdate(
      { bookingId: req.params.bookingId },
      {
        $set: req.body,
      },
      { new: true }
    ).populate("train").populate("user");
    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findOneAndDelete({
      bookingId: req.params.bookingId,
    });
    console.log(deletedBooking);
    res.status(200).json("Booking has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  addBooking,
  getAllBookings,
  getOneBooking,
  updateBooking,
  deleteBooking,
};
