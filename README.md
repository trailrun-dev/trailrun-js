# Trailrun Client

`trailrun` is the npm package that connects your app to the trailrun platform to monitor your app's outbound requests.

This allows you to keep tabs on all of your integrations (e.g. Stripe, Google, Plaid, Rutter, etc.)

To set it up, go to the dashboard to copy your API key and then copy the following code into your app at the **main** file of your node process (e.g. `index.js`):

```js
import trailrun from "trailrun";

trailrun("your-api-key");
```

That's it! Now you can go to the dashboard to see all of your requests.

Trailrun is currently in development. To get on the waitlist, sign up $HERE.
