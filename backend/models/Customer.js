// Customer.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  totalSpending: Number,
  lastVisit: Date,
  visits: Number,
});

module.exports = mongoose.model("Customer", customerSchema);
