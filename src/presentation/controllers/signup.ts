import { MissingParamsError } from '../error/missingParams'
import { BadRequest } from '../helpers/http-helper'
import { httpRequest, httpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    if (!httpRequest.body.name) {
      return BadRequest(new MissingParamsError('name'))
    }

    if (!httpRequest.body.email) {
      return BadRequest(new MissingParamsError('email'))
    }

    return {
      statusCode: 200
    }
  }
}
