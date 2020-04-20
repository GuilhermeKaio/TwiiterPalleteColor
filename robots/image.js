const state = require('./state.js')
const { getPaletteFromURL } = require('color-thief-node')
const rgbHex = require('rgb-hex')
const vision = require('@google-cloud/vision')
var fs = require('fs')
  , gm = require('gm').subClass({ imageMagick: true })

async function robots() {

  console.log('> [image-robot] Starting...')
  const content = state.load()

  if (content.TwitterImage) {

    // await imagePalleteColorGoogle()
    //await createColorImage(content)
    //await compositeImageSource()

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
    color1 = colorPallete[0]
    content.color1 = rgbHex(color1[0], color1[1], color1[2])
    color2 = colorPallete[1]
    content.color2 = rgbHex(color2[0], color2[1], color2[2])
    color3 = colorPallete[2]
    content.color3 = rgbHex(color3[0], color3[1], color3[2])
    color4 = colorPallete[3]
    content.color4 = rgbHex(color4[0], color4[1], color4[2])
    color5 = colorPallete[4]
    content.color5 = rgbHex(color5[0], color5[1], color5[2])
  }

  // async function imagePalleteColorGoogle() {
  //   const client = new vision.ImageAnnotatorClient()
  //   const fileName = './content/original.jpg'
  //   const [result] = await client.imageProperties(fileName)
  //   console.log(result.imagePropertiesAnnotation.dominantColors.colors[0])
  // }

  async function createColorImage(content) {
    gm(100, 100, '#' + content.color1)
      .write('./content/color1.jpg', function (err) {
      })
    gm(100, 100, '#' + content.color2)
      .write('./content/color2.jpg', function (err) {
      })
    gm(100, 100, '#' + content.color3)
      .write('./content/color3.jpg', function (err) {
      })
    gm(100, 100, '#' + content.color4)
      .write('./content/color4.jpg', function (err) {
      })
    gm(100, 100, "#" + content.color5)
      .write('./content/color5.jpg', function (err) {
      })

    gm(900, 900, '#ffffff')
      .write('./content/background.jpg', function (err) {
      })
    v = true
    while (v) {
      if (fs.existsSync('./content/background.jpg')) {
        gm('./content/background.jpg')
          .composite('./content/color1.jpg')
          .geometry('+40+760')
          .write('./content/background1.jpg', function (err) {
          })
        v = false
      }
    }

    for (let num = 2; num <= 5;) {
      if (num <= 2) {
        l = 180 + 40
      }
      else {
        l = (num - 1) * 180 + 40
      }
      if (fs.existsSync('./content/background' + (num - 1) + '.jpg')) {
        await compositeColor(num, l)
        num = num + 1
      }
    }

    function compositeColor(num, l) {
      if (num < 5) {
        gm('./content/background' + (num - 1) + '.jpg')
          .composite('./content/color' + num + '.jpg')
          .geometry('+' + l + '+760')
          .write('./content/background' + num + '.jpg', function (err) {
          })
      }
      else {
        gm('./content/background' + (num - 1) + '.jpg')
          .composite('./content/color' + num + '.jpg')
          .geometry('+' + l + '+760')
          .write('./content/pallete_final.jpg', function (err) {
          })
      }
    }
  }

  async function compositeImageSource() {

    var height
    var width
    gm('./content/original.jpg')
      .size(function (err, size) {
        if (!err) {
          if (size.width > size.height) {
            height = size.height
            width = (size.height * 1.20)
          }
          else {
            height = (size.width * 0.82)
            width = size.width
          }
        }
        else {
          console.log(err)
        }
      })

    await sleep(2000)

    gm('./content/original.jpg')
      .gravity('Center')
      .crop(width, height)
      .write('./content/original-crop.jpg', function (err) {
        if (!err) {
          gm('./content/original-crop.jpg')
            .resize(820, 680, '!')
            .write('./content/original-resize.jpg', function (err) {
              if (!err) {
                gm('./content/pallete_final.jpg')
                  .composite('./content/original-resize.jpg')
                  .geometry('+40+40')
                  .write('./content/final.jpg', function (err) {
                  })
              }
            })
        }
      })
  }

}

module.exports = robots
