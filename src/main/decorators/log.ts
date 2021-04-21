import { Controller, httpRequest, httpResponse } from '../../presentation/protocols'

export class LogControlllerDecorator implements Controller {
  private readonly controller: Controller

  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: httpRequest): Promise<httpResponse> {
    this.controller.handle(httpRequest)
    return null
  }
}
