import * as fs from 'fs/promises'
import * as path from 'path'

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
    const data: string = await fs.readFile(path.join(__dirname, '../../data/serials.json'), 'utf8')
    obj = JSON.parse(data)
    this.#transmissionTypes = obj.transmissions as TransmissionTemplate[]
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
}
