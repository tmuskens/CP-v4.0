import express from 'express'
import exphbs from 'express-handlebars'
import { renderHomePage } from './gui/main'

console.log('starting server')
const app = express()
const port = 8080

app.engine('hbs', exphbs({
  defaultLayout: 'index',
  extname: '.hbs'
}))
app.set('view engine', 'hbs')

app.use('/assets', express.static('assets'))

app.get('/', (req, res) => {
  renderHomePage(res)
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
