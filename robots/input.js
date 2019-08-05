const readline = require('readline-sync')
const state = require('./state.js')
const Parser = require('rss-parser');

const TREND_URL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR'

async function robot() {
  const content = {
}
  const prefixes = ['Digitar', 'Google Trends']
  const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')

  if (selectedPrefixIndex == 0 ) {
      content.searchTerm = askAndReturnSearchTerm()
  }
  else{
    content.searchTerm = await askAndReturnTrend()
  }

  state.save(content)

  function askAndReturnSearchTerm() {
    return readline.question('Type a Image search term: ')
  }

  async function askAndReturnTrend() {
    console.log('Please Wait...')
    const trends = await getGoogleTrends()

    return trends[randomIntInc(0,trends.length)] 

  }

  async function getGoogleTrends () {
    const parser = new Parser()
    const trends = await parser.parseURL(TREND_URL)
    return trends.items.map(({title}) => title)
  }

  function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
  }
}

module.exports = robot
