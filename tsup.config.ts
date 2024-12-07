import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Ensure this includes all exports from src/interfaces
  format: ['cjs', 'esm'], // Output formats
  dts: true, // Generate TypeScript declaration files
  sourcemap: true, // Generate sourcemaps
  clean: true, // Clean output folder before building
});
