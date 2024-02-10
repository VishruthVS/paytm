const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authheader: " + authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  let token = authHeader.split(" ")[1]; //retrieve the token from the header
  console.log(token);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded: " + decoded.userId);
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(403).json({});
    }
  } catch (e) {
    return res.status(403).json({});
  }
};
module.exports = {
  authMiddleWare,
};
