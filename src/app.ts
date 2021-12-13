import express from 'express'
import { engine } from 'express-handlebars'
import { renderHomePage } from './gui/main'
import { renderTransmission } from './gui/transmission'
import { Serials, Transmission } from './serials'
import { DataBase } from './db'

console.log('starting server')
const app = express()
const port = 8080

app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: require('../../assets/exphbshelpers.js').helpers
}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use('/assets', express.static('assets'))

const serials = new Serials()
serials.readFile() // tslint:disable-line

const db = new DataBase()

/* --- LOADING PAGES --- */
// Load home page - record transmissions
app.get('/', (req, res) => {
  const transmissionTypes = serials.getTransmissionTypes()
  renderHomePage(transmissionTypes, res)
})

// Load individual transmission page iframes
app.get('/transmission/:type', (req, res) => {
  const transmission: Transmission = serials.getTransmissionFromString(req.params.type)
  renderTransmission(transmission, res)
})

app.get('/test', (req, res) => {
  res.render('test')
})

/* --- RECEIVING DATA --- */
app.get('/record_transmission/:type', (req, res) => {
  const transmission = {
    type: req.params.type,
    serials: req.query
  }
  db.insertTransmission(transmission)
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
