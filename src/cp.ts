import * as path from 'path'

import { writeArrayIntoFile, readTextIntoArray } from './utils'

const SETTINGS_FILE = path.join(process.cwd(), '/data/settings.txt')
const CALLSIGNS_FILE = path.join(process.cwd(), '/data/callsigns.txt')
const LOCATIONS_FILE = path.join(process.cwd(), '/data/locations.txt')

export class CommandPost {
  #callsign: string = ''
  #dutyOfficer: string = ''
  #callsigns: string[] = []
  #locations: string[] = []
  #date: Date = new Date()

  setCallsign (callsign: string): void {
    this.#callsign = callsign
    const settings = [this.#dutyOfficer, this.#callsign]
    writeArrayIntoFile(SETTINGS_FILE, settings)
  }

  getCallsign (): string {
    return this.#callsign
  }

  setDutyOfficer (dutyOfficer: string): void {
    this.#dutyOfficer = dutyOfficer
    const settings = [this.#dutyOfficer, this.#callsign]
    writeArrayIntoFile(SETTINGS_FILE, settings)
  }

  getDutyOfficer (): string {
    return this.#dutyOfficer
  }

  getDtg (): number {
    return (this.#date.getDate() * 10000 +
            this.#date.getHours() * 100 +
            this.#date.getMinutes())
  }

  getDtgString (): string {
    const dtg: string = (this.getDtg()).toString()
    return (dtg.length === 5) ? '0' + dtg : dtg
  }

  setCallsigns (callsigns: string[]): void {
    this.#callsigns = callsigns
    writeArrayIntoFile(CALLSIGNS_FILE, callsigns)
  }

  getCallsigns (): string[] {
    return this.#callsigns
  }

  setLocations (locations: string[]): void {
    this.#locations = locations
    writeArrayIntoFile(LOCATIONS_FILE, locations)
  }

  getLocations (): string[] {
    return this.#locations
  }

  getMode (): string {
    if (this.#date.getHours() > 19 || this.#date.getHours() < 6) return 'dark'
    return 'light'
  }
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
