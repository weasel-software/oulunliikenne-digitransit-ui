module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['airbnb', 'plugin:prettier/recommended'],
  rules: {
    curly: ['error', 'all'],
    'default-param-last': 'off',
    'prefer-object-spread': 'warn',
    'sort-keys': 'off',
    'lines-between-class-members': 'warn',
    // Require custom extension
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],
    'react/jsx-key': 'error',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'react/destructuring-assignment': 'off',
    'react/sort-comp': 'off',
    'react/button-has-type': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'compat/compat': 'error',
    // Enable GraphQL linting
    'graphql/template-strings': [
      'error',
      {
        env: 'relay',
        // eslint-disable-next-line global-require
        schemaJson: require('./build/schema.json'),
      },
    ],
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
  },
  env: {
    browser: true,
  },
  plugins: ['react', 'graphql', 'compat', 'prettier'],
  settings: {
    polyfills: ['fetch', 'promises'],
  },
};
