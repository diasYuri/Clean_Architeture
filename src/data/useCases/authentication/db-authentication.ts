import { Authentication, AuthenticationModel } from '../../../domain/useCases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-compare'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAcessTokenRepository } from '../../protocols/db/update-acess-token-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAcessTokenRepository: UpdateAcessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAcessTokenRepository: UpdateAcessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAcessTokenRepository = updateAcessTokenRepository
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const acessToken = await this.encrypter.encrypt(account.id)
        await this.updateAcessTokenRepository.update(account.id, acessToken)
        return acessToken
      }
    }
    return null
  }
}
