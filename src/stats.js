const axios = require("axios");
const moment = require("moment");

require("dotenv").config();

// function returnDate(numDaysBack = 0) {
//   return moment()
//     .subtract(numDaysBack, "days")
//     .format("YYYY-MM-DD");
// }

function getStats(country) {
    return `https://api.covid19api.com/live/country/${country}/status/confirmed`;
}


// function rectifyUrl(url) {
//   if (url && url.includes("https: //")) {
//     return "https:" + url.slice(7);
//   } else {
//     return url;
//   }
// }


exports.getStatsByCountry = async function(
  country = "india"
) {
  try {
    let res = await axios.get(getStats(country));
    if(res==null)
    {
        throw new Error("Country not found");
    }
    let res2=[res.data[res.data.length-1]];
    // return res2;
    return res2.map(obj => {
      return {
        "Confirmed": obj.Confirmed,
        "Deaths": obj.Deaths,
        "Recovered": obj.Recovered,
        "Active": obj.Active
      };
    });
  } catch (error) {
      console.log(error);
    console.log("Check country name or add join separate words by '-'");
  }
};
