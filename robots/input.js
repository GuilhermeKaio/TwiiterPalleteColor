const readline = require('readline-sync')
const state = require('./state.js')

function robot() {
  const content = {
}
  //const googleSearchCredentials = require('../credentials/google-search.json')

  content.searchTerm = askAndReturnSearchTerm()
  //content.searchEngineId = askAndReturnSearchEngineId()

  state.save(content)

  function askAndReturnSearchTerm() {
    return readline.question('Type a Image search term: ')
  }

  function askAndReturnSearchEngineId(lang){

      return googleSearchCredentials.searchEngineId
  }
}

module.exports = robot
