import express from 'express'
import setMiddlewares from './middleware'
const app = express()
setMiddlewares(app)
export default app
