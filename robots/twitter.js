var Twit = require('twit')
var Twitter = require('twitter')
const state = require('./state.js')
//const imageDownloader = require('image-downloader')
var fs = require('fs')
  , gm = require('gm').subClass({ imageMagick: true })
//const dotenv = require('dotenv')

async function robots() {
  await init()

  async function init() {
    console.log(1)
    await sleep(5000)
    console.log(2)
    const content = state.load()
    await tweetImage(content)
    var ignore = {}
    ignore.ignoreSearchTerm = [content.searchTerm]
    state.save(ignore)
  }

  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  function tweetImage(content) {
    //dotenv.config()
    var T = new Twit({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    })

    var b64content = fs.readFileSync('./content/final.jpg', { encoding: 'base64' })

    // first we must post the media to Twitter
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
      console.log(`> [twitter-robot] [${content.searchTerm}] Posting image:`)

      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      var mediaIdStr = data.media_id_string
      var altText = "Testando"
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

      T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
          textstatus = `Expressão pesquisada: ${content.searchTerm} \r\n\r\nCores extraidas: #${content.color1}, #${content.color2}, #${content.color3}, #${content.color4}, #${content.color5} \r\n\r\nSource: ${content.image}`
          var params = { status: textstatus, media_ids: [mediaIdStr] }

          T.post('statuses/update', params, function (err, data, response) {
            console.log(`> [twitter-robot] [${content.searchTerm}] Posted image :)`)
            console.log(data)
            content.PTid = data.id_str
            state.save(content)
          })
        }
        else {
          console.log(err)
        }
      })
    })
  }
}

module.exports = robots

