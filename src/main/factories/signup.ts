import { DbAddAccount } from '../../data/useCases/add-account/data-add-account'
import { BcryptAdapter } from '../../infra/criptography/brypt-adapter'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/accout'
import { LogControlllerDecorator } from '../decorators/log'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../presentation/protocols'

export const makeSignupController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const encrypterAdapter = new BcryptAdapter(12)
  const dbAddAccount = new DbAddAccount(encrypterAdapter, accountMongoRepository)
  const emailValidator = new EmailValidatorAdapter()
  const logMongoRepository = new LogMongoRepository()
  const signUpController = new SignUpController(emailValidator, dbAddAccount)
  return new LogControlllerDecorator(signUpController, logMongoRepository)
}
