const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const client = require('../config');

const billingSchema = new Schema(
  {
    modelType: {
      type: String,
      required: true,
    },
    totalToken: {
      type: String,
      required: true,
    },
    limitation: {
      type: String,
      required: false,
    },
    apiKey: {
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

const Billing = client.model("Billing", billingSchema);

module.exports = Billing;
