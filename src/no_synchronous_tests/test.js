const coffeelint = require('coffeelint')
const test = require('ava')

const config = {
  'no_synchronous_tests': {
    'module': __dirname
  }
}

test('disallows to use synchronous tests', t => {
  const methods = ['it', 'it.only', 'specify', 'specify.only', 'test', 'test.only']

  t.plan(methods.length * 3)
  methods.forEach(method => {
    const code = `
      ${method} 'has synchronous tests', ->
    `.trim()
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 1)
    t.is(errors[0].lineNumber, 1)
    t.is(errors[0].message, 'Unexpected synchronous test')
  })
})

test('allows to use asynchronous tests', t => {
  const methods = ['it', 'it.only', 'specify', 'specify.only', 'test', 'test.only']

  t.plan(methods.length)
  methods.forEach(method => {
    const code = `
      ${method} 'has asynchronous tests', (done) ->
    `.trim()
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 0)
  })
})

test('disallows to use synchronous hooks', t => {
  const methods = ['before', 'after', 'beforeEach', 'afterEach', 'suiteSetup', 'suiteTeardown', 'setup', 'teardown']

  t.plan(methods.length * 3)
  methods.forEach(method => {
    const code = `
      ${method} ->
    `.trim()
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 1)
    t.is(errors[0].lineNumber, 1)
    t.is(errors[0].message, 'Unexpected synchronous test')
  })
})

test('allows to use asynchronous hooks', t => {
  const methods = ['before', 'after', 'beforeEach', 'afterEach', 'suiteSetup', 'suiteTeardown', 'setup', 'teardown']

  t.plan(methods.length)
  methods.forEach(method => {
    const code = `
      ${method} (done) ->
    `.trim()
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 0)
  })
})

test('ignores unknown constructions', t => {
  const code = `
    it.trololo 'unknown construction', ->
  `.trim()
  const errors = coffeelint.lint(code, config)

  t.is(errors.length, 0)
})
