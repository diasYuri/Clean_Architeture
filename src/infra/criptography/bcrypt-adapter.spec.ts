import bcrypt from 'bcrypt'

import { BcryptAdapter } from './brypt-adapter'

const salt = 12
const makeSut = () => {
  return new BcryptAdapter(salt)
}

jest.mock('bcrypt', () => ({
  async hash (): Promise < string > {
    return await new Promise(resolve => resolve('hash'))
  }
}))

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt eith correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toBeCalledWith('any_value', salt)
  })

  test('should return a has on sucess', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
