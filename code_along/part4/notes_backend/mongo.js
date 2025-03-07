const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const username = encodeURIComponent('chris')
const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://${username}:${password}@fso-test.ageoo.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=fso-test`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'HTML is easy',
//   important: false,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   console.log('note saved result:', result)
//   // mongoose.connection.close()

//   const note2 = new Note({
//     content: 'Browser can execute only JavaScript',
//     important: true,
//   })

//   note2.save().then(result => {
//     console.log('note saved!')
//     console.log('note saved result:', result)
//     // mongoose.connection.close()
//   })
// })

Note.find({}).then(result => {
  console.log('all notes:')
  result.forEach(note => {
    console.log(note)
  })
})

Note.find({ important: true }).then(result => {
  console.log('important notes:')
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})