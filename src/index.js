var news = require("./news.js");
var buildBlock = require("./buildBlock.js");
var bb = require("./buildBlock_stat.js");
var stats = require("./stats.js");

const { App, ExpressReceiver, directMention } = require("@slack/bolt");

require("dotenv").config();

const app = new App({
  token: process.env.OAUTH_BOT_TOKEN,
  signingSecret: process.env.SECRET
});

app.receiver.app.get("/test", (_, res) => res.send("Slackbot is up!"));

// app.receiver.app.get("/",async (_, res) => {
//   let statistics = await stats.getStatsByCountry();
//   res.send(statistics);
// });

// app.message requires your app to subscribe to the message.channels event
// app.app_men
// app.event("app_mention", async ({ payload, context }) => {
//   console.log(user);
//   // say(`hey!`);
//   try {
//     let headlines = await news.fetchHeadlines();
//     const result = await app.client.chat.postMessage({
//       token: process.env.OAUTH_BOT_TOKEN,
//       channel: payload.channel,
//       text: "This is fallback text",
//       blocks: buildBlock.createMainBlock(headlines, payload.user)
//     });
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// });

async function sendNews(payload) {
  let headlines = await news.fetchHeadlines();
  const result = await app.client.chat.postMessage({
    token: process.env.OAUTH_BOT_TOKEN,
    channel: payload.channel,
    text: "This is fallback text",
    blocks: buildBlock.createMainBlock(headlines, payload.user)
  });
  return result;
}

async function sendStatistics(payload) {
  let statistics = await stats.getStatsByCountry();
  const result = await app.client.chat.postMessage({
    token: process.env.OAUTH_BOT_TOKEN,
    channel: payload.channel,
    text: "This is fallback text",
    blocks: bb.createMainBlock(statistics, payload.user)
  });
  return result;
}

app.message(directMention(), async ({ payload, context }) => {
  const text = payload.text;
  try {
    if (text.includes("news") || text.includes("headline")) {
      await sendNews(payload);
    } else if (text.includes("stat")) {
      await sendStatistics(payload);
    }
    // console.log(result);
  } catch (error) {
    console.log(error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
