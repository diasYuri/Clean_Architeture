export class InvalidParamsError extends Error {
  constructor (paramsName: string) {
    super(`Invalid params: ${paramsName}`)
    this.name = 'InvalidParamsError'
  }
}
