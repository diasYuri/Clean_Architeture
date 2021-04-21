import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('should reconnect if mongodb connection is down', async () => {
    let accountColletion = await sut.getCollection('accounts')
    expect(accountColletion).toBeTruthy()
    await sut.disconnect()
    accountColletion = await sut.getCollection('accounts')
    console.log(accountColletion)
    expect(accountColletion).toBeTruthy()
  })
})
