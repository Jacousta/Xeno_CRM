const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const Customer = require("../models/Customer");

router.post("/", async (req, res) => {
  try {
    console.log("Received campaign data:", req.body);
    const { name, segment, message } = req.body;

    if (!name || !segment || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const segmentField = Object.keys(segment)[0];
    const segmentOperator = Object.keys(segment[segmentField])[0];
    const segmentValue = segment[segmentField][segmentOperator];

    if (!["totalSpending", "visits", "lastVisit"].includes(segmentField)) {
      return res.status(400).json({ message: "Invalid segment field" });
    }

    if (![">", "<", "="].includes(segmentOperator)) {
      return res.status(400).json({ message: "Invalid segment operator" });
    }

    if (typeof segmentValue !== "number") {
      return res
        .status(400)
        .json({ message: "Segment value must be a number" });
    }

    // Construct the MongoDB query
    let query = {};
    switch (segmentOperator) {
      case ">":
        query[segmentField] = { $gt: segmentValue };
        break;
      case "<":
        query[segmentField] = { $lt: segmentValue };
        break;
      case "=":
        query[segmentField] = segmentValue;
        break;
    }

    let audienceSize;
    try {
      audienceSize = await Customer.countDocuments(query);
    } catch (error) {
      console.error("Error calculating audience size:", error);
      return res
        .status(500)
        .json({ message: "Error calculating audience size" });
    }

    const campaign = new Campaign({ name, segment, audienceSize, message });
    await campaign.save();
    console.log("Campaign created:", campaign);
    res.status(201).json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Error fetching campaigns" });
  }
});

module.exports = router;