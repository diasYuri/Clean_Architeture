import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise < string > {
    return await new Promise(resolve => resolve('any_token'))
  }
}))

const makeSut = () => {
  return new JwtAdapter('secret')
}

describe('JWT adapter', () => {
  test('should call sign with correct values', async () => {
    const sut = makeSut()
    const encryptSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(encryptSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('should return a token if sign sucess', async () => {
    const sut = makeSut()
    const token = await sut.encrypt('any_id')
    expect(token).toBe('any_token')
  })

  test('should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
