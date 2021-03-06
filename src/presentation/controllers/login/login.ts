import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './login-protocols'
import { BadRequest, serverError, sucess, unauthorized } from '../../helpers/http/http-helper'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication
  constructor (authentication: Authentication, validation: Validation) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return BadRequest(error)
      }

      const acessToken = await this.authentication.auth({ email, password })
      if (!acessToken) {
        return unauthorized()
      }

      return sucess({ acessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
