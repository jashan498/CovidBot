const QUERY_NEWS = "news";
const QUERY_STAT = "stats";
const QUERY_UNKNOWN = "unknown";
const QUERY_NEWS_STAT = "newsStat";
const QUERY_STAT_NEWS = "statNews";

const countryCode = {
  argentina: "ar",
  australia: "au",
  canada: "ca",
  china: "cn",
  france: "fr",
  germany: "de",
  greece: "gr",
  india: "in",
  england: "gb",
  uk: "gb",
  us: "us",
  america: "us"
};

const newsStatPattern = /[\sa-z0-9]*news[\sa-z0-9]*stat[\sa-z0-9]*/i;
const statNewsPattern = /[\sa-z0-9]*stat[\sa-z0-9]*news[\sa-z0-9]*/i;

function queryType(text) {
  let countries = ["in"]; // default country is set to India
  text = text.toLowerCase();
  let countryCodekeys = Object.keys(countryCode);
  for (let country in countryCodekeys) {
    // console.log(keys[country]);
    let index = text.indexOf(countryCodekeys[country]);
    // console.log(country, " ", index);
    if (index !== -1) {
      countries.push([countryCode[countryCodekeys[country]]]);
    }
  }
  if (newsStatPattern.test(text)) {
    return {
      type: QUERY_NEWS_STAT,
      country: countries[countries.length - 1]
    };
  } else if (statNewsPattern.test(text)) {
    return {
      type: QUERY_STAT_NEWS,
      country: countries[countries.length - 1]
    };
  } else if (text.includes("news")) {
    return {
      type: QUERY_NEWS,
      country: countries[countries.length - 1]
    };
  } else if (text.includes("stat")) {
    return {
      type: QUERY_STAT,
      country: countries[countries.length - 1]
    };
  } else {
    return {
      type: QUERY_UNKNOWN,
      country: countries[countries.length - 1]
    };
  }
}

module.exports = {
  QUERY_NEWS,
  QUERY_STAT,
  QUERY_UNKNOWN,
  QUERY_NEWS_STAT,
  QUERY_STAT_NEWS,
  queryType
};

// console.log(queryType("stats and news"));
