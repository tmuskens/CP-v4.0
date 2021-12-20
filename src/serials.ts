import * as fs from 'fs/promises'
import * as path from 'path'

const SERIALS_FILE = path.join(__dirname, '../../data/serials.json')

enum SerialType {
  Long = 'long',
  Short = 'short',
  Loc = 'loc',
  Option = 'option'
}

export interface Serial {
  serial: string
  description: string
  type: SerialType
  options?: string[]
}

export interface TransmissionTemplate {
  transmission: string
  serials: Serial[]
}

export class Serials {
  #transmissionTypes: TransmissionTemplate[] = []

  async readFile (): Promise<void> {
    var obj: any
    const data: string = await fs.readFile(SERIALS_FILE, 'utf8')
    obj = JSON.parse(data)
    this.#transmissionTypes = obj.transmissions as TransmissionTemplate[]
  }

  async updateFile (): Promise<void> {
    const json: any = { transmissions: this.#transmissionTypes }
    fs.writeFile(SERIALS_FILE, JSON.stringify(json), 'utf8').catch(err => { throw err })
  }

  getTransmissionFromString (transmission: string): TransmissionTemplate {
    for (const tm of this.#transmissionTypes) {
      if (tm.transmission === transmission) return tm
    }
    throw new Error('Transmission not found')
  }

  getTransmissionTypes (): TransmissionTemplate[] {
    return this.#transmissionTypes
  }

  updateTransmissionType (transmission: TransmissionTemplate, oldName: string): string {
    for (let i = 0; i < this.#transmissionTypes.length; i++) {
      if (this.#transmissionTypes[i].transmission === oldName) {
        this.#transmissionTypes[i] = transmission
        this.updateFile().catch(err => console.log(err))
        return 'success'
      }
    }
    return 'cannot find old transmission'
  }

  newTransmissionType (transmission: TransmissionTemplate): string {
    for (const tm of this.#transmissionTypes) {
      if (tm.transmission === transmission.transmission) return 'Return name already exists'
    }
    this.#transmissionTypes.push(transmission)
    this.updateFile().catch(err => console.log(err))
    return 'success'
  }

  deleteTransmissionType (name: string): string {
    for (let i = 0; i < this.#transmissionTypes.length; i++) {
      if (this.#transmissionTypes[i].transmission === name) {
        this.#transmissionTypes.splice(i, 1)
        this.updateFile().catch(err => console.log(err))
        return 'success'
      }
    }
    return 'cannot find transmission'
  }
}
