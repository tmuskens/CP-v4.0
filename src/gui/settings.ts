import { Response } from 'express-serve-static-core'
import { CommandPost } from '../cp'

function generateSettings (): any {
  return {
    layout: false
  }
}

function generateGeneralSettings (cp: CommandPost, toast?: string): any {
  return {
    layout: false,
    dutyOfficer: cp.getDutyOfficer(),
    callsign: cp.getCallsign(),
    toast: toast
  }
}

export class SettingsRenderer {
  renderSettings (res: Response<any, Record<string, any>, number>): any {
    res.render('settings', generateSettings())
  }

  renderSettingsGeneral (res: Response<any, Record<string, any>, number>, cp: CommandPost, toast?: string): any {
    res.render('settings/general', generateGeneralSettings(cp, toast))
  }
}
