import { config } from '@leetcode-insights/eslint-config/base';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error'
    }
  }
];
