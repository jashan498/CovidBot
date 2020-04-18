function welcomeMessage(userId) {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Hey <@${userId}>! here are some *COVID-19* related updates:\n\n`
    }
  };
}

function welcomeMessage_stat(userId) {
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

function createContentBlock(newsTitle, newsDescription, sourceUrl, imageUrl) {
  newsBlock = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*<${sourceUrl}|${newsTitle}>*\n\n ${newsDescription}`
    }
  };
  if (imageUrl) {
    imageBlock = {
      accessory: {
        type: "image",
        image_url: `${imageUrl}`,
        alt_text: "Image by source"
      }
    };
    return { ...newsBlock, ...imageBlock };
  } else {
    return newsBlock;
  }
}

function createStatBlock(a,b,c,d) {
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

exports.createMainBlock = function(newsObject, userId) {
  let block = [welcomeMessage(userId), divider];
  for (let news in newsObject) {
    if (Object.prototype.hasOwnProperty.call(newsObject, news)) {
      let singleNewsBlock = [
        createContentBlock(
          newsObject[news].title,
          newsObject[news].description,
          newsObject[news].url,
          newsObject[news].urlToImage
        ),
        createAuthorBlock(newsObject[news].author)
      ];
      block = [...block, ...singleNewsBlock, divider];
    }
  }
  return block;
};

exports.createMainBlock_stat = function(statObject, userId) {
  let block = [welcomeMessage_stat(userId), divider];
  for (let stat in statObject) {
    if (Object.prototype.hasOwnProperty.call(statObject, stat)) {
      let singlestatBlock = [
        createStatBlock(
          statObject[stat].Confirmed,
          statObject[stat].Deaths,
          statObject[stat].Recovered,
          statObject[stat].Active
        )
      ];
      block = [...block, ...singlestatBlock, divider];
    }
  }
  return block;
};