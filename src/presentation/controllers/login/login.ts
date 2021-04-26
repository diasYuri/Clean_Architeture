import { InvalidParamsError, MissingParamsError } from '../../error'
import { BadRequest } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await new Promise(resolve => resolve(BadRequest(new MissingParamsError('email'))))
    }
    if (!httpRequest.body.password) {
      return new Promise(resolve => resolve(BadRequest(new MissingParamsError('password'))))
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      return await new Promise(resolve => resolve(BadRequest(new InvalidParamsError('email'))))
    }

    return new Promise(resolve => resolve(null))
  }
}
