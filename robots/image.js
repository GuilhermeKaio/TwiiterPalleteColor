const state = require('./state.js')
const imageDownloader = require('image-downloader')
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const { getPaletteFromURL } = require('color-thief-node')
const rgbHex = require('rgb-hex')
var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true})

const googleSearchCredentials = require('../credentials/google-search.json')

async function robots() {
  console.log('> [image-robot] Starting...')
  const content = state.load()
  await fetchImagesOfAllSentences(content)
  await downloadAllImages(content)
  await imagePallete()
  createColorImage(content)

  state.save(content)

  async function fetchImagesOfAllSentences(content) {

      const query = `${content.searchTerm}`
      console.log(query)

      console.log(`> [image-robot] Querying Google Images with: "${query}"`)

      content.image = await fetchGoogleAndReturnImagesLinks(query)
      content.googleSearchQuery = query

  }

  async function fetchGoogleAndReturnImagesLinks(query) {
    const response = await customSearch.cse.list({
      auth: googleSearchCredentials.apiKey,
      cx: googleSearchCredentials.searchEngineId,
      q: query,
      searchType: 'image',
      num: 1,
      imgSize: 'huge',
      imgType: 'photo'
    })

    const imagesUrl = response.data.items.map((item) => {
      return item.link
    })

    return imagesUrl
  }

  async function downloadAllImages(content) {
    content.downloadedImages = []
    imageUrl = `${content.image}`
    await downloadAndSave(imageUrl, `original.jpg`)
    try{
    content.downloadedImages.push(imageUrl)
    console.log(`> [image-robot] [${content.searchTerm}] Image successfully downloaded: ${imageUrl}`)
    }
    catch(error) {
      console.log(`> [image-robot] [${content.searchTerm}] Error (${imageUrl}): ${error}`)
    }
  }

  async function downloadAndSave(url, fileName) {
    return imageDownloader.image({
      url: url,
      dest: `./content/${fileName}`
    })
  }

  async function imagePallete(){
    fileName = `./content/original.jpg`
    const colorPallete = await getPaletteFromURL(fileName);
    color1 = colorPallete[0]
    content.color1 = rgbHex(color1[0],color1[1],color1[2])
    color2 = colorPallete[1]
    content.color2 = rgbHex(color2[0],color2[1],color2[2])
    color3 = colorPallete[2]
    content.color3 = rgbHex(color3[0],color3[1],color3[2])
    color4 = colorPallete[3]
    content.color4 = rgbHex(color4[0],color4[1],color4[2])
    color5 = colorPallete[4]
    content.color5 = rgbHex(color5[0],color5[1],color5[2])
  }

  function createColorImage(content){
    gm(100, 100,'#'+ content.color1)
      .write('./content/color1.jpg', function (err) {
      })
    gm(100, 100,'#'+ content.color2)
      .write('./content/color2.jpg', function (err) {
      })
    gm(100, 100,'#'+ content.color3)
      .write('./content/color3.jpg', function (err) { 
      })
    gm(100, 100,'#'+ content.color4)
      .write('./content/color4.jpg', function (err) {
      })
    gm(100, 100,"#"+ content.color5)
      .write('./content/color5.jpg', function (err) {
      })
    
    gm(900, 900,'#ddff99f3')
      .write('./content/background.jpg', function (err) {
      })
    
    gm('./content/background.jpg')
      .composite('./content/color1.jpg')
      .geometry('+40+0')
      .write('./content/background.jpg', function(err) {
        if(!err) console.log("Written montage image.");
    })

    gm('./content/background.jpg')
      .composite('./content/color2.jpg')
      .geometry('+220+0')
      .write('./content/background.jpg', function(err) {
        if(!err) console.log("Written montage image.");
    })

    gm('./content/background.jpg')
      .composite('./content/color3.jpg')
      .geometry('+400+0')
      .write('./content/background.jpg', function(err) {
        if(!err) console.log("Written montage image.");
    })

    gm('./content/background.jpg')
      .composite('./content/color4.jpg')
      .geometry('+580+0')
      .write('./content/background.jpg', function(err) {
        if(!err) console.log("Written montage image.");
    })

    gm('./content/background.jpg')
      .composite('./content/color5.jpg')
      .geometry('+760+0')
      .write('./content/background.jpg', function(err) {
        if(!err) console.log("Written montage image.");
    })
    
  }

}

module.exports = robots
