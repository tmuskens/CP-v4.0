import express from 'express'
import { engine } from 'express-handlebars'
import { renderRecordTransmission } from './gui/main'
import { renderTransmission } from './gui/transmission'
import { Serials, TransmissionTemplate } from './serials'
import { DataBase, FullTransmission } from './db'
import { CommandPost, loadCP } from './cp'
import { CPUser, loadUsers } from './user'

const cookieParser = require('cookie-parser')
import bodyParser from 'body-parser'
import crypto from 'crypto'

console.log('starting server')
const app = express()
const port = 8080
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: require('../../assets/exphbshelpers.js').helpers
}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use('/assets', express.static('assets'))

const cp: CommandPost = loadCP()
const users: Record<string, CPUser> = loadUsers()
const serials: Serials = new Serials()
serials.readFile() // tslint:disable-line
const db = new DataBase()

const generateAuthToken = (): string => {
  return crypto.randomBytes(30).toString('hex')
}

/* --- LOADING PAGES --- */

app.get('/', (req, res) => {
  if (req.cookies.AuthToken !== undefined) {
    res.redirect('/index')
    return
  }
  res.render('net', { layout: false })
})

// Load record transmission page
app.get('/index', (req, res) => {
  if (req.cookies.AuthToken === undefined) {
    res.redirect('/')
    return
  }
  const transmissionTypes = serials.getTransmissionTypes()
  console.log(users[req.cookies.AuthToken].getNet())
  renderRecordTransmission(transmissionTypes, res)
})

// Load individual transmission page iframes
app.get('/transmission/:type', (req, res) => {
  const transmission: TransmissionTemplate = serials.getTransmissionFromString(req.params.type)
  renderTransmission(transmission, res)
})

app.get('/test', (req, res) => {
  res.render('test')
})

/* --- RECEIVING DATA --- */
app.get('/set_net', (req, res) => {
  const net: string = req.query.net as string
  const authToken: string = generateAuthToken()
  users[authToken] = new CPUser(net, authToken)
  res.cookie('AuthToken', authToken)
  res.cookie('net', net)
  res.redirect('index')
})

app.get('/record_transmission/:type', (req, res) => {
  console.log('transmission recieved')
  const to = req.query.to as string
  const from = req.query.from as string
  delete req.query.to
  delete req.query.from
  const transmission: FullTransmission = {
    type: req.params.type,
    to: to,
    from: from,
    dtg: cp.getDtg(),
    dutyOfficer: cp.getDutyOfficer(),
    net: users[req.cookies.AuthToken].getNet(),
    serials: JSON.stringify(req.query)
  }
  db.insertTransmission(transmission, (message: string) => {
    res.send(message)
  })
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
