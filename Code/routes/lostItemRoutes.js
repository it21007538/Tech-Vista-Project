const express = require("express");
const router = express.Router();
const {
  addLostItem,
  getAllLostItems,
  getOneLostItem,
  updateLostItem,
  deleteLostItem,
} = require("../controllers/lostItemController");

router.route("/").post(addLostItem).get(getAllLostItems);
router
  .route("/:lostItemId")
  .get(getOneLostItem)
  .put(updateLostItem)
  .delete(deleteLostItem);

module.exports = router;
