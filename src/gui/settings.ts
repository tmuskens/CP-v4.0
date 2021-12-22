import { Response } from 'express-serve-static-core'
import { CommandPost } from '../cp'
import { Serials } from '../serials'

function generateSettings (mode: string): any {
  return {
    layout: false,
    mode: mode
  }
}

function generateGeneralSettings (cp: CommandPost, toast?: string): any {
  return {
    layout: false,
    dutyOfficer: cp.getDutyOfficer(),
    callsign: cp.getCallsign(),
    toast: toast,
    mode: cp.getMode()
  }
}

function generateSettingsSerials (serials: Serials, cp: CommandPost): any {
  const transmissions = serials.getTransmissionTypes().map(transmission => transmission.transmission)
  return {
    layout: false,
    locations: cp.getLocations(),
    transmissions: transmissions,
    mode: cp.getMode()
  }
}

function generateTextSettings (type: string, cp: CommandPost): any {
  var data: string = ''
  if (type === 'callsigns') data = cp.getCallsigns().join('\n').trim()
  else if (type === 'locations') data = cp.getLocations().join('\n').trim()
  else throw new Error('invalid text setting type')
  return {
    layout: false,
    type: type,
    data: data,
    mode: cp.getMode()
  }
}

export class SettingsRenderer {
  renderSettings (res: Response<any, Record<string, any>, number>, mode: string): any {
    res.render('settings', generateSettings(mode))
  }

  renderSettingsGeneral (res: Response<any, Record<string, any>, number>, cp: CommandPost, toast?: string): any {
    res.render('settings/general', generateGeneralSettings(cp, toast))
  }

  renderSettingsSerials (res: Response<any, Record<string, any>, number>, serials: Serials, cp: CommandPost): void {
    res.render('settings/serials', generateSettingsSerials(serials, cp))
  }

  renderTextSettings (res: Response<any, Record<string, any>, number>, type: string, cp: CommandPost): void {
    res.render('settings/text_settings', generateTextSettings(type, cp))
  }
}
