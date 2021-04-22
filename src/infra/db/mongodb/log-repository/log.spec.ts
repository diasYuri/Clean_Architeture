import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('LogError Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    if (process.env.MONGO_URL) { await MongoHelper.connect(process.env.MONGO_URL) }
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('error')
    await errorCollection.deleteMany({})
  })

  test('should create an error log on sucess', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
