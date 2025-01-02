const express = require("express");
const Chat = require("../model/chat.model");
const User = require("../model/user.model");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { role, content, token, userId } = req.body;
    if (!role || !content || !token || !userId) {
      throw new Error("role, content, token and userId are required");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User does not exists",
      });
    }

    // Create new chat
    const newChat = new Chat({
      role,
      content,
      token,
      userId,
    });

    // Save chat to database
    await newChat.save();

    if (newChat) {
      return res.status(201).json({
        status: "success",
        message: "Chat added successfully",
        data: newChat,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/list", async (req, res) => {
  try {
    const chats = await Chat.find().populate("userId");
    res.status(200).json({
      status: "success",
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;