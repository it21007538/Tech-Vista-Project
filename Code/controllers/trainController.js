const Train = require("../models/Train");

async function generateTrainId() {
  let trainNumber = await Train.countDocuments({});
  return trainNumber < 9
    ? "t00" + (trainNumber + 1)
    : "t0" + (trainNumber + 1);
}

const addTrain = async (req, res) => {
  const newTrain = new Train(req.body);
  try {
    newTrain.trainId = await generateTrainId();
    try {
      const train = await newTrain.save();
      res.status(200).json(train);
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    console.log(err);
  }
};

const getOneTrain = async (req, res) => {
  try {
    const train = await Train.findOne({ trainId: req.params.trainId });
    res.status(200).json(train);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllTrains = async (req, res) => {
  const trainId = req.params.trainId;
  try {
    let trains;
    if (trainId) {
      trains = await Train.findOne({ trainId: req.params.trainId });
    } else {
      trains = await Train.find();
    }
    res.status(200).json(trains);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateTrain = async (req, res) => {
  try {
    const updatedTrain = await Train.findOneAndUpdate(
      { trainId: req.params.trainId },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedTrain);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteTrain = async (req, res) => {
  try {
    const deletedTrain = await Train.findOneAndDelete({
      trainId: req.params.trainId,
    });
    console.log(deletedTrain);
    res.status(200).json("Train has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  addTrain,
  getAllTrains,
  getOneTrain,
  updateTrain,
  deleteTrain,
};
