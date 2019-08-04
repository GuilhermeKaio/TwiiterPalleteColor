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
  await deleteOldImages()
  await fetchImagesOfAllSentences(content)
  await downloadAllImages(content)
  await imagePallete()
  await createColorImage(content)
  await compositeImageSource()

  state.save(content)

  async function deleteOldImages(){
    if(fs.existsSync('./content/background.jpg')){
      fs.unlinkSync('./content/background.jpg')
    }
    if(fs.existsSync('./content/background1.jpg')){
      fs.unlinkSync('./content/background1.jpg')
    }
    if(fs.existsSync('./content/background2.jpg')){
      fs.unlinkSync('./content/background2.jpg')
    }
    if(fs.existsSync('./content/background3.jpg')){
      fs.unlinkSync('./content/background3.jpg')
    }
    if(fs.existsSync('./content/background4.jpg')){
      fs.unlinkSync('./content/background4.jpg')
    }
    if(fs.existsSync('./content/original-resize.jpg')){
      fs.unlinkSync('./content/original-resize.jpg')
    }
  } 

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
      //imgSize: 'xxlarge',
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

  async function createColorImage(content){
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
    
    gm(900, 900,'#ffffff')
      .write('./content/background.jpg', function (err) {
      })
      v = true
    while (v) {
      if(fs.existsSync('./content/background.jpg')){
        gm('./content/background.jpg')
          .composite('./content/color1.jpg')
          .geometry('+40+760')
          .write('./content/background1.jpg', function(err) {
        })
        v = false
      } 
    }

    for (let num = 2; num <= 5;) {
      if(num <= 2){
        l =  180 + 40
      }
      else{
        l = (num - 1) * 180 + 40 
      }
      if(fs.existsSync('./content/background'+ (num-1) +'.jpg')){
        await compositeColor(num,l)
        num = num + 1
      }
    }
    
    async function compositeColor(num,l){
      if(num < 5){
        gm('./content/background'+ (num-1) +'.jpg')
        .composite('./content/color'+ num +'.jpg')
        .geometry('+'+ l +'+760')
        .write('./content/background'+ num +'.jpg', function(err) {
        })
      }
      else{
        gm('./content/background'+ (num-1) +'.jpg')
        .composite('./content/color'+ num +'.jpg')
        .geometry('+'+ l +'+760')
        .write('./content/pallete_final.jpg', function(err) {
        })
      }
    }
  }

  async function compositeImageSource(){
    gm('./content/original.jpg')
    .resize(820, 680, '!')
    .write('./content/original-resize.jpg', function (err) {
    });
  g = true
  while (g){
    if(fs.existsSync('./content/original-resize.jpg')){
      gm('./content/pallete_final.jpg')
      .composite('./content/original-resize.jpg')
      .geometry('+40+40')
      .write('./content/final.jpg', function(err) {
      }) 
      g = false
    }
  }
}

  

}

module.exports = robots
