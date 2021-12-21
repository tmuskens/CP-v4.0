import { Response } from 'express-serve-static-core'
import { DataBase, LogQuery, FullTransmission2 } from '../db'
import { CommandPost } from '../cp'

export function renderPrintout (res: Response<any, Record<string, any>, number>, id: number, db: DataBase, print: boolean): void {
  db.getReturn(id, (result) => {
    result.transmission_data = JSON.parse(result.transmission_data)
    const obj: any = {
      log: result,
      print: print,
      layout: false
    }
    res.render('printout', obj)
  })
}

export function renderLog (res: Response<any, Record<string, any>, number>, db: DataBase, query: LogQuery): void {
  db.getLog(query, (log) => {
    const obj: any = {
      log: log,
      layout: false
    }
    res.render('log', obj)
  })
}

export function renderEditTransmission (res: Response<any, Record<string, any>, number>, db: DataBase, id: number, cp: CommandPost): void {
  db.getReturn(id, (transmission: FullTransmission2) => {
    const obj = {
      locations: cp.getLocations(),
      callsigns: cp.getCallsigns(),
      transmission: transmission,
      layout: false
    }
    res.render('edit_transmission', obj)
  })
}
