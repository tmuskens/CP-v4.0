import { Response } from 'express-serve-static-core'

function generateHomePage (): any {
  const transmissions: string[] = ['message', 'locstat'] // transmissions names
  return {
    layout: false,
    transmissions: transmissions
  }
}

function renderHomePage (res: Response<any, Record<string, any>, number>): void {
  res.render('index', generateHomePage())
}

export { renderHomePage }
