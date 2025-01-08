const express = require("express");
const User = require("../model/user.model");
const Billing = require("../model/billing.model");
const Chat = require("../model/chat.model");

const router = express.Router();

router.post("/addDetails", async (req, res) => {
  try {
    const { modelType, totalToken, limitation, apiKey, userId } = req.body;
    if (!modelType || !totalToken || !apiKey || !userId) {
      throw new Error("modelType, totalToken, apiKey and userId are required");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User does not exists",
      });
    }

    // Create new billing
    const newBilling = new Billing({
      modelType,
      totalToken,
      limitation,
      apiKey,
      userId,
    });

    // Save billing to database
    await newBilling.save();

    if (newBilling) {
      return res.status(201).json({
        status: "success",
        message: "Billing added successfully",
        data: newBilling,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// creat an endpoint to update the limit of the billing
router.put("/updateLimit/:id", async (req, res) => {
  try {
    const { limitation } = req.body;
    if (!limitation) {
      throw new Error("limitation is required");
    }

    const billing = await Billing.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({
        status: "error",
        message: "Billing not found",
      });
    }

    billing.limitation = limitation;
    await billing.save();

    return res.status(200).json({
      status: "success",
      message: "Billing updated successfully",
      data: billing,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/addOrUpdateDoc", async (req, res) => {
  try {
    const { modelType, totalToken, limitation, apiKey, userId } = req.body;
    if (!userId) {
      throw new Error("userId, docId, and content are required");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User does not exist",
      });
    }

    // Check if document exists
    let doc = await Billing.findOne({ userId, apiKey });
    if (doc) {
      // Update document
      const updatedDoc = {
        modelType,
        totalToken,
        limitation,
        apiKey: apiKey === "" ? "Free" : apiKey,
        userId,
      };
      doc = await Billing.findByIdAndUpdate(doc._id, updatedDoc, { new: true });

      await doc.save();

      return res.status(200).json({
        status: "success",
        message: "Document updated successfully",
        data: doc,
      });
    } else {
      // Create new document
      doc = new Billing({
        userId,
        modelType,
        totalToken,
        limitation,
        apiKey,
      });
      await doc.save();
      return res.status(201).json({
        status: "success",
        message: "Document added successfully",
        data: doc,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/getDetails/:id", async (req, res) => {
  try {
    const billing = await Billing.find({ userId: req.params.id });
    return res.status(200).json({
      status: "success",
      message: "Billing details retrieved successfully",
      data: billing,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
