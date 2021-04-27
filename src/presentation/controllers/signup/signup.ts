import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount, Validation } from './signup-protocols'
import { InvalidParamsError } from '../../error'
import { BadRequest, serverError, sucess } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return BadRequest(error)
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return BadRequest(new InvalidParamsError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return BadRequest(new InvalidParamsError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return sucess(account)
    } catch (error) {
      console.log(error)
      return serverError(error)
    }
  }
}
