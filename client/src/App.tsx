import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container
} from '@material-ui/core'
import './App.css'

const queryAPI = () => axios
  .get(process.env.API_URL || 'http://localhost:7071/api/HttpTrigger')
  .then((response) => {
    if (response.status !== 200) {

    }
  })

const App = () => {
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.API_URL || 'http://localhost:7071/api/HttpTrigger')
      setData(response.data)
      setError(null)
    } catch (error) {
      if (error.response) {
        setError('Error from API, code ' + error.response.status + ': ' + error.response.data)
      } else if (error.request) {
        setError('Did not receive a response from the API')
      } else {
        setError('Could not send request to API: ' + error.message)
      }
    }
  }

  useEffect(() => {
    if (!data) {
      fetchData()
    }
  })
  return (
    <Container>
      <h2>App</h2>
      { error && <p style={{ color: 'red' }}>Error: { error }</p> }
      { data && <pre>{ JSON.stringify(data, null, 2) }</pre> }
    </Container>
  )
}

export default App
