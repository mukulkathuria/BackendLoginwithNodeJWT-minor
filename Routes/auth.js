require("dotenv").config();
const router = require("express").Router();
const User = require("../Models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/auth", async (req, res, next) => {
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).json({ message: "Email Exist" });

  //Hashed Password
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
  });
  try {
    const saveduser = await user.save();
    const token = jwt.sign(
      { name: user.name, email: user.email },
      process.env.ACCESS_TOKEN,
      {
        algorithm: "HS512",
        expiresIn: "1h",
      }
    );
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({ name: user.name, email: user.email });
  } catch (err) {
    if (err) {
      const error = new Error("Data is not saved to mongodb");
      error.statusCode = 500;
      throw error;
    }
    next();
  }
});

router.post("/login", async (req, res) => {
  //Find the User from Mongodb
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ message: "Email and Password invalid" });

  //Verify Password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).json({ message: "Email and Password invalid" });

  const token = jwt.sign(
    { name: user.name, email: user.email },
    process.env.ACCESS_TOKEN,
    {
      algorithm: "HS512",
      expiresIn: "1h",
    }
  );
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send({ name: user.name, email: user.email });
});

module.exports = router;
