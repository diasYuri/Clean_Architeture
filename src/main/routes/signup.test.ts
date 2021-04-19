import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('should returns status code 200 on sucess', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any123'
      })
      .expect(200)
  })
})
