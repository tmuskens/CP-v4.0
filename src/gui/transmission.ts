import { Response } from 'express-serve-static-core'
import { TransmissionTemplate } from '../serials'
import { CommandPost } from '../cp'
import { CPUser } from '../user'

function generateTransmission (transmission: TransmissionTemplate, cp: CommandPost, user: CPUser): any {
  return {
    transmission: transmission,
    net: user.getNet(),
    dutyOfficer: cp.getDutyOfficer(),
    callsign: cp.getCallsign(),
    locations: cp.getLocations(),
    callsigns: cp.getCallsigns(),
    layout: false
  }
}

function renderTransmission (transmission: TransmissionTemplate, cp: CommandPost, user: CPUser, res: Response<any, Record<string, any>, number>): void {
  res.render('transmission', generateTransmission(transmission, cp, user))
}

export { renderTransmission }
