import { Response } from 'express-serve-static-core'

function generateMap (db: any, mode: string): any {
  return {
    layout: false,
    mode: mode
  }
}

function renderMap (db: any, res: Response<any, Record<string, any>, number>, mode: string): void {
  res.render('map', generateMap(db, mode))
}

export { renderMap }
