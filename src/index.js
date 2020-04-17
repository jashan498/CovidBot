var news = require('./news.js');

const { App, ExpressReceiver } = require("@slack/bolt");
const axios = require("axios");

require("dotenv").config();

const app = new App({
  token: process.env.OAUTH_BOT_TOKEN,
  signingSecret: process.env.SECRET
});

app.receiver.app.get("/test", (_, res) => res.send("Slackbot is up!"));

// Listen to a message containing the substring "hello"
// app.message requires your app to subscribe to the message.channels event
app.message("headline", async ({ payload, context }) => {
  try {
    // let headline = await getHeadline();
    let headlines = await news.fetchHeadlines();
    headlines = headlines.map(x => x.description);
    const result = await app.client.chat.postMessage({
      token: process.env.OAUTH_BOT_TOKEN,
      channel: payload.channel,
      text: headlines.join('\n')
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(3000);
  console.log("⚡️ Bolt app is running!");
  console.log(process.env.NEWS_API_KEY);
  // console.log(await getHeadline());
  // news.fetchHeadlines().then(x => console.log(x));
})();
