import { ServerError } from '../error'
import { HttpResponse } from '../protocols/http'

export const BadRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const serverError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(error.stack)
  }
}

export const sucess = (data: any): HttpResponse => {
  return {
    statusCode: 200,
    body: data
  }
}
