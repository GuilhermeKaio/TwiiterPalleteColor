const robots = {
  input: require('./robots/input.js'),
  image: require('./robots/image.js'),
  twitter: require('./robots/twitter.js')
}

async function start() {
  robots.input()
  await robots.image()
  await robots.twitter()
}

start()
