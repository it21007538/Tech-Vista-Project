const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getAllUsers, getOneUser, updateUser,deleteUser } = require("../controllers/userController");

router.route("/").post(registerUser).get(getAllUsers);
router.route("/login").post(loginUser);
router.route("/:userId").get(getOneUser).put(updateUser).delete(deleteUser);

module.exports = router;
