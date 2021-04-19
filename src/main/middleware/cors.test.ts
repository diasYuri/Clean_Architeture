import request from 'supertest'
import app from '../config/app'

describe('CORS middleware', () => {
  test('should enable cors', async () => {
    app.get('/test-cors', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test-cors')
      .expect('acess-control-allow-origins', '*')
      .expect('acess-control-allow-headers', '*')
      .expect('acess-control-allow-methods', '*')
  })
})
