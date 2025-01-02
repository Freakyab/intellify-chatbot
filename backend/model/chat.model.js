const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    token : {
        type: String,
        required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
