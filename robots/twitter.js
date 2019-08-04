var Twit = require('twit')
const state = require('./state.js')
var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true})

  async function robots(){

    await init()

    async function init(){
      console.log(1)
      await sleep(5000)
      console.log(2)
      const content = state.load()
      await tweetImage(content)
   }


    function sleep(ms){
      return new Promise(resolve=>{
          setTimeout(resolve,ms)
      })
  }

    function tweetImage(content){
        var T = new Twit({
          consumer_key:         '9m864L1HuwxvxzOXXqGAgOBEm',
          consumer_secret:      '55Uhez3ClINqXWKp5MaDR1eLSkrfEJGnzhvhSQt7btuF07nw3C',
          access_token:         '2409417986-6ZuxB4aENDqwaxdbU9hHvqHVkE0eIDa3O9cWalR',
          access_token_secret:  'AmoD6VuywnFNh1racVjAxDDxL0VJTEsyFiLruP9pxTeJ4',
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
          })
        }
      })
    })
      }
  }

  module.exports = robots

  