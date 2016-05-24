const coffeelint = require('coffeelint')
const test = require('ava')
const {codify} = require('../_lib/utils')

const config = {
  'no_global_tests': {
    'module': __dirname
  }
}

test('disallows global tests', t => {
  const methods = [
    'it', 'it.only', 'it.skip',
    'test', 'test.only', 'test.skip',
    'specify', 'specify.only', 'specify.skip'
  ]

  t.plan(methods.length * 3)
  methods.forEach(method => {
    const code = codify(`
      ${method} 'pending', ->
    `)
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 1)
    t.is(errors[0].lineNumber, 1)
    t.is(errors[0].message, 'Unexpected global Mocha test')
  })
})

test('allows scoped tests', t => {
  const methods = [
    'it', 'it.only', 'it.skip',
    'test', 'test.only', 'test.skip',
    'specify', 'specify.only', 'specify.skip'
  ]

  t.plan(methods.length)
  methods.forEach(method => {
    const code = codify(`
      describe 'description', ->
        ${method} 'implemented', ->
    `)
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 0)
  })
})

test('ignores unknown constructions', t => {
  const code = codify(`
    it.trololo 'unknown construction'
  `)
  const errors = coffeelint.lint(code, config)

  t.is(errors.length, 0)
})
