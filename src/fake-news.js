const axios = require("axios");

// hosted on google cloud
exports.check_fake_news = async function(title = "", content = "") {
  try {
    // console.log("heyyyy", title, content);
    let obj = await axios.post(
      "http://fake-news-slackbot.el.r.appspot.com/fakebox/check",
      {
        title: `${title}`,
        content: `${content}`
      }
    );
    return {
      score: obj.data.title.score,
      decision: obj.data.title.decision
    };
  } catch (error) {
    console.log(error);
  }
};
