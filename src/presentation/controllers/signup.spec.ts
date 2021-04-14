import { InvalidParamsError } from '../error/invalidParamsError'
import { MissingParamsError } from '../error/missingParamsError'
import { ServerError } from '../error/serverError'
import { EmailValidator } from '../protocols/emailValidator'
import { SignUpController } from './signup'

interface Sut{
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): Sut => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true // Um mock sempre tem que retornar o valor default
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@gmail.com',
        password: 'any123',
        passwordConfirmation: 'any123'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('name'))
  })
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any123',
        passwordConfirmation: 'any123'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('email'))
  })
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any@mail.com',
        name: 'any_name',
        passwordConfirmation: 'any123'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))
  })
  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any@mail.com',
        name: 'any_name',
        password: 'any123'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false) // Altera o valor padrão do mock
    const httpRequest = {
      body: {
        email: 'invalid_any@mail.com',
        name: 'any_name',
        password: 'any123',
        passwordConfirmation: 'any123'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any123',
        passwordConfirmation: 'any123'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })

  test('Should return 500 if EmailValidator throw', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }

    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)

    const httpRequest = {
      body: {
        email: 'any@mail.com',
        name: 'any_name',
        password: 'any123',
        passwordConfirmation: 'any123'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
