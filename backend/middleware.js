const jwt = require("jsonwebtoken");

const authmiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  let token = authHeader.split(" ")[1]; //retrieve the token from the header
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userName) {
      req.userName = decoded.userName;
      next();
    } else {
      return res.status(403).json({});
    }
  } catch (e) {
    return res.status(403).json({});
  }
};
