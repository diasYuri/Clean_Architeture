import { Authentication } from '../../../domain/useCases/authentication'
import { InvalidParamsError, MissingParamsError } from '../../error'
import { BadRequest, serverError, sucess, unauthorized } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validations/validation'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  constructor (emailValidator: EmailValidator, authentication: Authentication, validation: Validation) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamsError(field))
        }
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return BadRequest(new InvalidParamsError('email'))
      }

      const acessToken = await this.authentication.auth(email, password)
      if (!acessToken) {
        return unauthorized()
      }

      return sucess({ acessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
