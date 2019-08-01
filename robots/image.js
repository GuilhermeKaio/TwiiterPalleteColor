const state = require('./state.js')
const imageDownloader = require('image-downloader')
const google = require('googleapis').google
const customSearch = google.customsearch('v1')

const googleSearchCredentials = require('../credentials/google-search.json')

async function robots() {
  console.log('> [image-robot] Starting...')
  const content = state.load()
  await fetchImagesOfAllSentences(content)
  await downloadAllImages(content)

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
    await downloadAndSave(imageUrl, `original.png`)
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

}

module.exports = robots
