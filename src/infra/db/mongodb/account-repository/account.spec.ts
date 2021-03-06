import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './accout'

const makeSut = () => {
  return new AccountMongoRepository()
}

describe('Account mongo Repository', () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) { await MongoHelper.connect(process.env.MONGO_URL) }
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('should return an account on sucess', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any@mail.com')
    expect(account.password).toBe('any_password')
  })
})
