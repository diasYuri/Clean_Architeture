import { DbAddAccount } from '../../data/useCases/add-account/data-add-account'
import { BcryptAdapter } from '../../infra/criptography/brypt-adapter'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/accout'

export const makeSignupController = (): SignUpController => {
  const addAccountRepository = new AccountMongoRepository()
  const encrypterAdapter = new BcryptAdapter(12)
  const emailValidator = new EmailValidatorAdapter()
  const dbAddAccount = new DbAddAccount(encrypterAdapter, addAccountRepository)
  return new SignUpController(emailValidator, dbAddAccount)
}
