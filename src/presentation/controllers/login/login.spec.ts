import { Authentication } from '../../../domain/useCases/authentication'
import { InvalidParamsError, MissingParamsError } from '../../error'
import { BadRequest, serverError, sucess, unauthorized } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validations/validation'
import { HttpRequest, EmailValidator } from '../../protocols'
import { LoginController } from './login'

interface SutTypes{
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
  validationStub: Validation
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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(emailValidatorStub, authenticationStub, validationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
    validationStub
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

  test('should call Authentication with correct values', async () => {
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

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('should return 200 on sucess', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(sucess({ acessToken: 'any_token' }))
  })

  /* test('should call Validator with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validatorSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body)
  }) */
})
