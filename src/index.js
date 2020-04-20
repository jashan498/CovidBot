const news = require("./news.js");
const buildBlock = require("./buildBlock.js");
const fakeNews = require("./fake-news.js");
const stats = require("./stats.js");

require("dotenv").config();

const { App, ExpressReceiver, directMention } = require("@slack/bolt");
const app = new App({
  token: process.env.OAUTH_BOT_TOKEN,
  signingSecret: process.env.SECRET
});

app.receiver.app.get("/", (_, res) => res.send("Slackbot is up!"));

app.receiver.app.get("/test", async (_, res) => {
  let headlines = await news.fetchHeadlines();
  let fakeNewsIndexArray = await fetchFakeScore(headlines);
  headlines = headlines.map((obj, i) => {
    return { ...obj, ...fakeNewsIndexArray[i] };
  });
  console.log(headlines);
  res.send(headlines);
});

async function fetchFakeScore(headlines) {
  let scores = await Promise.all(
    headlines.map(headline => {
      return fakeNews.check_fake_news(headline.title, headline.description);
    })
  );
  return scores;
}

async function getNewsObject() {
  let headlines = await news.fetchHeadlines();
  let fakeNewsIndexArray = await fetchFakeScore(headlines);
  // zip headlines and their fakeness scre
  headlines = headlines.map((obj, i) => {
    return { ...obj, ...fakeNewsIndexArray[i] };
  });
  return headlines;
}

async function sendNews(payload) {
  let news = await getNewsObject();
  const result = await app.client.chat.postMessage({
    token: process.env.OAUTH_BOT_TOKEN,
    channel: payload.channel,
    text: "This is fallback text",
    blocks: buildBlock.createMainBlockNews(news, payload.user)
  });
  return result;
}

async function sendStatistics(payload) {
  let statistics = await stats.getStatsByCountry();
  const result = await app.client.chat.postMessage({
    token: process.env.OAUTH_BOT_TOKEN,
    channel: payload.channel,
    text: "This is fallback text",
    blocks: buildBlock.createMainBlockStat(statistics, payload.user)
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
