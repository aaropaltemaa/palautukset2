import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import NotificationSuccess from './components/NotificationSuccess'
import NotificationError from './components/NotificationError'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filtered, setFiltered] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const updateNumber = (id) => {
    const person = persons.find(p => p.id === id)
    const changedPerson = { ...person, number: newNumber }

    personService
      .update(id, changedPerson)
      .then((returnedPerson) => {
        setPersons(persons.map((person) =>
          person.id !== id ? person : returnedPerson
        ))
        setSuccessMessage(`The number of ${person.name} was successfully changed`)
        setTimeout(() => setSuccessMessage(null), 5000)
      })
      .catch(error => {
        setErrorMessage(`The person ${person.name} was already removed from server`)
        setTimeout(() => setErrorMessage(null), 5000)
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      alert(`${newName} is already added to phonebook`)

      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        updateNumber(existingPerson.id)
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => setSuccessMessage(null), 5000)
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
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <NotificationSuccess message={successMessage} />
      <NotificationError message={errorMessage} />
      <div></div>
      filter shown with
      <input
        value={filtered}
        onChange={handleFilteredChange}
      />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        filteredPersons={filteredPersons}
        deletePerson={deletePersonOf}
      />
    </div>
  )
}

export default App
