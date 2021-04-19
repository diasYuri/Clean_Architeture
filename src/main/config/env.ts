/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://docker:docker@localhost:27017/clean-node-api?authSource=admin',
  port: process.env.PORT || 5050
}
