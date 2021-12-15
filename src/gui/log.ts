import { Response } from 'express-serve-static-core'
import { DataBase, LogQuery } from '../db'

export function renderPrintout (res: Response<any, Record<string, any>, number>, id: number, db: DataBase): void {
  db.getReturn(id, (result) => {
    result.transmission_data = JSON.parse(result.transmission_data)
    const obj: any = {
      log: result,
      layout: false
    }
    res.render('printout', obj)
  })
}

function renderLog (res: Response<any, Record<string, any>, number>, db: DataBase, query: LogQuery): void {
  db.getLog(query, (log) => {
    const obj: any = {
      log: log,
      layout: false
    }
    res.render('log', obj)
  })
}

export { renderLog }
