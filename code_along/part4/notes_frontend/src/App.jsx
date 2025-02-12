import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import noteService from './services/notes'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  // long version see part3
  useEffect(() => {
    console.log('effect')
    noteService  
      .getAll()
      .then(initialNotes => {
        console.log('promise fulfilled')
        setNotes(initialNotes)        
      })
  }, [])

  console.log('render', notes.length, 'notes')

  const addNote = (e) => {
    e.preventDefault()
    console.log('button clicked', e.target)
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        console.log(returnedNote)
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (e) => {
    console.log(e.target.value)
    setNewNote(e.target.value)
    
  }

  const toggleImportanceOf = (id) => {
    console.log('importance of', id, 'is toggled')

    const note = notes.find(n => n.id == id)
    const changedNote = { ...note, important: !note.important }

     // replace entire note with put
     // map creates a copy
    noteService
      .update(id, changedNote)
      .then(returnedNote => setNotes(notes.map(note => note.id === id ? returnedNote : note)))
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server - ${error}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        
        setNotes(notes.filter(note => note.id !== id))
      })
  }  

  const notesToShow = showAll ?
    notes
  :
    notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <ul>
        <li>HALLO</li>
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} onClick={() => setNewNote('')} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App