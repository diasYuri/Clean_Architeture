import { AddAccount } from '../../domain/useCases/addAccount'
import { InvalidParamsError, MissingParamsError } from '../error'
import { BadRequest, serverError } from '../helpers/http-helper'
import { httpRequest, httpResponse, Controller, EmailValidator } from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: httpRequest): httpResponse {
    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamsError(field))
        }
      }

      if (password !== passwordConfirmation) {
        return BadRequest(new InvalidParamsError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return BadRequest(new InvalidParamsError('email'))
      }

      this.addAccount.add({
        name,
        email,
        password
      })

      // provisorio
      return {
        statusCode: 200
      }
    } catch (error) {
      return serverError()
    }
  }
}
