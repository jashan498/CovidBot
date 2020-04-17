var news = require("./news.js");
var buildBlock = require("./buildBlock.js");

const { App, ExpressReceiver } = require("@slack/bolt");
const axios = require("axios");

require("dotenv").config();

const app = new App({
  token: process.env.OAUTH_BOT_TOKEN,
  signingSecret: process.env.SECRET
});

app.receiver.app.get("/test", (_, res) => res.send("Slackbot is up!"));

// app.message requires your app to subscribe to the message.channels event
app.message("news", async ({ payload, context }) => {
  try {
    let headlines = await news.fetchHeadlines();
    const result = await app.client.chat.postMessage({
      token: process.env.OAUTH_BOT_TOKEN,
      channel: payload.channel,
      text: "This is fallback text",
      blocks: buildBlock.createMainBlock(headlines, payload.user)
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
})();
