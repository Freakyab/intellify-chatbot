const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aiModelSchema = new Schema(
  {
    modelType: {
      type: String,
      required: true,
    },
    pricing: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AiModel = mongoose.model("AiModel", aiModelSchema);

module.exports = AiModel;