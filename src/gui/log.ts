import { Response } from 'express-serve-static-core'
import { DataBase, LogQuery } from '../db'

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
