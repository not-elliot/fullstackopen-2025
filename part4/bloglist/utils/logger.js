// logging for infos
const info = (...params) => {
  console.log(...params)
}

// logging for errors
const error = (...params) => {
  console.error(...params)
}

// exports
module.exports = {
  info,
  error
}