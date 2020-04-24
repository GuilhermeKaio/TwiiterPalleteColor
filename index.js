const robots = {
  input: require('./robots/input.js'),
  imagetwitter: require('./robots/imagetwitter.js'),
  image: require('./robots/image.js'),
  twitter: require('./robots/twitter.js'),
  delete: require('./robots/delete.js')
}

async function start() {
  await robots.delete()
  await robots.input()
  // await robots.imagetwitter()
  await robots.image()
  await robots.twitter()
  await robots.delete()
}

start()