import { Authentication } from '../../../domain/useCases/authentication'
import { InvalidParamsError, MissingParamsError } from '../../error'
import { BadRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { HttpRequest, EmailValidator } from '../../protocols'
import { LoginController } from './login'

interface SutTypes{
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any@gmail.com',
    password: 'any123'
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub
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

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any@gmail.com')
  })

  test('should return bad request if an invalid email is provider', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(BadRequest(new InvalidParamsError('email')))
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())
    const { email, password } = makeFakeRequest().body
    expect(authSpy).toHaveBeenCalledWith(email, password)
  })

  test('should return 401 if invalid credentials', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null)

    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })
})
