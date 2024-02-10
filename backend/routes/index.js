//With this setup, your routes defined in backend/routes/index.js will be mounted under the /api/v1 path in your Express application, and they will be accessible accordingly.
const express = require("express");
const userRouter = require("./user");
const accountRouter = require("./account");
const router = express.Router();
router.use("/user", userRouter);
router.use("/account", accountRouter);
module.exports = router;
