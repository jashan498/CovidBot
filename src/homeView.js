exports.returnhomeView = function(userId) {
  return {
    // Home tabs must be enabled in your app configuration page under "App Home"
    type: "home",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Welcome home, <@${userId}> :house:*`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${"*I hope you're doing well & staying safe!*\n\n The situation is " +
            "dynamically changing these days and there is lot of misinformation " +
            "nowadays which is creating a panic situation. So, I have taken " +
            "upon myself to present you with latest news and statistics " +
            "from all over the world.\n\n" +
            "Don't worry! Every headline is assigned *Reliability Index* by a Fake News detection " +
            "algorithm. I know the significance of ability to differentiate between rumors " +
            "and facts during a crisis.\n\n\n\n" +
            "Start by asking anything:\n\n" +
            "• What are some major headlines from India? \n" +
            "• Show me COVID related numbers from America \n" +
            "• Show me some news and stats related to COVID \n\n" +
            "Best Wishes! Don't forget to Social Distance :smiley:"}`
        }
      },
      {
        type: "divider"
      }
    ]
  };
};
