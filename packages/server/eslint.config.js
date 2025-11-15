import baseConfig from '../../eslint.config.js'

const __dirname = import.meta.dirname

export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname
      }
    }
  }
]
