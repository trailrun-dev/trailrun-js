import axios from "axios";
import * as dotenv from "dotenv";
import { trailrun } from "../../../packages/node";

dotenv.config();

const delay = (ms: number | undefined) =>
  new Promise((res) => setTimeout(res, ms));

//trailrunApiBaseUrl: "http://localhost:4000"
trailrun({
  projectKey: process.env.TRAILRUN_PROJECT_KEY as string,
  debug: true,
  trailrunApiBaseUrl: "http://localhost:8080",
});

async function sendRequest() {
  try {
    for (let i = 0; i < 10; i++) {
      const res = await axios.get("https://api.github.com", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      await delay(2000);
    }
  } catch {
    console.error("error sending request to PLATFORM");
  }
}

sendRequest();

// axios.get("https://api.stripe.com/customers", {
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// }); //.then((res) => console.info(res.data));
