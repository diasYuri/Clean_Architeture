export class UnauthorizedError extends Error {
  constructor () {
    super('unathorized')
    this.name = 'UnathorizedError'
  }
}
