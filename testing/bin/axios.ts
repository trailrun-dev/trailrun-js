import axios from "axios";
import trailrun from "../..";

const delay = (ms: number | undefined) =>
  new Promise((res) => setTimeout(res, ms));

trailrun({ clientSecret: "dev-1234" });

axios.get("https://zev.dev?testing=2", {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
}); //.then((res) => console.info(res.data));

delay(10000);
