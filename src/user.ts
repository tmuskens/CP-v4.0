import * as fs from 'fs'
import * as path from 'path'

const USERS_FILE = path.join(__dirname, '../../data/users.txt')

export class CPUser {
  #net: string
  #authToken: string
  constructor (net: string, authToken: string) {
    this.#net = net
    this.#authToken = authToken
    this.#writeToFile()
  }

  #writeToFile (): void {
    const data = this.#authToken + '\\' + this.#net
    fs.appendFile('USERS_FILE', data, function (err) {
      if (err !== null) throw err
    })
  }

  setNet (net: string): void {
    this.#net = net
  }

  getNet (): string {
    return this.#net
  }
}

export function loadUsers (): Record<string, CPUser> {
  const data = fs.readFileSync(USERS_FILE).toString('utf-8')
  const users = data.split('\n')
  const result: Record<string, CPUser> = {}
  for (const line of users) {
    const [token, user] = line.split('\\', 2)
    result[token] = new CPUser(user, token)
  }
  return result
}
