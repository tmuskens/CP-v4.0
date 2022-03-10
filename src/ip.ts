import { networkInterfaces } from 'os'

const nets: any = networkInterfaces()

export function getIp (): string {
  if (nets.en1 !== undefined) {
    for (const x of nets.en1) {
      if (x.family === 'IPv4') {
        return x.address
      }
    }
  }
  if (nets.en0 !== undefined) {
    for (const x of nets.en0) {
      if (x.family === 'IPv4') {
        return x.address
      }
    }
  }
  throw new Error('ip not found')
}
