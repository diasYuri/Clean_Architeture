export default {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 60
    }
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testMatch: [
    '**/?**/*.spec.ts',
    '**/?**/*.test.ts'
  ],
  transform: {
    '.+||.ts$': 'ts-jest'
  }

}
