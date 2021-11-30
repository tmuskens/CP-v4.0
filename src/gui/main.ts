import { Response } from 'express-serve-static-core'

function renderHomePage (res: Response<any, Record<string, any>, number>): void {
  res.render('main', {})
}

export { renderHomePage }
