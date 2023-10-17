//verifying the token
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // removing bearer

      // decode the token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password"); // finding user and removoing password
      next();
    } catch (e) {
      console.error("JWT Verification Error:", e);
      res.status(401).json({ message: "User Not Authorized Token Failed" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "User Not Authorized No Token" });
  }
});

module.exports = { protect };
