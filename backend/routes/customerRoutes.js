const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

router.post("/", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// const express = require("express");
// const router = express.Router();
// const Customer = require("../models/Customer");

// router.post("/", async (req, res) => {
//   try {
//     const customer = new Customer(req.body);
//     await customer.save();
//     res.status(201).json(customer);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

module.exports = router;

// module.exports = router;