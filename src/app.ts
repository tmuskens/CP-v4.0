import express from 'express'
import { engine } from 'express-handlebars'
import { renderHomePage } from './gui/main'
import { renderTransmission } from './gui/transmission'
import { Serials, Transmission } from './serials'

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

app.get('/', (req, res) => {
  const transmissionTypes = serials.getTransmissionTypes()
  renderHomePage(transmissionTypes, res)
})

app.get('/test', (req, res) => {
  res.render('test')
})

app.get('/transmission', (req, res) => {
  const transmission: Transmission = serials.getTransmissionFromString(req.query.type as string)
  renderTransmission(transmission, res)
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
