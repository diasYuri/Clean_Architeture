import { DbAddAccount } from './data-add-account'

describe('Data AddAccount', () => {
  test('should calls Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (password: string): Promise<string> {
        return await new Promise(resolve => resolve('hash_password'))
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
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
