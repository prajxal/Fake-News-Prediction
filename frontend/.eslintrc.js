/**
 * ESLint configuration for frontend (React)
 * Minimal rules to catch syntax errors and common issues
 * Compatible with Create React App and existing codebase
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module', // ES6 modules
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react'],
  rules: {
    // Disable strict rules that might break existing code
    'no-unused-vars': 'off', // Allow unused variables
    'no-console': 'off', // Allow console.log in development
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
    'react/prop-types': 'off', // Disable prop-types requirement
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
  },
};

