import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './data-add-account'

interface SutTypes{
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hash_password'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('Data AddAccount', () => {
  test('should calls Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const EncrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }

    await sut.add(accountData)
    expect(EncrypterSpy).toBeCalledWith(accountData.password)
  })
})
