import { ServerError } from '../error/serverError'
import { httpResponse } from '../protocols/http'

export const BadRequest = (error: Error): httpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const serverError = (): httpResponse => {
  return {
    statusCode: 500,
    body: new ServerError()
  }
}
