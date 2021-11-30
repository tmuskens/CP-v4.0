export class CommandPost {
  #callsign: string = ''
  #dutyOfficer: string = ''

  setCallsign (callsign: string): void {
    this.#callsign = callsign
  }

  getCallsign (): string {
    return this.#callsign
  }

  setDutyOfficer (dutyOfficer: string): void {
    this.#dutyOfficer = dutyOfficer
  }

  getDutyOfficer (): string {
    return this.#dutyOfficer
  }
}
