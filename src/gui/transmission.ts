import { Response } from 'express-serve-static-core'
import { TransmissionTemplate } from '../serials'

function generateTransmission (transmission: TransmissionTemplate): any {
  return {
    transmission: transmission,
    layout: false
  }
}

function renderTransmission (transmission: TransmissionTemplate, res: Response<any, Record<string, any>, number>): void {
  res.render('transmission', generateTransmission(transmission))
}

export { renderTransmission }
