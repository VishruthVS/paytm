//With this setup, your routes defined in backend/routes/index.js will be mounted under the /api/v1 path in your Express application, and they will be accessible accordingly.
const express = require("express");
const userRouter = require("./user");
const router = express.Router();
router.use("/user", userRouter);
module.exports = router;
