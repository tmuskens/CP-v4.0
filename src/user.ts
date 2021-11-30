export class CPUser {
  #net: string = ''

  setNet (net: string): void {
    this.#net = net
  }

  getNet (): string {
    return this.#net
  }
}
