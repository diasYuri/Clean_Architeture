import { MissingParamsError } from '../../error'
import { BadRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => resolve(BadRequest(new MissingParamsError('email'))))
  }
}
