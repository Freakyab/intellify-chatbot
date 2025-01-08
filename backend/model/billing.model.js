const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const client = require('../config');

const billingSchema = new Schema(
  {
    modelType: {
      type: String,
      required: false,
      default: "free",
    },
    totalToken: {
      type: Number,
      required: true,
      default: 0,
    },
    limitation: {
      type: Number,
      required: false,
      default: 20,
    },
    apiKey: {
      type: String,
      required: false,
      default: "Free",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Billing = client.model("Billing", billingSchema);

module.exports = Billing;
