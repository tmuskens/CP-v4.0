import express from 'express'
import { engine } from 'express-handlebars'
import { renderHomePage } from './gui/main'
import { renderTransmission } from './gui/transmission'

console.log('starting server')
const app = express()
const port = 8080

app.engine('.hbs', engine({
  extname: '.hbs'
}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use('/assets', express.static('assets'))

app.get('/', (req, res) => {
  renderHomePage(res)
})

app.get('/test', (req, res) => {
  res.render('test')
})

app.get('/transmission', (req, res) => {
  const transmission: string = req.query.type as string
  renderTransmission(transmission, res)
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
