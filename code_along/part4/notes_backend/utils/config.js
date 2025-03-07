// config vars
const PORT = process.env.PORT || 3001

const SCHEME = String(process.env.MONGO_SCHEME)
const USER = encodeURIComponent(process.env.MONGO_USER)
const PW = encodeURIComponent(process.env.MONGO_PW)
const DOMAIN = String(process.env.MONGO_URL)
const PROD_DB = String(process.env.PROD_MONGO_DB)
const TEST_DB = String(process.env.TEST_MONGO_DB)
const PARAMS = String(process.env.MONGO_PARAMS)

const PROD_MONGODB_URI = `${SCHEME}://${USER}:${PW}@${DOMAIN}/${PROD_DB}?${PARAMS}`
const TEST_MONGODB_URI = `${SCHEME}://${USER}:${PW}@${DOMAIN}/${TEST_DB}?${PARAMS}`

const MONGODB_URI = process.env.NODE_ENV === 'test' ?
  TEST_MONGODB_URI
  :
  PROD_MONGODB_URI

// console.log('MONGODB_URI:', MONGODB_URI)


// exports
module.exports = {
  MONGODB_URI,
  PORT
}