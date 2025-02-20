// env vars
const PORT = process.env.PORT

const SCHEME = String(process.env.MONGO_SCHEME)
const USER = encodeURIComponent(process.env.MONGO_USER)
const PW = encodeURIComponent(process.env.MONGO_PW)
const URL = String(process.env.MONGO_URL)
const DB = String(process.env.MONGO_DB)
const PARAMS = String(process.env.MONGO_PARAMS)

const MONGO_URI = `${SCHEME}://${USER}:${PW}@${URL}/${DB}?${PARAMS}`

// exports
module.exports = {
  PORT, MONGO_URI
}