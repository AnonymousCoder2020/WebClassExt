module.exports = {
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    [
      'transform-imports',
      {
        'lodash-es': {
          transform: 'lodash-es/${member}',
        },
        'next-ts-utility': {
          transform: 'next-ts-utility/dist/${member}',
        },
        'my-useful-objects': {
          transform: 'my-useful-objects/dist/${member}',
        },
      },
    ],
  ],
}
