
import * as path from 'path'

import { writeArrayIntoFile, readTextIntoArray } from './utils'

const MAP_FILE = path.join(process.cwd(), '/data/map.txt')

export interface Location {
  callsign: string
  gr: number /* 6 figure grid reference */
  dtg: number
  id: number
}

export class Map {
  #callsigns: string[] = [] /* Callsigns that we are actively tracking location of */
  #locReturn: string
  #locSerial: string

  constructor (locReturn: string, locSerial: string) {
    this.#locReturn = locReturn
    this.#locSerial = locSerial
  }

  setLocReturn (adminReturn: string): void {
    this.#locReturn = adminReturn
    writeArrayIntoFile(MAP_FILE, [this.#locReturn, this.#locSerial])
  }

  setLocSerial (serial: string): void {
    this.#locSerial = serial
    writeArrayIntoFile(MAP_FILE, [this.#locReturn, this.#locSerial])
  }

  getLocReturn (): string {
    return this.#locReturn
  }

  getLocSerial (): string {
    return this.#locSerial
  }

  addCallsign (callsign: string): boolean {
    return false
  }

  removeCallsign (callsign: string): boolean {
    return false
  }

  getCallsigns (): string[] {
    return []
  }
}

export function loadMapData (): Map {
  const settings: string[] = readTextIntoArray(MAP_FILE)
  const locReturn = settings[0]
  const locSerial = settings[1]
  const map = new Map(locReturn, locSerial)
  return map
}
