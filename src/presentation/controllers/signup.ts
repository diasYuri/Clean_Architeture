import { MissingParamsError } from '../error/missingParams'
import { BadRequest } from '../helpers/http-helper'
import { httpRequest, httpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    const requiredFields = ['name', 'email']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return BadRequest(new MissingParamsError(field))
      }
    }

    return {
      statusCode: 200
    }
  }
}
