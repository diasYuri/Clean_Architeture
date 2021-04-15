import { EmailValidatorAdapter } from './EmailValidator'

describe('Email Validator', () => {
  test('Should return false is validator returns false ', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@gmail.com')

    expect(isValid).toBe(false)
  })
})
