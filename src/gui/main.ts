import { Response } from 'express-serve-static-core'
import { TransmissionTemplate } from '../serials'

function generateRecordTransmissionPage (transmissionTypes: TransmissionTemplate[]): any {
  return {
    layout: false,
    defaultTransmission: transmissionTypes[0].transmission,
    transmissions: transmissionTypes
  }
}

function renderRecordTransmission (transmissionTypes: TransmissionTemplate[], res: Response<any, Record<string, any>, number>): void {
  res.render('index', generateRecordTransmissionPage(transmissionTypes))
}

export { renderRecordTransmission }
