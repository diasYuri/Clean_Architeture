import { EmailValidator, AddAccount, AddAccountModel, AccountModel, Validation } from './signup-protocols'
import { MissingParamsError, ServerError } from '../../error'
import { SignUpController } from './signup'
import { BadRequest } from '../../helpers/http-helper'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true // Um mock sempre tem que retornar o valor default
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        email: 'valid@mail.com',
        name: 'valid_name',
        password: 'valid_password'
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountStub()
}

interface Sut{
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validation
}
const makeSut = (): Sut => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  }
}

const makeFakeRequest = () => ({
  body: {
    id: 'valid_id',
    email: 'valid@mail.com',
    name: 'valid_name',
    password: 'valid_password'
  }
})

describe('SignUp Controller', () => {
  test('Should call EmailValidator with correct email', async () => {
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
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })

  test('Should return 500 if EmailValidator throw', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error('errorMock')
    })

    const httpRequest = {
      body: {
        email: 'any@mail.com',
        name: 'any_name',
        password: 'any123',
        passwordConfirmation: 'any123'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('errorMock'))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any123',
        passwordConfirmation: 'any123'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any123'
    })
  })

  test('Should return 500 if AddAccount throw', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error('errorMock')))
    })

    const httpRequest = {
      body: {
        email: 'any@mail.com',
        name: 'any_name',
        password: 'any123',
        passwordConfirmation: 'any123'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('errorMock'))
  })

  test('Should return 200 if valid data is provider', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'valid@mail.com',
        name: 'valid_name',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      email: 'valid@mail.com',
      name: 'valid_name',
      password: 'valid_password'
    })
  })

  test('should call Validator with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validatorSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 200 if valid data is provider', async () => {
    const { sut, validationStub } = makeSut()

    const httpRequest = makeFakeRequest()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'))
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(BadRequest(new MissingParamsError('any_field')))
  })
})
