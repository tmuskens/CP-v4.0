import * as fs from 'fs'
import * as path from 'path'

const SETTINGS_FILE = path.join(__dirname, '../../data/settings.txt')

export class CommandPost {
  #callsign: string
  #dutyOfficer: string
  #date: Date = new Date()

  constructor (dutyOfficer: string, callsign: string) {
    this.#callsign = callsign
    this.#dutyOfficer = dutyOfficer
  }

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
}

export function loadCP (): CommandPost {
  const data = fs.readFileSync(SETTINGS_FILE).toString('utf-8')
  const settings: string[] = data.split('\n')
  const dutyOfficer: string = settings[0]
  const callsign: string = settings[1]
  return new CommandPost(dutyOfficer, callsign)
}
