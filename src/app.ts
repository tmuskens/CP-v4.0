import express from 'express'
import { engine } from 'express-handlebars'
import { renderRecordTransmission } from './gui/main'
import { renderTransmission } from './gui/transmission'
import { renderLog, renderPrintout, renderEditTransmission } from './gui/log'
import { SettingsRenderer } from './gui/settings'
import { Serials, TransmissionTemplate } from './serials'
import { DataBase, FullTransmission, LogQuery, TransmissionUpdate, LogTransmission } from './db'
import { CommandPost, loadCP } from './cp'
import { CPUser, loadUsers } from './user'
import bodyParser from 'body-parser'
import crypto from 'crypto'
import * as path from 'path'
import multer from 'multer'
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')

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
app.set('views', process.cwd() + '/views')
app.use('/assets', express.static('assets'))
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'))
app.use(favicon(path.join(process.cwd(), '/assets/favicon.ico')))

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, './data')
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, 'log.db')
  }
})

const dbFilter = function (req: any, file: any, cb: any): void {
  if (!file.originalname.match(/\.db$/)) {
    req.fileValidationError = 'Only db files are allowed!'
    return cb(new Error('Only db files are allowed!'), false)
  }
  cb(null, true)
}

const cp: CommandPost = loadCP()
const users: Record<string, CPUser> = loadUsers()
const serials: Serials = new Serials()
serials.readFile().catch(err => console.log(err))
const db = new DataBase()
const settings = new SettingsRenderer()

function getBlankQuery (): LogQuery {
  return {
    id: '',
    type: '',
    to: '',
    from: '',
    dtgTo: 999999,
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
  res.render('net', { layout: false, mode: cp.getMode() })
})

// Load record transmission page
app.get('/index', (req, res) => {
  if (req.cookies.AuthToken === undefined) {
    res.redirect('/')
    return
  }
  const transmissionTypes = serials.getTransmissionTypes()
  renderRecordTransmission(transmissionTypes, res, cp.getMode())
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
  renderLog(res, db, getBlankQuery(), cp, serials)
})

app.get('/log/:id', (req, res) => {
  const id: number = parseInt(req.params.id)
  const print: boolean = (req.query.print === 'true')
  renderPrintout(res, id, db, print, cp.getMode())
})

app.get('/notes', (req, res) => {
  res.render('notes', { layout: false, mode: cp.getMode() })
})

app.get('/settings', (req, res) => {
  settings.renderSettings(res, cp.getMode())
})

app.get('/settings/general', (req, res) => {
  settings.renderSettingsGeneral(res, cp)
})

app.get('/settings/info', (req, res) => {
  res.render('settings/info', { layout: false, mode: cp.getMode() })
})

app.get('/settings/serials', (req, res) => {
  settings.renderSettingsSerials(res, serials, cp)
})

app.get('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id)
  renderEditTransmission(res, db, id, cp, serials)
})

app.get('/settings/locations', (req, res) => {
  settings.renderTextSettings(res, 'locations', cp)
})

app.get('/settings/callsigns', (req, res) => {
  settings.renderTextSettings(res, 'callsigns', cp)
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

app.get('/update_transmission/:id', (req, res) => {
  const to = req.query.to as string
  const from = req.query.from as string
  const net = req.query.net as string
  const dutyOfficer = req.query.dutyOfficer as string
  delete req.query.to
  delete req.query.from
  delete req.query.net
  delete req.query.dutyOfficer
  const transmission: TransmissionUpdate = {
    to: to,
    from: from,
    dutyOfficer: dutyOfficer,
    net: net,
    serials: JSON.stringify(req.query),
    id: parseInt(req.params.id)
  }
  db.updateTransmission(transmission, (message: string) => {
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

const upload = multer({
  storage: storage,
  fileFilter: dbFilter
}).single('log')

app.post('/upload_log', (req, res) => {
  upload(req, res, function (err: any) {
    if (err) {
      console.log(err)
      settings.renderSettingsGeneral(res, cp, err.message)
    } else {
      settings.renderSettingsGeneral(res, cp, 'New Log Uploaded!')
    }
  })
})

app.get('/reset_log', (req, res) => {
  db.resetDb((response) => {
    res.send(response)
  })
})

app.post('/settings/update_serials', (req, res) => {
  const type: string = req.body.type as string
  const transmission: any = req.body.data as unknown
  const tm: TransmissionTemplate = transmission as TransmissionTemplate
  var message: string = ''
  if (type === 'edit') {
    const oldName = req.body.old as string
    message = serials.updateTransmissionType(tm, oldName)
  } else if (type === 'new') {
    message = serials.newTransmissionType(tm)
  } else throw new Error('undefined update serial type')
  res.send(message)
})

app.get('/settings/delete_return', (req, res) => {
  const name = req.query.name as string
  const message = serials.deleteTransmissionType(name)
  res.send(message)
})

app.get('/settings/update_text_settings/:type', (req, res) => {
  const type: string = req.params.type
  const data: string = req.query.data as string
  const array = data.trim().split('\n').map(s => s.trim())
  if (type === 'locations') cp.setLocations(array)
  if (type === 'callsigns') cp.setCallsigns(array)
  res.send('success')
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
  db.getLog(query, (log: LogTransmission[]) => {
    res.send(log)
  })
})

app.get('/download_log', (req, res) => {
  res.download(path.join(process.cwd(), '/data/log.db'), function (err) {
    if (err) {
      console.log(err.message)
    }
  })
})

app.get('/settings/get_serials', (req, res) => {
  const name = req.query.name as string
  res.send(serials.getTransmissionFromString(name))
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
