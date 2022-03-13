
import * as path from 'path'

import { writeArrayIntoFile, readTextIntoArray } from './utils'

const MAP_SETTINGS_FILE = path.join(process.cwd(), '/data/map.txt')

export interface Location {
  callsign: string
  gr: number /* 6 figure grid reference */
  dtg: number
  id: number
}
export interface MapSettings {
  locReturn: string
  locSerial: string
  east: number
  west: number
  south: number
  north: number
  height: number
  width: number
  file: string | undefined
}

export class Map {
  #callsigns: string[] = [] /* Callsigns that we are actively tracking location of */
  #locReturn: string
  #locSerial: string
  #fileName: string | undefined = undefined
  #bounds: number[] = [0, 0, 0, 0] /* east, west, south, north */
  #dimensions: number[] = [0, 0] /* height, width */

  constructor (file: string | undefined, locReturn: string, locSerial: string,
    bounds: number[], dimensions: number[]) {
    this.#locReturn = locReturn
    this.#locSerial = locSerial
    this.#fileName = file
    this.#bounds = bounds
    this.#dimensions = dimensions
  }

  setLocReturn (adminReturn: string): void {
    this.#locReturn = adminReturn
    this.#writeMapSettingsToFile()
  }

  setLocSerial (serial: string): void {
    this.#locSerial = serial
    this.#writeMapSettingsToFile()
  }

  getLocReturn (): string {
    return this.#locReturn
  }

  getLocSerial (): string {
    return this.#locSerial
  }

  // addCallsign (callsign: string): boolean {
  //   return false
  // }

  // removeCallsign (callsign: string): boolean {
  //   return false
  // }

  // getCallsigns (): string[] {
  //   return []
  // }

  getMapSettings (): MapSettings {
    return {
      locReturn: this.#locReturn,
      locSerial: this.#locSerial,
      east: this.#bounds[0],
      west: this.#bounds[1],
      south: this.#bounds[2],
      north: this.#bounds[3],
      height: this.#dimensions[0],
      width: this.#dimensions[1],
      file: this.#fileName
    }
  }

  #writeMapSettingsToFile (): void {
    const file = (this.#fileName === undefined) ? '' : this.#fileName
    var result = [file, this.#locReturn, this.#locSerial]
    result = result.concat(this.#bounds.map((x) => x.toString()))
    result = result.concat(this.#dimensions.map((x) => x.toString()))
    writeArrayIntoFile(MAP_SETTINGS_FILE, result)
  }
}

export function loadMapData (): Map {
  const settings: string[] = readTextIntoArray(MAP_SETTINGS_FILE)
  const file = (settings[0].length > 0) ? settings[0] : undefined
  const locReturn = settings[1]
  const locSerial = settings[2]
  const bounds: number[] = [settings[3], settings[4], settings[5], settings[6]].map((str: string) => parseInt(str))
  const dimensions: number[] = [settings[7], settings[8]].map((str: string) => parseInt(str))
  const map = new Map(file, locReturn, locSerial, bounds, dimensions)
  return map
}
