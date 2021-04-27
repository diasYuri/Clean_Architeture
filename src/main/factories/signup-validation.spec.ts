import { CompareFieldsValidation } from '../../presentation/helpers/validations/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validations/required-field-validation'
import { Validation } from '../../presentation/helpers/validations/validation'
import { ValidationComposite } from '../../presentation/helpers/validations/validation-composite'
import { makeSignupValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validations/validation-composite')

describe('SignUpValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignupValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
