const state = require('./state.js')
const { getPaletteFromURL } = require('color-thief-node')
const rgbHex = require('rgb-hex')
const vision = require('@google-cloud/vision')
const { createCanvas, loadImage } = require('canvas')
var fs = require('fs')
  , gm = require('gm').subClass({ imageMagick: true })

async function robots() {

  console.log('> [image-robot] Starting...')
  const content = state.load()

  if (content.TwitterImage) {

    //  await imagePalleteColorGoogle()
    //  await createColorImage(content)
    //  await compositeImageSource()

  } else {

    await imagePalleteColorThief()
    await createColorImage(content)
    await compositeImageSource()
  }

  state.save(content)


  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  async function imagePalleteColorThief() {
    fileName = `./content/original.jpg`
    const colorPallete = await getPaletteFromURL(fileName)
    var colors = []
    var color, hex
    for (let index = 0; index <= 4; index++) {
      color = colorPallete[index]
      hex = rgbHex(color[0], color[1], color[2])
      colors.push(hex)
    }

    content.color = colors
  }

  async function createColorImage(content) {

    for (let index = 0; index <= 4; index++) {
      const canvasPalette = createCanvas(100, 100)
      const contextPalette = canvasPalette.getContext('2d')
      contextPalette.fillStyle = "#" + content.color[index]
      contextPalette.fillRect(0, 0, 100, 100)
      const buffer = canvasPalette.toBuffer('image/png')
      fs.writeFileSync(`./content/color${index + 1}.jpg`, buffer)
    }

    const canvasBackground = createCanvas(900, 900)
    const contextBackground = canvasBackground.getContext('2d')
    contextBackground.fillStyle = "#ffffff"
    contextBackground.fillRect(0, 0, 900, 900)

    loadImage('./content/color1.jpg').then(image => {
      contextBackground.drawImage(image, 40, 760, 100, 100)
      const buffer = canvasBackground.toBuffer('image/png')
      fs.writeFileSync(`./content/background1.jpg`, buffer)
    })

    for (let num = 2; num <= 5; num++) {
      width = (num - 1) * 180 + 40
      console.log(width)
      await loadImage('./content/color' + num + '.jpg').then(image1 => {
        contextBackground.drawImage(image1, width, 760, 100, 100)
        const buffer = canvasBackground.toBuffer('image/png')
        fs.writeFileSync('./content/background' + num + '.jpg', buffer)
      })
    }
  }

  async function compositeImageSource() {
    console.log('> [image-robot] Final Image Started')
    var height
    var width

    await loadImage('./content/original.jpg').then(image => {
      if (image.width > image.height) {
        height = image.height
        width = (image.height * 1.20)
      }
      else {
        height = (image.width * 0.82)
        width = image.width
      }
      const canvasCrop = createCanvas(width, height)
      const contextCrop = canvasCrop.getContext('2d')

      // sx = source x
      // sy = source y
      // sw = source width
      // sh = source height
      // dx = destination x
      // dy = destination y
      // dw = destination width
      // dh = destination height

      sx = (image.width - width)/2
      sy = (image.height - height)/2

      console.log(sx)
      console.log(sy)
      contextCrop.drawImage(image, sx, sy, width, height, 0, 0, width, height)

      const buffer = canvasCrop.toBuffer('image/png')
      fs.writeFileSync('./content/original-resize.jpg', buffer)
    })

    const canvasFinal = createCanvas(900, 900)
    const contextFinal = canvasFinal.getContext('2d')

    await loadImage('./content/background5.jpg').then(image => {
      contextFinal.drawImage(image, 0, 0, 900, 900)
      loadImage('./content/original-resize.jpg').then(image1 => {
        contextFinal.drawImage(image1, 40, 40, 820, 680)
        const buffer = canvasFinal.toBuffer('image/png')
        fs.writeFileSync('./content/final.jpg', buffer)
      })
    })
  }

}

module.exports = robots
