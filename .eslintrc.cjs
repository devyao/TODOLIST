module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  plugins: ['vue', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 关闭生产环境下的console.log
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 关闭生产环境下的debugger
    'no-unused-vars': 'error', // 禁止定义未使用的变量
    'no-var': 'error' // 要求使用 let 或 const 而不是 var
  }
}
