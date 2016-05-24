const coffeelint = require('coffeelint')
const test = require('ava')

const config = {
  'no_skipped_tests': {
    'module': __dirname
  }
}

test('disallows to skip tests', t => {
  const methods = [
    'xit', 'it.skip', 'xit.skip',
    'xspecify', 'specify.skip', 'xspecify.skip',
    'xtest', 'test.skip', 'xtest.skip',
    'xdescribe', 'describe.skip', 'xdescribe.skip',
    'xcontext', 'context.skip', 'xcontext.skip',
    'xsuite', 'suite.skip', 'xsuite.skip'
  ]

  t.plan(methods.length * 3)
  methods.forEach(method => {
    const code = `
      ${method} 'skipped', ->
    `.trim()
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 1)
    t.is(errors[0].lineNumber, 1)
    t.is(errors[0].message, 'Unexpected skipped Mocha test')
  })
})

test('ignores unknown constructions', t => {
  const code = `
    xit.trololo 'unknown construction', ->
  `.trim()
  const errors = coffeelint.lint(code, config)

  t.is(errors.length, 0)
})
