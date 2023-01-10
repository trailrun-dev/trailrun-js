import axios from "axios";
import express from "express";
import { trailrun } from "../../packages/node/dist/src";

const logger = require("pino")();

const app = express();
const port = 8000;

trailrun({
  projectKey: "tr_1234",
  debug: true,
});

app.get("/", async (req, res) => {
  try {
    const { status } = await axios.get("https://api.github.com");
    res.send("Successful Request");
  } catch {
    res.send("Failed Request");
  }
});

app.listen(port, () => {
  logger.info("hello world");
  console.log(`🏀 Example app listening on port ${port}`);
});
