import { MissingParamsError } from '../../error'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes{
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('should return error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamsError('field'))
    const error = sut.validate({ field: 'any' })
    expect(error).toEqual(new MissingParamsError('field'))
  })

  test('should return first error if more one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamsError('field'))
    const error = sut.validate({ field: 'any' })
    expect(error).toEqual(new Error())
  })

  test('should return null if validations suceeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any' })
    expect(error).toBeFalsy()
  })
})
