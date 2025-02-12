// log regular messages
const info = (...params) => {
  console.log(...params)
}

// log error messages
const error = (...params) => {
  console.error(...params)
}

// exports
module.exports = {
  info, error
}