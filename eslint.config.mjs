import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  {
    ignores: ['next.config.js', 'next.config.mjs', 'next.config.ts']
  },
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'plugin:security/recommended-legacy',
      'prettier'
    ],
    plugins: ['simple-import-sort'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'security/detect-object-injection': 'warn'
    }
  })
];

export default eslintConfig;
