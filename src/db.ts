const sqlite3 = require('sqlite3').verbose()

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

export interface LogTransmission {
  id: number
  dtg: number
  net: string
  sender: string
  reciever: string
  transmission_type: string
}

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
    var message = 'incomplete'
    db.run(`INSERT INTO log 
            (transmission_type, reciever, sender, dtg, duty_officer, net, transmission_data) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, data, (err: any) => {
      if (err !== null) {
        message = err.message
      } else {
        message = 'success'
      }
      console.log('message transmitted')
      callback(message)
    })
    this.#closeCon(db)
  }

  getLog (query: LogQuery, callback: (log: LogTransmission[]) => void): void {
    let sql = ''
    let params: any[] = []

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
    const end = `ORDER BY dtg DESC
                 LIMIT 100;`
    sql = (select + where + idQuery + end)
    params = ['%' + query.type + '%', '%' + query.to + '%', '%' + query.from + '%', query.dtgFrom,
      query.dtgTo, '%' + query.dutyOfficer + '%', '%' + query.net + '%', '%' + query.content + '%', '%' + query.id + '%']

    db.all(sql, params, (err: any, rows: any) => {
      if (err !== null) throw err
      callback(rows)
    })
    this.#closeCon(db)
  }

  getReturn (id: number): FullTransmission {
    throw new Error('cannot find')
  }
}
