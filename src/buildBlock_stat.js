function welcomeMessage(userId) {
    return {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Hey <@${userId}>! here are stats:\n\n`
      }
    };
  }
  
  const divider = {
    type: "divider"
  };
  
  function createContentBlock(a,b,c,d) {
    statisBlock = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Confirmed:* ${a}\n*Deaths:* ${b}\n*Recovered:* ${c}\n*Active:* ${d}\n`
      }
    };
    return statisBlock;
  }
  
  function createAuthorBlock(author) {
    return {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `*Author:* ${author}`
        }
      ]
    };
  }
  
  exports.createMainBlock = function(statObject, userId) {
    let block = [welcomeMessage(userId), divider];
    for (let stat in statObject) {
      if (Object.prototype.hasOwnProperty.call(statObject, stat)) {
        let singlestatBlock = [
          createContentBlock(
            statObject[stat].Confirmed,
            statObject[stat].Deaths,
            statObject[stat].Recovered,
            statObject[stat].Active
          ),
          createAuthorBlock("covid19api.com")
        ];
        block = [...block, ...singlestatBlock, divider];
      }
    }
    return block;
  };
  