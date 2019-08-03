const readline = require('readline-sync')
const state = require('./state.js')

function robot() {
  const content = {
}

  content.searchTerm = askAndReturnSearchTerm()

  state.save(content)

  function askAndReturnSearchTerm() {
    return readline.question('Type a Image search term: ')
  }
}

module.exports = robot
