import axios from "axios";
import express from "express";

// @ts-ignore
import trailrun from "../index";
const logger = require("pino")();

const app = express();
const port = 8000;

trailrun("dev-1234");

app.get("/", async (req, res) => {
  const { status } = await axios.get(
    "https://jsonplaceholder.typicode.com/todos/1"
  );
  // console.log("Status Code", status);
  res.send("Hello World!");
});

app.listen(port, () => {
  logger.info("hello world");
  console.log(`🏀 Example app listening on port ${port}`);
});
