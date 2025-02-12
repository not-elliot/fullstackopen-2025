const mongoose = require('mongoose')

// console.log('process.argv:', process.argv)
// console.log('process.argv.length:', process.argv.length)

if(process.argv.length < 3) {
  console.log('No password given. Abort.')
  process.exit(1)
}

const username = encodeURIComponent('chris')
const password = encodeURIComponent(process.argv[2])

const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://${username}:${password}@fso-test.ageoo.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fso-test`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 5) {
  const person = new Person({
    name,
    number
  })

  person.save().then(res => {
    console.log(`added ${res.name} number ${res.number} to phonebook`)
    mongoose.connection.close()
  })
} else if(process.argv.length === 3) {

  Person.find({}).then(res => {
    console.log(`all people (${res.length}):`)
    res.forEach(person => console.log(person.name, person.number))
    mongoose.connection.close()
  })
} else {
  console.log('too many arguments. Abort.')
  process.exit(1)
}