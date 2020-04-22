const axios = require("axios");
const moment = require("moment");

require("dotenv").config();

function getStats(country) {
    return `https://api.covid19api.com/live/country/${country}/status/confirmed`;
}

exports.getStatsByCountry = async function(
  country = "india"
) {
  try {
    let res = await axios.get(getStats(country));
    if(res==null)
    {
        throw new Error("Country not found");
    }
    date_today=res.data[res.data.length-1].Date;
    curr=res.data.filter(
      function (entry)
      {
        return entry.Date===date_today
      }
    );
    conf=0;
    dea=0;
    rec=0;
    act=0;
    for(let i in curr)
    {
      conf+=parseInt(curr[i].Confirmed);
      dea+=parseInt(curr[i].Deaths);
      rec+=parseInt(curr[i].Recovered);
      act+=parseInt(curr[i].Active);
    }
    return [{
        "Confirmed": conf,
        "Deaths": dea,
        "Recovered": rec,
        "Active": act
    }];
  } catch (error) {
      console.log(error);
    console.log("Check country name or add join separate words by '-'");
  }
};
