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
  #db: any
  #open: boolean = false
  #insertQueue: any[] = []
  #openCon (): void {
    this.#db = new sqlite3.Database('./data/log.db', sqlite3.OPEN_READWRITE, (err: any) => {
      if (err !== null) {
        console.error(err.message)
      }
      console.log('Connected to database.')
    })
    this.#open = true
  }

  #closeCon (): void {
    this.#db.close((err: any) => {
      if (err !== null) {
        console.error(err.message)
      }
      console.log('Closed the database connection.')
    })
    this.#open = false
  }

  insertTransmission (transmission: FullTransmission): void {
    console.log(transmission)
    this.#insertQueue.push(transmission)
  }
}
