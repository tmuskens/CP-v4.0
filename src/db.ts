const sqlite3 = require('sqlite3').verbose()

export class DataBase {
  #db: any
  #open (): void {
    this.#db = new sqlite3.Database('./data/log.db', sqlite3.OPEN_READWRITE, (err: any) => {
      if (err) {
        console.error(err.message)
      }
      console.log('Connected to database.')
    })
  }

  #close (): void {
    this.#db.close((err: any) => {
      if (err) {
        console.error(err.message)
      }
      console.log('Closed the database connection.')
    })
  }

  insertTransmission (transmission: any): void {
  }
}
