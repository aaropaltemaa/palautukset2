import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filtered, setFiltered] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])



  const updateNumber = (id) => {
    const person = persons.find(p => p.id === id)
    const changedPerson = { ...person, number: newNumber }

    personService
      .update(id, changedPerson)
      .then((returnedPerson) => {
        setPersons(persons.map((person) => (person.id !== id ? person : returnedPerson)))
      })
  }

  const addPerson = (event) => {
    event.preventDefault()

    //Check if the name already exists
    const existingPerson = persons.find(p => p.name === newName)

    const personObject = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      alert(`${newName} is already added to phonebook`)

      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`))
        updateNumber(existingPerson.id)

    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })

    }
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleFilteredChange = (e) => {
    setFiltered(e.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filtered.toLowerCase())
  )

  const deletePersonOf = (id) => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert(`The person "${person.name}" was already removed from server`)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <div></div>
      filter shown with
      <input
        value={filtered}
        onChange={handleFilteredChange}
      />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
        filteredPersons={filteredPersons}
        deletePerson={deletePersonOf}
      />
    </div>
  )
}

export default App