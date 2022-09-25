import axios from "axios";
import threepointer from "../..";

const delay = (ms: number | undefined) =>
  new Promise((res) => setTimeout(res, ms));

threepointer("dev-1234");

axios.get("https://zev.dev?testing=2"); //.then((res) => console.info(res.data));

delay(10000);
