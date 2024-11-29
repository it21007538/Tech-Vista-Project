const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendTokenResponse = async (res, user, message) => {
  const accessToken = generateToken(user);

  res.status(200).json({
    data: { user, access_token: accessToken },
    message,
  });
};

const generateToken = (user) => {
  return jwt.sign({ data: user }, process.env.JWT_SECRET || "jsecret", {
    expiresIn: `30d`,
  });
};

async function generateUserId() {
  let userNumber = await User.countDocuments({});
  console.log("Users List", userNumber);
  return userNumber < 9 ? "u00" + (userNumber + 1) : "u0" + (userNumber + 1);
}

const registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
    role: req.body.role,
  });
  try {
    newUser.userId = await generateUserId();
    try {
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const query = { email: req.body.email.toString() };
    const user = await User.findOne(query);

    console.log(req.body.password);
    if (!user) {
      res.status(400).json("Wrong credentials");
    } else {
      const validated = await bcrypt.compare(req.body.password, user.password);
      if (!validated) {
        res.status(400).json("Wrong credentials");
      } else {
        const { password, ...others } = user._doc;
        console.log(others);
        sendTokenResponse(res, others, "successful");
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllUsers = async (req, res) => {
  const userId = req.params.userId;
  try {
    let users;
    if (userId) {
      users = await User.findOne({ userId: req.params.userId });
    } else {
      users = await User.find();
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { userId: req.params.userId },
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({
            userId: req.params.userId,
        });
        console.log(deletedUser);
        res.status(200).json("User has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { registerUser, loginUser, getOneUser, getAllUsers, updateUser, deleteUser};
