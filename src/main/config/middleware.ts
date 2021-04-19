import { Express } from 'express'
import { bodyParser } from '../middleware/body-parse'
import { contentType } from '../middleware/content-type'
import { cors } from '../middleware/cors'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
