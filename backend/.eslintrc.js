/**
 * ESLint configuration for backend (Node.js/Express)
 * Minimal rules to catch syntax errors and common issues
 * Compatible with CommonJS and existing codebase
 */
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'script', // CommonJS
  },
  rules: {
    // Disable strict rules that might break existing code
    'no-unused-vars': 'off', // Allow unused variables
    'no-console': 'off', // Allow console.log in backend
    'no-undef': 'error', // Catch undefined variables
    'no-unreachable': 'error', // Catch unreachable code
    'no-duplicate-case': 'error', // Catch duplicate case labels
    'no-empty': 'warn', // Warn on empty blocks
    'no-extra-semi': 'error', // Catch extra semicolons
    'no-func-assign': 'error', // Prevent function reassignment
    'no-invalid-regexp': 'error', // Catch invalid regex
    'no-irregular-whitespace': 'error', // Catch irregular whitespace
    'no-sparse-arrays': 'error', // Catch sparse arrays
    'no-unexpected-multiline': 'error', // Catch ASI issues
    'valid-typeof': 'error', // Validate typeof comparisons
  },
};

