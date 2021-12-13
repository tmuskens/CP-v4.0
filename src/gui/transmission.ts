import { Response } from 'express-serve-static-core'
import { Transmission } from '../serials'

function generateTransmission (transmission: Transmission): any {
  return {
    transmission: transmission,
    layout: false
  }
}

function renderTransmission (transmission: Transmission, res: Response<any, Record<string, any>, number>): void {
  res.render('transmission', generateTransmission(transmission))
}

export { renderTransmission }
