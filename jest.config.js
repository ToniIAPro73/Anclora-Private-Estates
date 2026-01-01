/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Roots
  roots: ['<rootDir>/tests', '<rootDir>/lib'],
  
  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  
  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }]
  },
  
  // Module paths
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup-tests.ts'],
  
  // Coverage
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    '!lib/**/*.d.ts',
    '!lib/**/*.test.{ts,tsx}',
    '!lib/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Timeouts
  testTimeout: 10000,
  
  // Clear mocks
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Verbose
  verbose: true,
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.next/',
  ],
  
  // Global setup/teardown
  // globalSetup: '<rootDir>/tests/global-setup.ts',
  // globalTeardown: '<rootDir>/tests/global-teardown.ts',
};
