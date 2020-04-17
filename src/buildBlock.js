function welcomeMessage(userId) {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Hey <@${userId}>! here are some *COVID-19* related updates:\n\n`
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
