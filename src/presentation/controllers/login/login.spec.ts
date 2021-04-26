import { MissingParamsError } from '../../error'
import { BadRequest } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { LoginController } from './login'

interface SutTypes{
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()

  return {
    sut
  }
}

describe('Login controller test', () => {
  test('should return bad request if no email is provider', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any123'
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response).toEqual(BadRequest(new MissingParamsError('email')))
  })

  test('should return bad request if no password is provider', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@gmail.com'
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response).toEqual(BadRequest(new MissingParamsError('password')))
  })
})
