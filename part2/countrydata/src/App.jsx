import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ country, countries }) => {

  return (
    <div>
      <h1>{country}</h1>
    </div>
  )
}


const App = () => {
  const [country, setCountry] = useState("")
  const [countries, setCountries] = useState([])

  useEffect(() => {
    if (country) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
        .then(response => {
          setCountries(response.data)
        })
        .catch(error => {
          console.log("error fetching countries:", error)
        })
    }
  }, [country])

  const handleChange = (e) => {
    setCountry(e.target.value)
  }

  return (
    <div>
      <input
        value={country}
        onChange={handleChange}
        placeholder='Search for a country'
      />
      <pre>
        <Filter country={country} />
      </pre>
    </div>
  )
}

export default App