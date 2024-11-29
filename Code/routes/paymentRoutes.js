const express = require("express");
const router = express.Router();
const {
  addPayment,
    getAllPayments,
    getOnePayment,
    updatePayment,
    deletePayment,
} = require("../controllers/paymentController");

router.route("/").post(addPayment).get(getAllPayments);
router
  .route("/:paymentId")
  .get(getOnePayment)
  .put(updatePayment)
  .delete(deletePayment);

module.exports = router;
