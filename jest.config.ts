import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  rootDir: './', // Ensure Jest knows the root directory
  testEnvironment: 'node', // Use Node.js environment for tests
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to handle TypeScript files
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'], // Extensions Jest should process
  testMatch: ['<rootDir>/tests/**/*.test.ts'], // Match test files in the `tests` directory and subdirectories
  collectCoverage: true, // Enable coverage reporting
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Collect coverage from all TypeScript files
    '!src/**/_index.ts', // Exclude index files from coverage
  ],
  coverageDirectory: 'coverage', // Directory to output coverage reports
  coverageReporters: ['text', 'lcov'], // Coverage report formats
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Optional setup file for initializing mocks
};

export default config;
