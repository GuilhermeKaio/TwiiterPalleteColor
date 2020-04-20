const state = require('./state.js')
const imageDownloader = require('image-downloader')
var Twit = require('twit')
const dotenv = require('dotenv')
async function robots() {

  const content = state.load()
  await GetImageOnMentions(content)
  //await verifyAdultCotent()

  async function GetImageOnMentions(content) {
    dotenv.config()
    var T = new Twit({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    })

    T.get('statuses/mentions_timeline', function (error, tweets, response) {
      //console.log(tweets[0]);
      for (let index = 0; index <= 1; index++) {
        if (tweets[index].text != undefined) {
          textraw = tweets[index].text;
          textsplit = textraw.split(' ')
          try {
            if (textsplit[1] == 'teste') {
              imageUrl = tweets[index].extended_entities.media[0].media_url;
              downloadAndSave(imageUrl, `original.jpg`);
              content.TwitterImage = true;
              console.log('🤙');
            }
          }
          catch (error) {
            content.TwitterImage = false;
          }
        }
      }
      state.save(content)
    })

    function downloadAndSave(url, fileName) {
      return imageDownloader.image({
        url: url,
        dest: `./content/${fileName}`
      })
    }

    // async function verifyAdultCotent() {
    //   const model = nsfwjs.load()
    //   const predictions = await model.classify('./content/original.jpg', 3)
    //   console.log(predictions);
    // }

  }
}

module.exports = robots