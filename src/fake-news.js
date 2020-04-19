const axios = require("axios");


exports.check_fake_news = async function(
    title="",
    content=""
)
{
    try{
        let obj=await axios.post('http://fake-news-slackbot.el.r.appspot.com/fakebox/check', {
            title: `${title}`,
            content: `${content}`
        });
        let score_title=obj.data.title==null ? 1 : obj.data.title.score;
        let score_content=obj.data.content==null ? 1 : obj.data.content.score;
        if(score_title>0.5 && score_content>0.4)
        {
            return {real:"1"};
        }
        else
        {
            return {real:"0"};
        }
    }
    catch(error)
    {
        console.log(error);
    }
}