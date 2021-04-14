import { InvalidParamsError, MissingParamsError } from '../error'
import { BadRequest, serverError } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { httpRequest, httpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  private readonly emailValidator

  constructor (emailValidator: any) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: httpRequest): httpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamsError(field))
        }
      }

      const { email } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return BadRequest(new InvalidParamsError('email'))
      }

      return {
        statusCode: 200
      }
    } catch (error) {
      return serverError()
    }
  }
}
