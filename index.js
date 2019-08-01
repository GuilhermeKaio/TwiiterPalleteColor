const robots = {
  input: require('./robots/input.js'),
  image: require('./robots/image.js'),
}

async function start() {
  robots.input()
  await robots.image()
}

start()
