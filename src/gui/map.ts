import { Response } from 'express-serve-static-core'
import { Location } from '../map'
import { CommandPost } from '../cp'

function generateMap (locs: Location[], dtg: number, mode: string): any {
  return {
    layout: false,
    mode: mode,
    locs: locs,
    dtg: dtg
  }
}

function renderMap (locs: Location[], cp: CommandPost, res: Response<any, Record<string, any>, number>): void {
  res.render('map', generateMap(locs, cp.getDtg(), cp.getMode()))
}

export { renderMap }
