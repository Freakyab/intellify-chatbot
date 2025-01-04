const express = require("express");
const Chat = require("../model/chat.model");
const User = require("../model/user.model");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { backendData } = req.body;
    console.log(backendData[0].timeStamp);
    if (backendData.length < 2) {
      return res.status(400).json({
        status: "error",
        message: "Invalid data",
      });
    }

    // write the promise to save the chat data from backendData save first index first then second index
    const chat = await Chat.create(backendData[1]);
    const chat1 = await Chat.create(backendData[0]);

    if (!chat || !chat1) {
      return res.status(400).json({
        status: "error",
        message: "Chat not created",
      });
    }

    chat.save();
    chat1.save();
    console.log(chat,chat1);

    res.status(200).json({
      status: "success",
      message: "Chat created successfully",
      data: chat,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/prev/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    if (!chatId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid chat",
      });
    }

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user",
      });
    }
    const chat = await Chat.find({ chatId: chatId, userId: userId });

    const sortedChat = chat.sort((a, b) => {
      return new Date(a.timeStamp) - new Date(b.timeStamp);
    });

    // only select the role and content from the chat
    const filterChat = sortedChat.map((chat) => {
      return {
        id: chat._id,
        role: chat.role,
        content: chat.content,
      };
    });
    // total token count
    const totalToken = sortedChat.reduce((acc, chat) => {
      return acc + chat.token;
    }, 0);

    if (!chat) {
      return res.status(400).json({
        status: "error",
        message: "Chat not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Chat fetched successfully",
      data: filterChat,
      totalToken,
    });
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
