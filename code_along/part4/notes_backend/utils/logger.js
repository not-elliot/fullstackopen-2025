// log regular messages
const info = (...params) => {
  if(process.env.NODE_ENV !== 'test') console.log(...params)
}

// log error messages
const error = (...params) => {
  if(process.env.NODE_ENV !== 'test') console.error(...params)
}

// exports
module.exports = {
  info, error
}