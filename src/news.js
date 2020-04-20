const axios = require("axios");
const moment = require("moment");

const NUM_NEWS_API = 20;
const NUM_NEWS_RETURNED = 3;

require("dotenv").config();

/**
 * Function to randomise the headlines returned to users
 * as the news API returns headlines in a defined order.
 */
function randomSelect(headlines) {
  let indices = [];
  let finalHeadlines = [];
  while (indices.length < NUM_NEWS_RETURNED) {
    let index = Math.floor(Math.random() * headlines.length);
    if (indices.indexOf(index) === -1) {
      indices.push(index);
      finalHeadlines.push(headlines[index]);
    }
  }
  return finalHeadlines;
}

function returnDate(numDaysBack = 0) {
  return moment()
    .subtract(numDaysBack, "days")
    .format("YYYY-MM-DD");
}

function editSource(source) {
  return source ? `sources=${source}&` : "";
}

function headlinesAPI(country, source, numOfHeadlines) {
  return `https://newsapi.org/v2/top-headlines?country=${country}&q=COVID&\
from=${returnDate(7)}&to=${returnDate()}&sortBy=popularity\
&apiKey=${process.env.NEWS_API_KEY}&pageSize=${numOfHeadlines}&page=1`;
}

function articlesAPI(country, source, numOfArticles) {
  return `https://newsapi.org/v2/everything?${editSource(source)}q=COVID&\
from=${returnDate(5)}&to=${returnDate()}&sortBy=popularity\
&apiKey=${process.env.NEWS_API_KEY}&pageSize=${numOfArticles}&page=1`;
}

//newsapi.org/v2/top-headlines?country=in&q=COVID&from=2020-03-16&sortBy=publishedAt&apiKey=6a0e7103ce524014b4891589d3a2c829&pageSize=10&page=1
/**
 * Sometimes URL returned by the API is broken and there
 * is space after https:
 */
http: function rectifyUrl(url) {
  if (url && url.includes("https: //")) {
    return "https:" + url.slice(7);
  } else {
    return url;
  }
}

/**
 * Fetches headlines and sort them according to their
 * popularity.
 * country: the country of interest
 * source: the news source for fetching the headlines
 * numOfHeadlines: number of headlines that the function should return.
 */
exports.fetchHeadlines = async function(
  country = "in",
  source = null,
  numOfHeadlines = NUM_NEWS_API
) {
  try {
    let res = await axios.get(headlinesAPI(country, source, numOfHeadlines));
    res = randomSelect(res.data.articles);
    console.log(res);
    return res.map(obj => {
      return {
        title: obj.title,
        description: obj.description,
        source: obj.source.name,
        url: rectifyUrl(obj.url),
        urlToImage: rectifyUrl(obj.urlToImage)
      };
    });
  } catch (error) {
    console.log(error);
  }
};
