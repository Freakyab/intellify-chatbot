const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const client = require("../config");

const chatSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    token: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    timeStamp: {
      type: String,
      required: true,
    },
    title : {
      type: String,
      required: false,
    }
  },
);

const Chat = client.model("Chat", chatSchema);

module.exports = Chat;
