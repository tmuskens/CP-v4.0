import { Response } from 'express-serve-static-core'

function generateTransmission (): any {
  return {}
}

function renderTransmission (transmission: string, res: Response<any, Record<string, any>, number>): void {
  res.render('transmission', generateTransmission())
}

export { renderTransmission }
