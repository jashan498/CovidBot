var news = require("./news.js");
var buildBlock = require("./buildBlock.js");
var fake_news=require('./fake-news.js');
var stats = require("./stats.js");
const { App, ExpressReceiver, directMention } = require("@slack/bolt");
require("dotenv").config();
const app = new App({
  token: process.env.OAUTH_BOT_TOKEN,
  signingSecret: process.env.SECRET
});

app.receiver.app.get("/test", (_, res) => res.send("Slackbot is up!"));

app.receiver.app.get("/", (_, res) =>
{
  rr=fake_news.check_fake_news("Don't Count on Getting a Refund From Ticketmaster for a Postponed Show","Ticketmaster has clarified its refund policy for events that have been canceled or postponed due to COVID-19, and it’s potentially bad news for people who have purchased tickets for upcoming events.")
  .then((rr)=>
  {
    res.send(rr);
  }
  );
});

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
    blocks: buildBlock.createMainBlock_stat(statistics, payload.user)
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
