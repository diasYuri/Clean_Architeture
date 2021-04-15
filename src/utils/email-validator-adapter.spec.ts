import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = () => {
  return new EmailValidatorAdapter()
}

describe('Email Validator', () => {
  test('Should return false is validator returns false ', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@gmail.com')

    expect(isValid).toBe(false)
  })

  test('Should return true is validator returns true ', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@gmail.com')

    expect(isValid).toBe(true)
  })

  test('Should call EmailVAlidator with correct email ', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    const correctEmail = 'valid_email@gmail.com'
    sut.isValid(correctEmail)
    expect(isEmailSpy).toHaveBeenCalledWith(correctEmail)
  })
})
