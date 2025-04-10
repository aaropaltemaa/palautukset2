import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [country, setCountry] = useState("")
  const [countries, setCountries] = useState([])

  useEffect(() => {
    console.log("effect run, country is now", country)

    if (country) {
      console.log("fetching country data...")
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
        .then(response => {
          console.log(`Data of ${country} was fetched successfully`)
          setCountry(response.data.name.common)
        })
        .catch(error => {
          console.log(`Failed to fetch data of ${country}`)
        })
    }
  }, [country])

  const handleChange = (e) => {
    setCountry(e.target.value)
  }

  return (
    <div>
      find countries
      <input
        value={country}
        onChange={handleChange}
      />
      <p>{country}</p>
    </div>
  )
}

export default App