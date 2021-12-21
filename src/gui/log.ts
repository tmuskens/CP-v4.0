import { Response } from 'express-serve-static-core'
import { DataBase, LogQuery, FullTransmission2 } from '../db'
import { CommandPost } from '../cp'
import { Serial, Serials } from '../serials'

export function renderPrintout (res: Response<any, Record<string, any>, number>, id: number, db: DataBase, print: boolean): void {
  db.getReturn(id, (result) => {
    result.transmission_data = JSON.parse(result.transmission_data)
    const obj: any = {
      log: result,
      print: print,
      layout: false
    }
    res.render('printout', obj)
  })
}

export function renderLog (res: Response<any, Record<string, any>, number>, db: DataBase, query: LogQuery, cp: CommandPost, serials: Serials): void {
  db.getLog(query, (log) => {
    const obj: any = {
      log: log,
      callsigns: cp.getCallsigns(),
      returns: serials.getTransmissionTypes().map(t => t.transmission),
      layout: false
    }
    res.render('log', obj)
  })
}

export function renderEditTransmission (res: Response<any, Record<string, any>, number>,
  db: DataBase, id: number, cp: CommandPost, serials: Serials): void {
  db.getReturn(id, (transmission: FullTransmission2) => {
    const obj = {
      locations: cp.getLocations(),
      callsigns: cp.getCallsigns(),
      transmission: combineTransmissionAndSerials(transmission, serials),
      layout: false
    }
    res.render('edit_transmission', obj)
  })
}

function combineTransmissionAndSerials (transmission: FullTransmission2, serials: Serials): any {
  var serialsArray: Serial[] = []
  try {
    serialsArray = serials.getTransmissionFromString(transmission.transmission_type).serials
  } catch (error) {
    console.log(error)
  }
  const result: any = transmission
  const data: any = JSON.parse(result.transmission_data)
  const newData: any = {}
  for (const key in data) {
    const newSerial: any = {}
    newSerial.data = data[key]
    for (const serial of serialsArray) {
      if (serial.serial === key) {
        newSerial.description = serial.description
        if (serial.type === 'long') newSerial.type = 'long'
        else newSerial.type = 'short'
      }
    }
    if (newSerial.type === undefined) newSerial.type = 'short'
    newData[key] = newSerial
  }
  result.transmission_data = newData
  return result
}
