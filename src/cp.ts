import * as fs from 'fs'
import * as path from 'path'

const SETTINGS_FILE = path.join(__dirname, '../../data/settings.txt')
const CALLSIGNS_FILE = path.join(__dirname, '../../data/callsigns.txt')
const LOCATIONS_FILE = path.join(__dirname, '../../data/locations.txt')

export class CommandPost {
  #callsign: string = ''
  #dutyOfficer: string = ''
  #callsigns: string[] = []
  #locations: string[] = []
  #date: Date = new Date()

  setCallsign (callsign: string): void {
    this.#callsign = callsign
  }

  getCallsign (): string {
    return this.#callsign
  }

  setDutyOfficer (dutyOfficer: string): void {
    this.#dutyOfficer = dutyOfficer
  }

  getDutyOfficer (): string {
    return this.#dutyOfficer
  }

  getDtg (): number {
    return (this.#date.getDate() * 10000 +
            this.#date.getHours() * 100 +
            this.#date.getMinutes())
  }

  setCallsigns (callsigns: string[]): void {
    this.#callsigns = callsigns
  }

  getCallsigns (): string[] {
    return this.#callsigns
  }

  setLocations (locations: string[]): void {
    this.#locations = locations
  }

  getLocations (): string[] {
    return this.#locations
  }
}

function readTextIntoArray (file: string): string[] {
  const data: string = fs.readFileSync(file).toString('utf-8')
  return data.split('\n')
}

export function loadCP (): CommandPost {
  const settings: string[] = readTextIntoArray(SETTINGS_FILE)
  const dutyOfficer: string = settings[0]
  const callsign: string = settings[1]
  const callsigns: string[] = readTextIntoArray(CALLSIGNS_FILE)
  const locations: string[] = readTextIntoArray(LOCATIONS_FILE)

  const cp: CommandPost = new CommandPost()
  cp.setCallsign(callsign)
  cp.setDutyOfficer(dutyOfficer)
  cp.setCallsigns(callsigns)
  cp.setLocations(locations)
  return cp
}
