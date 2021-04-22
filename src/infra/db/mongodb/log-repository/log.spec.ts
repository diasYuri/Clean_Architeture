import { MongoHelper } from '../helpers/mongo-helper'

describe('LogError Repository', () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) { await MongoHelper.connect(process.env.MONGO_URL) }
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('error')
    await accountCollection.deleteMany({})
  })

  test('should create an error log on sucess', () => {

  })
})
