import { DbAddAccount } from '../../../data/useCases/add-account/data-add-account'
import { BcryptAdapter } from '../../../infra/criptography/brypt-adapter'
import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/accout'
import { LogControlllerDecorator } from '../../decorators/log'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../../presentation/protocols'
import { makeSignupValidation } from './signup-validation'

export const makeSignupController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const hasherAdapter = new BcryptAdapter(12)
  const dbAddAccount = new DbAddAccount(hasherAdapter, accountMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  const signUpController = new SignUpController(dbAddAccount, makeSignupValidation())
  return new LogControlllerDecorator(signUpController, logMongoRepository)
}
