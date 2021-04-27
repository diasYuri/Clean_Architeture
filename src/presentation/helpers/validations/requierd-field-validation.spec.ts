import { InvalidParamsError } from '../../error'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('Required Fields Validation', () => {
  test('should return a MissingParamsError if RequiredFieldValidation fails', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'another_value'
    })
    expect(error).toEqual(new InvalidParamsError('fieldToCompare'))
  })

  test('should return null if RequiredFieldValidation sucess', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })
    expect(error).toBeFalsy()
  })
})
