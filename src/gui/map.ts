import { Response } from 'express-serve-static-core'
import { Location } from '../map'

function generateMap (locs: Location[], dtg: number, mode: string): any {
  return {
    layout: false,
    mode: mode,
    locs: locs,
    dtg: dtg
  }
}

function renderMap (locs: Location[], dtg: number, res: Response<any, Record<string, any>, number>, mode: string): void {
  res.render('map', generateMap(locs, dtg, mode))
}

export { renderMap }
