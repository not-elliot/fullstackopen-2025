// config vars
const PORT = process.env.PORT || 3001

const SCHEME = String(process.env.MONGO_SCHEME)
const USER = encodeURIComponent(process.env.MONGO_USER)
const PW = encodeURIComponent(process.env.MONGO_PW)
const DOMAIN = String(process.env.MONGO_URL)
const DB = String(process.env.MONGO_DB)
const PARAMS = String(process.env.MONGO_PARAMS)
const MONGODB_URI = `${SCHEME}://${USER}:${PW}@${DOMAIN}/${DB}?${PARAMS}`

// exports
module.exports = {
  MONGODB_URI,
  PORT
}