const jwt  = require("jsonwebtoken");
const User = require("../models/User");

module.exports = function auth(roles = []) {
  return async function (req, res, next) {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith("Bearer "))
        return res.status(401).json({ error: "No token provided" });

      const token   = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user    = await User.findById(decoded.id).select("-password");

      if (!user)
        return res.status(401).json({ error: "User not found" });

      if (roles.length > 0 && !roles.includes(user.role))
        return res.status(403).json({ error: "Access denied" });

      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};