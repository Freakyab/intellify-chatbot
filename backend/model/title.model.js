const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const client = require("../config");

const titleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "untitled",
    },
    userId: {
      type: String,
      required: true,
    },
    chatId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Title = client.model("Title", titleSchema);
module.exports = Title;
