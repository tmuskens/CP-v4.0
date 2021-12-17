import { Response } from 'express-serve-static-core'
import { CommandPost } from '../cp'

function generateSettings (): any {
  return {
    layout: false
  }
}

function generateGeneralSettings (cp: CommandPost): any {
  return {
    layout: false,
    dutyOfficer: cp.getDutyOfficer(),
    callsign: cp.getCallsign()
  }
}

export class SettingsRenderer {
  renderSettings (res: Response<any, Record<string, any>, number>): any {
    res.render('settings', generateSettings())
  }

  renderSettingsGeneral (res: Response<any, Record<string, any>, number>, cp: CommandPost): any {
    res.render('settings/general', generateGeneralSettings(cp))
  }
}
