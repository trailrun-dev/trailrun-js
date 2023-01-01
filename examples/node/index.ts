import axios from "axios";
import express from "express";
import { initializeTrailrun } from "../../packages/node/dist/src";

const logger = require("pino")();

const app = express();
const port = 8000;

initializeTrailrun({
  projectKey: "dev-1234",
  deny: ["api.stripe.com/v1/charges"],
});

app.get("/", async (req, res) => {
  try {
    const { status } = await axios.get("https://api.stripe.com/v1/charges");
    res.send("Successful Request");
  } catch {
    res.send("Failed Request");
  }
});

app.listen(port, () => {
  logger.info("hello world");
  console.log(`🏀 Example app listening on port ${port}`);
});
