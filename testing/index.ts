import axios from "axios";
import express from "express";

// @ts-ignore
import threepointer from "../dist";
const logger = require("pino")();

const app = express();
const port = 8000;

threepointer("dev-1234");

app.get("/", async (req, res) => {
  const { data } = await axios.get("https://zev.dev");
  console.log(data);
  console.log("Testingaftercall");
  res.send("Hello World!");
});

app.listen(port, () => {
  logger.info("hello world");
  console.log(`Example app listening on port ${port}`);
});
