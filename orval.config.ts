import { defineConfig } from 'orval';

export default defineConfig({
  photoPortfolio: {
    input: './api/openapi.yaml',
    output: {
      mode: 'tags-split',
      target: './src/app/api/generated/endpoints',
      schemas: './src/app/api/generated/model',
      client: 'angular',
      mock: { generators: [{ type: 'msw' }] },
      clean: true,
    },
  },
});
