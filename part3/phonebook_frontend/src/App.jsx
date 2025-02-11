import { useState,useEffect } from 'react'
import personsService from './services/persons'

const Notification = ({ msgObj }) => {

  console.log('NOTIFICATION PROPS', msgObj)

  if(msgObj === null) {
    return null
  }

  const { msg, type } = msgObj

  const inlineStleSuccess = {
    color: 'green',
    fontSize: 20,
    padding: 10,
    background: 'lightgrey',
    borderColor: 'green',
    borderStyle: 'solid',
    borderRadius: 5,
    marginBottom: 10
  }

  const inlineStleError = {
    color: 'red',
    fontSize: 20,
    padding: 10,
    background: 'lightgrey',
    borderColor: 'red',
    borderStyle: 'solid',
    borderRadius: 5,
    marginBottom: 10
  }

  if(type === 'error') {
    return (
      <div style={inlineStleError}>
        {msg}
      </div>
    )
  }

  if(type === 'success') {
    return (
      <div style={inlineStleSuccess}>
        {msg}
      </div>
    )
  }
}

const Filter = ({ value, onChange }) => (
  <>
    filter shown with <input value={value} onChange={onChange} />
  </>
)

const PersonForm = ({ newName, newPhone, onChangeName, onChangePhone, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={newName} onChange={onChangeName} />
    </div>
    <div>
      number: <input value={newPhone} onChange={onChangePhone} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)
const Person = ({ person, handleRemove }) => {
  return (
    <div key={person.id}>
      <button onClick={() => handleRemove(person.id)}>remove</button> {person.name} {person.number}
    </div>
  )
}

const Persons = ({ personsToShow, handleRemove }) => (
  personsToShow.map(person => <Person key={person.id} person={person} handleRemove={handleRemove} />)
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [msgObj, setMsgObj] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(err => console.log(err.name, "-", err.code, ":", err.message, "_", "FAILED TO GET DATA FROM DB"))
  }, [])

  const updateNotification = (msgObj) => {
    setMsgObj(msgObj)
    setTimeout(() => {
      setMsgObj(null)
    }, 5000)
  }  

  const handleSubmit = (e) => {
    console.log(e)
    e.preventDefault()

    // HANDLE EXISITING PERSON
    const existingPerson = persons.find(person => person.name === newName)
    if(existingPerson) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {
          ...existingPerson,
          number: newPhone
        }

        personsService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            console.log('updated person:', returnedPerson)            
            setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person))
          })
          .catch(err => console.log(err.name, "-", err.code, ":", err.message, "_", "FAILED TO UPDATE DATA IN DB"))
        
        setNewName('')
        setNewPhone('')
        return
      } else {
        setNewName('')
        setNewPhone('')
        return
      }
    }

    // HANDLE NEW PERSON
    const newPerson = {
      name: newName,
      number: newPhone,
      // id: persons.length + 1
    }

    personsService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewPhone('')
        updateNotification({ msg: `Added ${returnedPerson.name}`, type: 'success' })

      })
      .catch(err => console.log(err.name, "-", err.code, ":", err.message, "_", "FAILED TO POST DATA TO DB"))
  }

  const handleRemove = (personId) => {
    if(!window.confirm(`Delete ${persons.find(person => person.id === personId).name}`)) return
    personsService
      .remove(personId)
      .then(() => {
        const deletedPerson = persons.find(person => person.id === personId)
        console.log('deleted person:', deletedPerson)
        updateNotification({ msg: `${deletedPerson.name} deleted`, type: 'success' })
        setPersons(persons.filter(person => person.id !== deletedPerson.id))
      })
      .catch(err => {
        const errorPerson = persons.find(person => person.id === personId)
        console.log(err.name, "-", err.code, ":", err.message, "_", "FAILED TO DELETE DATA FROM DB")
        updateNotification({ msg: `Information for person ${errorPerson.name} has already been removed from server`, type: 'error' })
        setPersons(persons.filter(person => person.id !== personId))
      })

  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()) || person.number.toLowerCase().includes(filterValue.toLowerCase()))

  console.log('msgObj:', msgObj)

  return (
    <div> 
      <h2>Phonebook</h2>
      <Notification msgObj={msgObj} />
      <Filter value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        newPhone={newPhone}
        onChangeName={(e) => setNewName(e.target.value)}
        onChangePhone={(e) => setNewPhone(e.target.value)}
        handleSubmit={handleSubmit} 
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleRemove={handleRemove} />
    </div>
  )
}

export default App