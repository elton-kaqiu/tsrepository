import 'reflect-metadata'; // Required for TypeORM
import dotenv from 'dotenv'; // Load .env variables
dotenv.config(); // Initialize environment variables

// Mock global functions (if needed)
globalThis.fetch = jest.fn();

// Extend Jest functionality
import 'jest-extended';

// Set default timeout for tests
jest.setTimeout(30000);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  throw reason;
});
