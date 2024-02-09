const express = require("express");
const router = express.Router();
const zod = require("zod");
const { JWT_SECRET } = require("../config");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
router.use(express.json());
const signupSchema = zod.object({
  userName: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { success } = signupSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      msg: "Email already taken / Incorrect inputs/error in 1st step",
    });
  }
  const existinguserName = await User.findOne({
    userName: req.body.userName,
  });
  if (existinguserName) {
    return res.status(400).json({
      msg: "Email already taken / Incorrect inputs",
    });
  }
  try {
    const user = await User.create({
      userName: req.body.userName,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    //in mongodb, user id will be in the form ._id
    const userId = user._id;
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );
    res.json({
      msg: "User Created Successfully ",
      token: token,
    });
  } catch (err) {
    if (err.errors && err.errors.password) {
      return res.status(400).json({
        msg: "Password validation failed",
        errors: err.errors.password.message,
      });
    } else {
      return res.status(500).json({
        msg: "Server Error",
      });
    }
  }
});

module.exports = router;
