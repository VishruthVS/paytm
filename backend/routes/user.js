const express = require("express");
const router = express.Router();
const zod = require("zod");
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { authMiddleWare } = require("../middleware");
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
    //or
    /*
    const user=await User.create(req.body);
    */
    //in mongodb, user id will be in the form ._id
    const userId = user._id;
    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });
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
const signinSchema = zod.object({
  userName: zod.string().email(),

  password: zod.string(),
});
router.post("/signin", async (req, res) => {
  const { success } = signinSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      msg: "Incorrect inputs",
    });
  }
  try {
    const user = await User.findOne({
      userName: req.body.userName,
      password: req.body.password,
    });
    if (!user) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }
    let token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    console.log("userId: " + userId);
    console.log(req.userId); // Accessing req.userId
    console.log("hi");
    res.json({
      msg: "Logged in successfully",
      token: token,
    });
  } catch (e) {
    res.status(411).json({
      message: "Error while logging in",
    });
  }
});

const updatedBody = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
});

router.put("/", authMiddleWare, async (req, res) => {
  console.log("hello");
  const { success } = updatedBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      msg: "Incorrect inputs",
    });
  }
  console.log(req.userId);
  console.log("hi");

  await User.updateOne(req.body, { _id: req.userId });
  res.json({
    msg: "User updated successfully",
    userId: userId,
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
