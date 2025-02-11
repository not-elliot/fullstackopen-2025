import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryList = ({ countries, setFilter } ) => {
  const [showCountryInfo, setShowCountryInfo] = useState('')

  console.log("countries:", countries)

  const toggleInfo = (id) => {
    console.log('showCountryInfo:', showCountryInfo)
    console.log('id:', id)
    if(id === showCountryInfo) return setShowCountryInfo('')
    setShowCountryInfo(id)
    console.log('showCountryInfo:', id)    
  }
  
  // if too many matches
  if(countries.length > 10) return <div>too many matches, specify another filter</div>

  // if less or equal 10 matches
  return (
    <ul>
      {
        countries.map(country => {

          return (
            <li key={country.cca3}>
              {country.name.common} <button onClick={() => toggleInfo(country.cca3)}>show</button> <button onClick={() => setFilter(country.name.common)}>select</button>
              <br />
              {showCountryInfo === country.cca3 ? <><hr /><Country country={country} /><hr /></> : <></> }

            </li>
          )
        })
      }
    </ul>
  )
}

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const baseUrl = 'https://api.open-meteo.com/v1/forecast'
  const latitude = country.latlng[0]
  const longitude = country.latlng[1]
  const restUrl = '&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m'
  // ?
  // latitude=52.52
  // &longitude=13.41
  useEffect(() => {
    axios
      .get(`${baseUrl}?latitude=${latitude}&longitude=${longitude}${restUrl}`)
      .then(res => {setWeather(res.data); console.log(res.data)})
      .catch(err => console.log(err.code, err.name, err.message))
  }, [])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>
        capital: {country.capital}
        <br />
        area: {country.area}
      </p>
      <h3>languages:</h3>
      <ul>
        {Object.keys(country.languages).map(key => <li key={key}>{country.languages[key]}</li>)}
      </ul>
      <img src={`${country.flags.png}`} width={150}/>
      <h3>Weather in {country.capital}</h3>
      <p>
        temperature {'(2m height)'} {weather?.current.temperature_2m} Celsius
        <br />
        wind {'(10m height)'} {weather?.current.wind_speed_10m} m/s
      </p>
    </div>
  )
}

function App() {

  const [filterValue, setFilterValue] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => {
        console.log("res.data:", res.data)
        setCountries(res.data)
      })
      .catch(err => console.log(err.name, err.code, err.message))
  }, [])

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filterValue.toLowerCase()))

  console.log("countries:", countries)
  console.log("filteredCountries:", filteredCountries)


  return (
    <div>
      find countries <input value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
      <button 
        onClick={() => setFilterValue(filterValue.substring(0,filterValue.length-1))}
      >{'<'}</button>
      <button onClick={() => setFilterValue('')}>X</button>
      {
        filteredCountries.length === 1 ?
          <>
            <br /><br />
            <Country country={filteredCountries[0]} /> 
          </>
        : 
          <CountryList countries={filteredCountries} setFilter={setFilterValue} />
      }
    </div>
  )
}

export default App
