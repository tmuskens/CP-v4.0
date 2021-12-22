import { Response } from 'express-serve-static-core'
import { TransmissionTemplate } from '../serials'

function generateRecordTransmissionPage (transmissionTypes: TransmissionTemplate[], mode: string): any {
  return {
    layout: false,
    defaultTransmission: transmissionTypes[0].transmission,
    transmissions: transmissionTypes,
    mode: mode
  }
}

function renderRecordTransmission (transmissionTypes: TransmissionTemplate[], res: Response<any, Record<string, any>, number>, mode: string): void {
  res.render('index', generateRecordTransmissionPage(transmissionTypes, mode))
}

export { renderRecordTransmission }
