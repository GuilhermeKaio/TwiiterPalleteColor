const random = require('random')
const state = require('./state.js')
var Twit = require('twit')
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const imageDownloader = require('image-downloader')
const dotenv = require('dotenv')

async function robot() {
  var content = {}
  content = state.load()

  content.searchTerm = await getTerm(content)
  await fetchImagesOfAllSentences(content)
  await downloadAllImages(content)

  console.log(content.searchTerm)

  state.save(content)

  async function getTerm(content) {
    ok = true
    while (ok) {
      content = await askAndReturnTrend(content)
      await sleep(2000)
      ok = validateTerm(content)
    }
    return content.searchTerm
  }

  async function askAndReturnTrend(content) {
    dotenv.config()
    var T = new Twit({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    })

    var params = { id: process.env.ID_COUNTRY, exclude: 'hashtags' }


    T.get('trends/place', params, function (err, data, response) {
      if (!err) {
        console.log(data[0].trends)
        var verify = true
        while (verify) {
          try {
            num = random.int(min = 0, max = data[0].trends.length)
            content.searchTerm = data[0].trends[num].name
            verify = false
          }
          catch{
            verify = true
          }
        }
      }
      else {
        console.log(err)
      }
    })
    return content
  }

  function validateTerm(content) {
    var term = content.searchTerm
    var ok = false
    try {
      for (let index = 0; index < content.ignoreSearchTerm.length; index++) {
        if (term == content.ignoreSearchTerm[index]) {
          console.log('termo ja pesquisado')
          ok = true
        }
      }
    }
    catch{}
    return ok
  }

  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }
}

async function fetchImagesOfAllSentences(content) {

  const query = `${content.searchTerm}`
  content.googleSearchQuery = query

  console.log(`> [image-robot] Querying Google Images with: "${query}"`)

  content.image = await fetchGoogleAndReturnImagesLinks(query)

}

async function fetchGoogleAndReturnImagesLinks(query) {
  dotenv.config()
  const response = await customSearch.cse.list({
    auth: process.env.apiKey,
    cx: process.env.searchEngineId,
    q: query,
    searchType: 'image',
    num: 10,
    imgSize: process.env.imgSize,
    imgType: 'photo'
  })

  const imagesUrl = response.data.items.map((item) => {
    return item.link
  })

  return imagesUrl
}

async function downloadAllImages(content) {
  var ok = true
  while (ok) {
    content.downloadedImages = []
    num = random.int(0, content.image.length)
    console.log(content.image)
    imageUrl = `${content.image[num]}`
    try {
      await downloadAndSave(imageUrl, `original.jpg`)
      content.downloadedImages.push(imageUrl)
      console.log(`> [image-robot] [${content.searchTerm}] Image successfully downloaded: ${imageUrl}`)
      ok = false
    }
    catch (error) {
      console.log(`> [image-robot] [${content.searchTerm}] Error (${imageUrl}): ${error}`)
      ok = true
    }
  }

}

async function downloadAndSave(url, fileName) {
  return imageDownloader.image({
    url: url,
    dest: `./content/${fileName}`
  })
}

module.exports = robot
