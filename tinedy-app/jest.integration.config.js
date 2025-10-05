// Jest config for integration tests (no DOM testing needed)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'node', // Use node environment for API integration tests
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/integration/**/*.test.[jt]s',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(date-fns|firebase)/)',
  ],
  // No setupFilesAfterEnv for integration tests - they don't need jest-dom
};

module.exports = createJestConfig(customJestConfig);
