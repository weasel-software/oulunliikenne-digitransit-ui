module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          browsers: [],
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    'dynamic-import-node',
    [
      'relay',
      {
        compat: true,
        schema: 'build/schema.json',
      },
    ],
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-transform-class-properties', { loose: true }],
    '@babel/plugin-transform-json-strings',
    ['@babel/plugin-transform-private-methods', { loose: true }],
  ],
  env: {
    test: {
      plugins: ['istanbul'],
    },
  },
};
