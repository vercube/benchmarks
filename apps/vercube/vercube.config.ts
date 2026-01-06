import { defineConfig } from '@vercube/core';

export default defineConfig({

  server: {
    host: '127.0.0.1',
    port: 3000,
  },
  
  build: {
    entry: './src/main.ts',
  }

});