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
      type : Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    chatId: {
      type: Schema.Types.ObjectId,
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
