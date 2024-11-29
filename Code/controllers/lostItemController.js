const LostItem = require("../models/LostItem");

async function generateLostItemId() {
  let lostItemNumber = await LostItem.countDocuments({});
  return lostItemNumber < 9
    ? "l00" + (lostItemNumber + 1)
    : "l0" + (lostItemNumber + 1);
}

const addLostItem = async (req, res) => {
  const newLostItem = new LostItem(req.body);
  try {
    newLostItem.lostItemId = await generateLostItemId();
    try {
      const lostItem = await newLostItem.save();
      res.status(200).json(lostItem);
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    console.log(err);
  }
};

const getOneLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findOne({
      lostItemId: req.params.lostItemId,
    });
    res.status(200).json(lostItem);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllLostItems = async (req, res) => {
  const lostItemId = req.params.lostItemId;
  try {
    let lostItems;
    if (lostItemId) {
      lostItems = await LostItem.findOne({ lostItemId: req.params.lostItemId });
    } else {
      lostItems = await LostItem.find();
    }
    res.status(200).json(lostItems);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateLostItem = async (req, res) => {
  try {
    const updatedLostItem = await LostItem.findOneAndUpdate(
      { lostItemId: req.params.lostItemId },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedLostItem);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteLostItem = async (req, res) => {
  try {
    const deletedLostItem = await LostItem.findOneAndDelete({
      lostItemId: req.params.lostItemId,
    });
    console.log(deletedLostItem);
    res.status(200).json("Lost Item has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  addLostItem,
  getAllLostItems,
  getOneLostItem,
  updateLostItem,
  deleteLostItem,
};
