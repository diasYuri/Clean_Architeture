import { httpResponse } from '../protocols/http'

export const BadRequest = (error: Error): httpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}
