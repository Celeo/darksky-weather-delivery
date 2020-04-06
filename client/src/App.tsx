import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { Theme, withStyles } from '@material-ui/core/styles'
import './App.css'

const StyledTableCell = withStyles((theme: Theme) => ({
  body: {
    color: theme.palette.common.white,
    fontSize: 16,
  },
  head: {
    color: theme.palette.common.white,
    fontSize: 20,
  }
}))(TableCell)

const StyledPaper = withStyles(() => ({
  root: {
    backgroundColor: '#424242',
  }
}))(Paper)

const temp = (s: any): string => {
  return `${s}°F`
}

const App = () => {
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL || 'http://localhost:7071/api/HttpTrigger')
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

  if (data == null) {
    return (
      <Container>
        { error && <p style={{ color: 'red' }}>Error: { error }</p> }
        { !error && <LinearProgress /> }
      </Container>
    )
  }

  return (
    <Container>
      { error && <p style={{ color: 'red' }}>Error: { error }</p> }
      <div style={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs>
            <h2>Now</h2>
            <TableContainer component={StyledPaper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell />
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <StyledTableCell><strong>Temperature</strong></StyledTableCell>
                    <StyledTableCell>{ temp(data.current.temperature) }</StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell><strong>Humidity</strong></StyledTableCell>
                    <StyledTableCell>{ `${data.current.humidity}%` }</StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell><strong>Cloud cover</strong></StyledTableCell>
                    <StyledTableCell>{ `${data.current.cloudCover}%` }</StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell><strong>Wind speed</strong></StyledTableCell>
                    <StyledTableCell>{ data.current.windSpeed } mph</StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell><strong>Precipitation %</strong></StyledTableCell>
                    <StyledTableCell>{ `${data.current.precipProbability}%` }</StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs>
            <h2>Summary</h2>
            <TableContainer component={StyledPaper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell />
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <StyledTableCell><strong>Currently</strong></StyledTableCell>
                    <StyledTableCell>{ data.summary.current }</StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell><strong>By hour</strong></StyledTableCell>
                    <StyledTableCell>{ data.summary.hourly }</StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell><strong>By day</strong></StyledTableCell>
                    <StyledTableCell>{ data.summary.daily }</StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>
      <h2>Hourly breakdown</h2>
      <TableContainer component={StyledPaper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Time</StyledTableCell>
              <StyledTableCell>Summary</StyledTableCell>
              <StyledTableCell>Temperature</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { data.hourly.map((e: any) => (
              <TableRow key={e.time}>
                <StyledTableCell>{ e.time }</StyledTableCell>
                <StyledTableCell>{ e.summary }</StyledTableCell>
                <StyledTableCell>{ temp(e.temperature) }</StyledTableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </TableContainer>
      <h2>Daily breakdown</h2>
      <TableContainer component={StyledPaper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Day</StyledTableCell>
              <StyledTableCell>Summary</StyledTableCell>
              <StyledTableCell>Temperature</StyledTableCell>
              <StyledTableCell>Precipitation</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { data.daily.map((e: any) => (
              <TableRow key={e.day}>
                <StyledTableCell>{ e.day }</StyledTableCell>
                <StyledTableCell>{ e.summary }</StyledTableCell>
                <StyledTableCell>{ `${temp(e.temperatureLow)} -> ${temp(e.temperatureHigh)}` }</StyledTableCell>
                <StyledTableCell>{ `${e.precipProbability}% chance of ${e.precipType}` }</StyledTableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default App
