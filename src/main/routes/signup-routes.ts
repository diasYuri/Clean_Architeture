/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoutes } from '../adapters/adapter-express-routes'
import { makeSignupController } from '../factories/signup/signup'

export default (router: Router): void => {
  router.post('/signup', adaptRoutes(makeSignupController()))
}
