export class MissingParamsError extends Error {
  constructor (paramsName: string) {
    super(`Missing params: ${paramsName}`)
    this.name = 'MissingParamsError'
  }
}
