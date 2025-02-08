import { useState } from 'react'

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
const Person = ({ person }) => (<div key={person.id}>{person.name} {person.number}</div>)

const Persons = ({ personsToShow }) => (
  personsToShow.map(person => <Person key={person.id} person={person} />)
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterValue, setFilterValue] = useState('')

  const handleSubmit = (e) => {
    console.log(e)
    e.preventDefault()

    if(persons.find(person => person.name === newName)) return alert(`${newName} is already added to phonebook`)

    const newPerson = {
      name: newName,
      number: newPhone,
      id: persons.length + 1
    }
    const newPersons = persons.concat(newPerson)
    setPersons(newPersons)
    setNewName('')
    setNewPhone('')
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()) || person.number.toLowerCase().includes(filterValue.toLowerCase()))

  return (
    <div> 
      <h2>Phonebook</h2>
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
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App