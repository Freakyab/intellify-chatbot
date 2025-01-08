const express = require("express");
const Chat = require("../model/chat.model");
const Title = require("../model/title.model");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { backendData } = req.body;
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
    // // total token count
    // const totalToken = sortedChat.reduce((acc, chat) => {
    //   return acc + chat.token;
    // }, 0);

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
      // totalToken,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/list/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user",
      });
    }

    // find the first chat document of the user
    const chats = await Title.find({ userId: id });
    if (chats.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No chat found",
      });
    }
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

router.post("/title", async (req, res) => {
  try {
    const { title, chatId, userId } = req.body;
    if (!title || !chatId || !userId) {
      return res.status(400).json({
        status: "error",
        message: !title
          ? "Title is required"
          : !chatId
          ? "ChatId is required"
          : "UserId is required",
      });
    }

    const checkTitle = await Title.findOne({ userId: userId, chatId: chatId });

    if (checkTitle) {
      const newTitle = await Title.findOneAndUpdate(
        { userId: userId, chatId: chatId },
        { title: title },
        { new: true }
      );

      if (!newTitle) {
        return res.status(400).json({
          status: "error",
          message: "Title not updated",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Title updated successfully",
        data: newTitle,
      });
    }

    const titleData = new Title({
      title,
      userId,
      chatId,
    });

    titleData.save();

    if (!titleData) {
      return res.status(400).json({
        status: "error",
        message: "Title not created",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Title created successfully",
      data: titleData,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
}); 


module.exports = router;
