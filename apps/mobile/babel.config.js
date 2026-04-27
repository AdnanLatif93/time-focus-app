module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
          '@components': './src/components',
          '@theme':      './src/theme',
          '@hooks':      './src/hooks',
          '@store':      './src/store',
          '@services':   './src/services',
          '@modules':    './src/modules',
          '@navigation': './src/navigation',
          '@timer':      './src/timer',
          '@assets':     './src/assets',
          '@tokens':     './src/design-tokens',
          '@widget':     './src/widget',
          '@':           './src',
        },
      },
    ],
  ],
};
