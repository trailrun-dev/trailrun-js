import axios from "axios";
import { trailrun } from "../../../packages/node";

trailrun({
  projectKey: "",
  debug: true,
  trailrunApiBaseUrl: "http://localhost:8080",
});

async function sendRequest() {
  try {
    const res = await axios.get("https://api.github.com", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.info(res.data);
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
