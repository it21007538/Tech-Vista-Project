const express = require("express");
const router = express.Router();
const { addBooking, getAllBookings, getOneBooking, updateBooking, deleteBooking } = require("../controllers/bookingController");

router.route("/").post(addBooking).get(getAllBookings);
router.route("/:bookingId").get(getOneBooking).put(updateBooking).delete(deleteBooking);

module.exports = router;
