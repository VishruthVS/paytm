const express = require("express");
const cors = require("cors");
const app = express();
const rootRouter = require("./routes");
app.use(cors());
app.use("/api/v1", rootRouter);
//express.json for body-parser
app.use(express.json());
app.listen(3000, () => {
  console.log("app is listening on port 3000");
});
