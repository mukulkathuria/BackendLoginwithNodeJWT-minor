require("dotenv").config();
const jwt = require("jsonwebtoken");

const authorized = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    res.user = verifyToken;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};
module.exports = authorized;
