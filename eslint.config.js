import { config } from '@leetcode-insights/eslint-config/base';

export default [
  {
    ignores: ['apps/**', 'packages/**']
  },
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: true
      }
    }
  }
];
