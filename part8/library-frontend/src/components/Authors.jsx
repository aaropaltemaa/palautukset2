import { ALL_AUTHORS, ALL_BOOKS, SET_BIRTHYEAR } from "../queries"
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from "react-select"

const SetBirthYear = ({ born, setBorn, name, setName, submit, authors }) => {
  const options = authors.map(author => ({
    value: author.name,
    label: author.name,
  }));

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <Select
            value={options.find(option => option.value === name)} // set the currently selected value
            onChange={(selectedOption) => setName(selectedOption.value)} // set the name when changed
            options={options}
          />
        </div>
        <div>
          born <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

const Authors = ({ authors }) => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")

  const [setBirthYear] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }]
  })

  const submit = (event) => {
    event.preventDefault()

    setBirthYear({ variables: { name, setBornTo: Number(born) } })

    setName("")
    setBorn("")
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear born={born} setBorn={setBorn} name={name} setName={setName} submit={submit} authors={authors} />
    </div>
  )
}

export default Authors
