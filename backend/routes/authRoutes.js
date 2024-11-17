const express = require("express");
const router = express.Router();
const { verifyGoogleToken, generateJWT } = require("../auth");

router.post("/google", async (req, res) => {
  const { token } = req.body;
  const user = await verifyGoogleToken(token);
  if (user) {
    const jwtToken = generateJWT(user);
    res.json({ token: jwtToken });
  } else {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;