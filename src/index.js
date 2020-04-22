const news = require("./news.js");
const buildBlock = require("./buildBlock.js");
const fakeNews = require("./fake-news.js");
const stats = require("./stats.js");
const {
  QUERY_NEWS,
  QUERY_STAT,
  QUERY_UNKNOWN,
  QUERY_NEWS_STAT,
  QUERY_STAT_NEWS,
  queryType
} = require("./queryType.js");

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
  // console.log(headlines);
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

async function getNewsObject(country) {
  let headlines = await news.fetchHeadlines(country);
  let fakeNewsIndexArray = await fetchFakeScore(headlines);
  // zip headlines and their fakeness scre
  headlines = headlines.map((obj, i) => {
    return { ...obj, ...fakeNewsIndexArray[i] };
  });
  return headlines;
}

async function sendNews(payload, country, isFirst = true) {
  let news = await getNewsObject(country);
  const result = await app.client.chat.postMessage({
    token: process.env.OAUTH_BOT_TOKEN,
    channel: payload.channel,
    text: "This is fallback text",
    blocks: buildBlock.createMainBlockNews(news, payload.user, isFirst)
  });
  return result;
}

async function sendStatistics(payload, isFirst = true, country) {
  let statistics = await stats.getStatsByCountry(country);
  const result = await app.client.chat.postMessage({
    token: process.env.OAUTH_BOT_TOKEN,
    channel: payload.channel,
    text: "This is fallback text",
    blocks: buildBlock.createMainBlockStat(statistics, payload.user, isFirst)
  });
  return result;
}

async function sendUnknownMessage(payload) {
  const result = await app.client.chat.postMessage({
    token: process.env.OAUTH_BOT_TOKEN,
    channel: payload.channel,
    text: "Sorry, I'm having trouble understanding you."
  });
  return result;
}

app.message(directMention(), async ({ payload, context }) => {
  const text = payload.text;
  try {
    let query = queryType(text);
    if (query.type === QUERY_NEWS_STAT) {
      await sendNews(payload, query.country);
      await sendStatistics(payload, false, query.country);
    } else if (query.type === QUERY_STAT_NEWS) {
      await sendStatistics(payload,true, query.country);
      await sendNews(payload, query.country, false);
    } else if (query.type === QUERY_NEWS) {
      await sendNews(payload, query.country);
    } else if (query.type === QUERY_STAT) {
      await sendStatistics(payload,true, query.country);
    } else {
      sendUnknownMessage(payload);
    }
    // if (text.includes("news") || text.includes("headline")) {
    //   await sendNews(payload);
    // } else if (text.includes("stat")) {
    //   await sendStatistics(payload);
    // }
    // console.log(result);
  } catch (error) {
    console.log(error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  console.log(queryType("this is us news and stat"));
  console.log("⚡️ Bolt app is running!");
})();
