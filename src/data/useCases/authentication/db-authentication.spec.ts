import { HashComparer } from '../../protocols/criptography/hash-compare'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAcessTokenRepository } from '../../protocols/db/update-acess-token-repository'
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

const makeTokenStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new EncrypterStub()
}

const makeUpdateStub = (): UpdateAcessTokenRepository => {
  class UpdateAcessTokenRepositoryStub implements UpdateAcessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new UpdateAcessTokenRepositoryStub()
}

interface SutTypes{
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAcessTokenRepositoryStub: UpdateAcessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadStub()
  const hashComparerStub = makeHashCompareStub()
  const encrypterStub = makeTokenStub()
  const updateAcessTokenRepositoryStub = makeUpdateStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAcessTokenRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAcessTokenRepositoryStub
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

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const tokenSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeRequest())
    expect(tokenSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return throw if Encrypter returns throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('should return acessToken on sucess', async () => {
    const { sut } = makeSut()
    const acessToken = await sut.auth(makeFakeRequest())
    expect(acessToken).toBe('any_token')
  })

  test('should call UpdateAcessTokenRepository with correct values', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAcessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeRequest())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('should return throw if UpdateAcessTokenRepository returns throws', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAcessTokenRepositoryStub, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })
})
