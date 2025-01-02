const express = require("express");
const User = require("../model/user.model");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("email, password and email are required");
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      throw new Error("Username, password and email are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      username,
      password,
      email,
    });

    // Save user to database
    await newUser.save();
    if (newUser) {
      return res.status(200).json({
        status: "success",
        message: "User registered successfully",
        user: newUser,
      });
    }

    res.status(400).json({
      status: "error",
      message: "User registration failed",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
