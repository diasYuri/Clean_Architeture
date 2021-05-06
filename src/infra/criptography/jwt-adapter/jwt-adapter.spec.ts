import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

describe('JWT adapter', () => {
  test('should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const encryptSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(encryptSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
})
