import { networkInterfaces } from 'os'

const nets: any = networkInterfaces()

export function getIp (): string {
  for (const x of nets.en1) {
    if (x.family === 'IPv4') {
      return x.address
    }
  }
  throw new Error('ip not found')
}
