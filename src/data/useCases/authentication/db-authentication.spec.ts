import { HashComparer } from '../../protocols/criptography/hash-compare'
import { TokenGeneration } from '../../protocols/criptography/token-generation'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/data-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any@mail.com',
  password: 'hashed_password'
})

const makeFakeRequest = () => ({
  email: 'any@mail.com',
  password: 'any_password'
})

const makeLoadStub = () => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account = makeFakeAccount()
      return await new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashCompareStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<Boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeTokenStub = (): TokenGeneration => {
  class TokenGenerationStub implements TokenGeneration {
    async generation (id: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new TokenGenerationStub()
}

interface SutTypes{
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGenerationStub: TokenGeneration
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadStub()
  const hashComparerStub = makeHashCompareStub()
  const tokenGenerationStub = makeTokenStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGenerationStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGenerationStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any@mail.com')
  })

  test('should return throw if LoadAccountByEmailRepository returns throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const acessToken = await sut.auth(makeFakeRequest())
    expect(acessToken).toBeNull()
  })

  test('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const CompareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeRequest())
    expect(CompareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('should return throw if HashComparer returns throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const acessToken = await sut.auth(makeFakeRequest())
    expect(acessToken).toBeNull()
  })

  test('should call TokenGeneration with correct id', async () => {
    const { sut, tokenGenerationStub } = makeSut()
    const tokenSpy = jest.spyOn(tokenGenerationStub, 'generation')
    await sut.auth(makeFakeRequest())
    expect(tokenSpy).toHaveBeenCalledWith('any_id')
  })
})
