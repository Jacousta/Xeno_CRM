const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Customer = require("../models/Customer");

router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Update customer's total spending and visit count
    await Customer.findByIdAndUpdate(order.customerId, {
      $inc: { totalSpending: order.amount, visits: 1 },
      $set: { lastVisit: order.date },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;