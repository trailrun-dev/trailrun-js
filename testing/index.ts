import axios from "axios";
import express from "express";

// @ts-ignore
import fluxwatch from "../index";
const logger = require("pino")();

const app = express();
const port = 8000;

fluxwatch("dev-1234");

app.get("/", async (req, res) => {
  const { data, status } = await axios.get("https://zev.dev");
  console.log("Status Code", status);
  res.send("Hello World!");
});

app.listen(port, () => {
  logger.info("hello world");
  console.log(`🏀 Example app listening on port ${port}`);
});
