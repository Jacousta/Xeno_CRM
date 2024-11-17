const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    console.error("Error verifying Google token:", error);
    return null;
  }
}

function generateJWT(user) {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

module.exports = { verifyGoogleToken, generateJWT };
