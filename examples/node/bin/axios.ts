import axios from "axios";
import { trailrun } from "../../../packages/node";

const delay = (ms: number | undefined) =>
  new Promise((res) => setTimeout(res, ms));

//trailrunApiBaseUrl: "http://localhost:4000"
trailrun({
  projectKey: "tr_dSy2zLMV",
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
