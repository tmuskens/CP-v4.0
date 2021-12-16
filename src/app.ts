import express from 'express'
import { engine } from 'express-handlebars'
import { renderRecordTransmission } from './gui/main'
import { renderTransmission } from './gui/transmission'
import { renderLog, renderPrintout } from './gui/log'
import { Serials, TransmissionTemplate } from './serials'
import { DataBase, FullTransmission, LogQuery } from './db'
import { CommandPost, loadCP } from './cp'
import { CPUser, loadUsers } from './user'
import bodyParser from 'body-parser'
import crypto from 'crypto'

const cookieParser = require('cookie-parser')

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
serials.readFile()
const db = new DataBase()

function getBlankQuery (): LogQuery {
  return {
    id: '',
    type: '',
    to: '',
    from: '',
    dtgTo: cp.getDtg(),
    dtgFrom: 0,
    dutyOfficer: '',
    net: '',
    content: ''
  }
}

const generateAuthToken = (): string => {
  return crypto.randomBytes(30).toString('hex')
}

/* --- LOADING PAGES --- */

// Input net page
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
  renderRecordTransmission(transmissionTypes, res)
})

// Load individual transmission page iframes
app.get('/transmission/:type', (req, res) => {
  const transmission: TransmissionTemplate = serials.getTransmissionFromString(req.params.type)
  const user: CPUser = users[req.cookies.AuthToken]
  db.getPrevId((id: number) => {
    renderTransmission(transmission, cp, user, id, res)
  })
})

app.get('/log', (req, res) => {
  const query: any = req.query as unknown
  if (query.dtgTo === '') query.dtgFrom = cp.getDtg()
  if (query.dtgFrom === '') query.dtgFrom = 0
  renderLog(res, db, getBlankQuery())
})

app.get('/log/:id', (req, res) => {
  const id: number = parseInt(req.params.id)
  const print: boolean = (req.query.print === 'true')
  renderPrintout(res, id, db, print)
})

app.get('/notes', (req, res) => {
  res.render('notes', { layout: false })
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

app.get('/update_settings', (req, res) => {
  for (const setting in req.query) {
    if (setting === 'callsign') cp.setCallsign(req.query[setting] as string)
    if (setting === 'duty-officer') cp.setDutyOfficer(req.query[setting] as string)
    if (setting === 'net') users[req.cookies.AuthToken].setNet(req.query[setting] as string)
  }
  res.send('success')
})

app.get('/log/delete/:id', (req, res) => {
  const id = parseInt(req.params.id)
  db.deleteReturn(id, (message) => {
    res.send(message)
  })
})

/* --- SENDING DATA --- */
app.get('/query_log', (req, res) => {
  var query: any = {}
  if (req.query.reset === 'true') {
    query = getBlankQuery()
  } else {
    query = req.query as unknown
    if (query.dtgTo === '') query.dtgTo = cp.getDtg()
    if (query.dtgFrom === '') query.dtgFrom = 0
  }
  db.getLog(query, (log) => {
    res.send(log)
  })
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
