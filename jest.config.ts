export default {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 0
    }
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  testMatch: [
    '**/?**/*.spec.ts',
    '**/?**/*.test.ts'
  ],
  transform: {
    '.+||.ts$': 'ts-jest'
  }

}
