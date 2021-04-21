import { ServerError } from '../error'
import { httpResponse } from '../protocols/http'

export const BadRequest = (error: Error): httpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const serverError = (error: Error): httpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(error.stack)
  }
}

export const sucess = (data: any): httpResponse => {
  return {
    statusCode: 200,
    body: data
  }
}
