const coffeelint = require('coffeelint')
const test = require('ava')
const {codify} = require('../_lib/utils')

const config = {
  'no_exclusive_tests': {
    'module': __dirname
  }
}

test('disallows exclusive tests and suites', t => {
  const methods = [
    'it.only', 'xit.only',
    'specify.only', 'xspecify.only',
    'test.only', 'xtest.only',
    'describe.only', 'xdescribe.only',
    'context.only', 'xcontext.only',
    'suite.only', 'xsuite.only',
  ]

  t.plan(methods.length * 3)
  methods.forEach(method => {
    const code = codify(`
      ${method} 'description', ->
    `)
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 1)
    t.is(errors[0].lineNumber, 1)
    t.is(errors[0].message, 'Unexpected exclusive Mocha test')
  })
})

test('allows regular tests', t => {
  const methods = ['it', 'specify', 'test']

  t.plan(methods.length)
  methods.forEach(method => {
    const code = codify(`
      ${method} 'description', ->
    `)
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 0)
  })
})
