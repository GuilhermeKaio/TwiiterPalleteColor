var fs = require('fs')

async function robots() {

    await deleteOldImages()

    function deleteOldImages() {

        if (fs.existsSync('./content/background.jpg')) {
            fs.unlinkSync('./content/background.jpg')
        }
        for (let index = 1; index <= 5; index++) {
            if (fs.existsSync(`./content/background${index}.jpg`)) {
                fs.unlinkSync(`./content/background${index}.jpg`)
            }
        }

        for (let index = 1; index <= 5; index++) {
            if (fs.existsSync(`./content/color${index}.jpg`)) {
                fs.unlinkSync(`./content/color${index}.jpg`)
            }
        }

        if (fs.existsSync('./content/original-resize.jpg')) {
            fs.unlinkSync('./content/original-resize.jpg')
        }
        if (fs.existsSync('./content/original-crop.jpg')) {
            fs.unlinkSync('./content/original-crop.jpg')
        }
        if (fs.existsSync('./content/original.jpg')) {
            fs.unlinkSync('./content/original.jpg')
        }
        if (fs.existsSync('./content/final.jpg')) {
            fs.unlinkSync('./content/final.jpg')
        }
        if (fs.existsSync('./content/pallete_final.jpg')) {
            fs.unlinkSync('./content/pallete_final.jpg')
        }
    }
}

module.exports = robots
