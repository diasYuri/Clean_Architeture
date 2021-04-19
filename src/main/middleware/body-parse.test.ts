import request from 'supertest'
import app from '../config/app'

describe('Body parse middleware', () => {
  test('should parse body as json', async () => {
    app.post('/test-body-parse', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test-body-parse')
      .send({ name: 'yuri' })
      .expect({ name: 'yuri' })
  })
})
