export default {
  /* collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 0
    }
  }, */
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  testMatch: [
    '**/*.spec.ts',
    '**/*.test.ts'
  ],
  transform: {
    '.+||.ts$': 'ts-jest'
  }

}
