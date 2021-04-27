import { MissingParamsError } from '../../error'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Fields Validation', () => {
  test('should return a MissingParamsError if RequiredFieldValidation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ any_field: 'any_any' })
    expect(error).toEqual(new MissingParamsError('field'))
  })
})
