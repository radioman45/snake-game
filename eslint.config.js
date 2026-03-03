import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

const browserGlobals = {
  AudioContext: 'readonly',
  CanvasRenderingContext2D: 'readonly',
  CancelAnimationFrame: 'readonly',
  DOMException: 'readonly',
  GainNode: 'readonly',
  HTMLElement: 'readonly',
  KeyboardEvent: 'readonly',
  OscillatorNode: 'readonly',
  Touch: 'readonly',
  TouchEvent: 'readonly',
  HTMLCanvasElement: 'readonly',
  localStorage: 'readonly',
  Storage: 'readonly',
  document: 'readonly',
  performance: 'readonly',
  requestAnimationFrame: 'readonly',
  cancelAnimationFrame: 'readonly',
  window: 'readonly',
  globalThis: 'readonly'
}

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: browserGlobals
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn'
    }
  }
]
