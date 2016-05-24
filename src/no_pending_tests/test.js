const coffeelint = require('coffeelint')
const test = require('ava')

const config = {
  'no_pending_tests': {
    'module': __dirname
  }
}

test('disallows pending tests', t => {
  const methods = ['it', 'specify', 'test']

  t.plan(methods.length * 3)
  methods.forEach(method => {
    const code = `
      ${method} 'pending'
    `.trim()
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 1)
    t.is(errors[0].lineNumber, 1)
    t.is(errors[0].message, 'Unexpected pending Mocha test')
  })
})

test('allows implemented tests', t => {
  const methods = ['it', 'specify', 'test']

  t.plan(methods.length)
  methods.forEach(method => {
    const code = `
      ${method} 'implemented', ->
    `.trim()
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 0)
  })
})

test('ignores unknown constructions', t => {
  const code = `
    it.trololo 'unknown construction'
  `.trim()
  const errors = coffeelint.lint(code, config)

  t.is(errors.length, 0)
})
