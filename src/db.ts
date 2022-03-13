import { Location } from './map'
import { grToNum } from './utils'
const sqlite3 = require('sqlite3').verbose()

/* @brief Application transmission format */
export interface FullTransmission {
  id?: number
  type: string
  to: string
  from: string
  dtg: number
  dutyOfficer: string
  net: string
  serials: string
}

/* @brief Database transmission format */
export interface FullTransmission2 {
  id?: number
  transmission_type: string
  reciever: string
  sender: string
  dtg: number
  duty_officer: string
  net: string
  transmission_data: string
}

/* @brief Data returned on Log Query */
export interface LogTransmission {
  id: number
  dtg: number
  net: string
  sender: string
  reciever: string
  transmission_type: string
}

/* @brief Query accepted by Log */
export interface LogQuery {
  id: string
  type: string
  to: string
  from: string
  dtgTo: number
  dtgFrom: number
  dutyOfficer: string
  net: string
  content: string
}

export interface TransmissionUpdate {
  id: number
  to: string
  from: string
  dutyOfficer: string
  net: string
  serials: string
}

export class DataBase {
  #openCon (): any {
    return new sqlite3.Database('./data/log.db', sqlite3.OPEN_READWRITE, (err: any) => {
      if (err !== null) {
        console.error(err.message)
      }
    })
  }

  #closeCon (db: any): void {
    db.close((err: any) => {
      if (err !== null) {
        console.error(err.message)
      }
    })
  }

  insertTransmission (transmission: FullTransmission, callback: (response: string) => void): void {
    const db = this.#openCon()
    const data = Object.values(transmission)
    var response: any = {}
    db.run(`INSERT INTO log 
            (transmission_type, reciever, sender, dtg, duty_officer, net, transmission_data) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, data, (err: any) => {
      if (err !== null) {
        response.message = err.message
      } else {
        response.message = 'success'
        console.log('transmission recorded')
      }
      db.get('SELECT max(id) FROM log', [], (err2: any, result: any) => {
        if (err2 !== null) response.message = err2.message
        else response.id = result['max(id)']
        callback(response)
      })
    })
    this.#closeCon(db)
  }

  updateTransmission (transmission: TransmissionUpdate, callback: (response: string) => void): void {
    const db = this.#openCon()
    const data = Object.values(transmission)
    var response: any = {}
    const sql = `UPDATE log SET 
                  reciever = ?, sender = ?, duty_officer = ?, net = ?,
                  transmission_data = ?
                WHERE id = ?`
    db.run(sql, data, (err: any) => {
      if (err !== null) {
        console.log(err)
        response.message = err.message
      } else {
        response.message = 'success'
        console.log('transmission updated')
      }
      callback(response)
    })
    this.#closeCon(db)
  }

  getLogAll (query: LogQuery, callback: (log: LogTransmission[]) => void): void {
    const db = this.#openCon()
    const sql = 'SELECT * FROM log ORDER BY id DESC LIMIT 100;'

    db.all(sql, [], (err: any, rows: any) => {
      if (err !== null) throw err
      callback(rows)
    })
    this.#closeCon(db)
  }

  getLog (query: LogQuery, callback: (log: LogTransmission[]) => void): void {
    const db = this.#openCon()
    const select = `SELECT id, 
                        dtg, 
                        net, 
                        sender, 
                        reciever, 
                        transmission_type
                 FROM log
                 WHERE `
    const where = `transmission_type LIKE ? AND
                    reciever LIKE ? AND
                    sender LIKE ? AND
                    (dtg BETWEEN ? AND ?) AND
                    'duty_officer' LIKE ? AND
                    net LIKE ? AND
                    transmission_data LIKE ? `
    const idQuery = 'AND id LIKE ? '
    const end = `ORDER BY id DESC
                 LIMIT 100;`
    const sql = (select + where + idQuery + end)
    const params = ['%' + query.type + '%', '%' + query.to + '%', '%' + query.from + '%', query.dtgFrom, query.dtgTo,
      '%' + query.dutyOfficer + '%', '%' + query.net + '%', '%' + query.content + '%', '%' + query.id + '%']

    db.all(sql, params, (err: any, rows: any) => {
      if (err !== null) throw err
      callback(rows)
    })
    this.#closeCon(db)
    // (dtg BETWEEN ? AND ?) AND
  }

  getReturn (id: number, callback: (log: FullTransmission2) => void): void {
    const db = this.#openCon()
    const sql = `SELECT *
                    FROM log
                    WHERE id = ?`
    db.get(sql, [id], (err: any, result: any) => {
      if (err !== null) throw err
      callback(result)
    })
    this.#closeCon(db)
  }

  deleteReturn (id: number, callback: (message: string) => void): void {
    const db = this.#openCon()
    const sql = `DELETE FROM log
                 WHERE id = ?`
    db.run(sql, [id], (err: any) => {
      if (err !== null) throw err
      const message = 'success'
      callback(message)
    })
    this.#closeCon(db)
  }

  getPrevId (callback: (id: number) => void): void {
    const db = this.#openCon()
    const sql = 'SELECT max(id) FROM log'
    db.get(sql, [], (err: any, result: any) => {
      if (err !== null) throw err
      callback(result['max(id)'])
    })
    this.#closeCon(db)
  }

  /* Gets most recent locstat for each callsign
    location must have been sent in the past 24 hours
  */
  getLocations (locReturn: string, locSerial: string, dtg: number, callback: (locs: Location[]) => void): void {
    const prevDtg: number = dtg - 10000
    const db = this.#openCon()
    const sql = `SELECT log.sender, log.transmission_data, log.dtg, log.id 
                 FROM log 
                 INNER JOIN 
                  (SELECT sender, MAX(id) AS maxId
                   FROM log
                   WHERE (transmission_type = ? AND (dtg BETWEEN ? AND ?))
                   GROUP BY sender) newTable
                 ON log.sender = newTable.sender
                 AND log.id = newTable.maxId
                 ORDER BY log.sender`
    db.all(sql, [locReturn, prevDtg, dtg], (err: any, result: any) => {
      if (err !== null) throw err
      const locs: Location[] = []
      for (const row of result) {
        const data: any = JSON.parse(row.transmission_data)
        const gr: number = grToNum(data[locSerial])
        const current: Location = {
          callsign: row.sender,
          id: row.id,
          gr: gr,
          dtg: row.dtg
        }
        locs.push(current)
      }
      callback(locs)
    })
    this.#closeCon(db)
  }

  resetDb (callback: (message: string) => void): void {
    const db = this.#openCon()
    const sql = 'DELETE FROM log'
    db.run(sql, [], (err: any) => {
      if (err !== null) throw err
      const message = 'success'
      callback(message)
    })
  }
}
