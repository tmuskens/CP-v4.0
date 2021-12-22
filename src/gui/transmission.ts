import { Response } from 'express-serve-static-core'
import { TransmissionTemplate } from '../serials'
import { CommandPost } from '../cp'
import { CPUser } from '../user'

function generateTransmission (transmission: TransmissionTemplate, cp: CommandPost, user: CPUser, prevId: number): any {
  return {
    transmission: transmission,
    net: user.getNet(),
    dutyOfficer: cp.getDutyOfficer(),
    callsign: cp.getCallsign(),
    locations: cp.getLocations(),
    callsigns: cp.getCallsigns(),
    prevId: prevId,
    layout: false,
    mode: cp.getMode()
  }
}

function renderTransmission (transmission: TransmissionTemplate, cp: CommandPost, user: CPUser, prevId: number, res: Response<any, Record<string, any>, number>): void {
  res.render('transmission', generateTransmission(transmission, cp, user, prevId))
}

export { renderTransmission }
