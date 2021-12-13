import { Response } from 'express-serve-static-core'
import { Transmission } from '../serials'

function generateHomePage (transmissionTypes: Transmission[]): any {
  return {
    layout: false,
    defaultTransmission: transmissionTypes[0].transmission,
    transmissions: transmissionTypes
  }
}

function renderHomePage (transmissionTypes: Transmission[], res: Response<any, Record<string, any>, number>): void {
  res.render('index', generateHomePage(transmissionTypes))
}

export { renderHomePage }
