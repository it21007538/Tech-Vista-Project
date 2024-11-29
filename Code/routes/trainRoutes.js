const express = require("express");
const router = express.Router();
const {
  addTrain, getAllTrains, getOneTrain, updateTrain, deleteTrain
} = require("../controllers/trainController");

router.route("/").post(addTrain).get(getAllTrains);
router
  .route("/:trainId")
  .get(getOneTrain)
  .put(updateTrain)
  .delete(deleteTrain);

module.exports = router;
