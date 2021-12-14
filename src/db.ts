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

export class DataBase {
  #openCon (): any {
    return new sqlite3.Database('./data/log.db', sqlite3.OPEN_READWRITE, (err: any) => {
      if (err !== null) {
        console.error(err.message)
      }
      console.log('Connected to database.')
    })
  }

  #closeCon (db: any): void {
    db.close((err: any) => {
      if (err !== null) {
        console.error(err.message)
      }
      console.log('Closed the database connection.')
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
      callback(message)
    })
    this.#closeCon(db)
  }
}
