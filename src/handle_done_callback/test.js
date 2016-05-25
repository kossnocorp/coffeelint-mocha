const coffeelint = require('coffeelint')
const test = require('ava')
const {textify} = require('../_lib/utils')

const config = {
  'handle_done_callback': {
    'module': __dirname
  }
}

test('disallows unhandled done callbacks in tests', t => {
  const methods = ['it', 'it.only', 'specify', 'specify.only', 'test', 'test.only']

  t.plan(methods.length * 3)
  methods.forEach(method => {
    const code = textify(`
      ${method} 'description', (done) ->
    `)
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 1)
    t.is(errors[0].lineNumber, 1)
    t.is(errors[0].message, 'Expected done callback to be handled')
  })
})

test('disallows unhandled done callbacks in hooks', t => {
  const methods = ['before', 'after', 'beforeEach', 'afterEach', 'suiteSetup', 'suiteTeardown', 'setup', 'teardown']

  t.plan(methods.length * 3)
  methods.forEach(method => {
    const code = textify(`
      ${method} (done) ->
    `)
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 1)
    t.is(errors[0].lineNumber, 1)
    t.is(errors[0].message, 'Expected done callback to be handled')
  })
})

test('allows synchronous tests', t => {
  const methods = ['it', 'specify', 'test']

  t.plan(methods.length)
  methods.forEach(method => {
    const code = textify(`
      ${method} 'description', ->
    `)
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 0)
  })
})

test('allows asynchronous tests with called done callback', t => {
  const methods = ['it', 'it.only', 'specify', 'specify.only', 'test', 'test.only']

  t.plan(methods.length)
  methods.forEach(method => {
    const code = textify(`
      ${method} 'description', (done) ->
        done()
    `)
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 0)
  })
})

test('allows asynchronous hooks with called done callback', t => {
  const methods = ['before', 'after', 'beforeEach', 'afterEach', 'setup', 'teardown']

  t.plan(methods.length)
  methods.forEach(method => {
    const code = textify(`
      ${method} (d) ->
        d()
    `)
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 0)
  })
})

test('allows asynchronous tests with done callback passed as an argument', t => {
  const methods = ['it', 'it.only', 'specify', 'specify.only', 'test', 'test.only']

  t.plan(methods.length)
  methods.forEach(method => {
    const code = textify(`
      ${method} 'description', (done) ->
        call(done)
    `)
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 0)
  })
})

test('allows asynchronous hooks with done callback passed as an argument', t => {
  const methods = ['before', 'after', 'beforeEach', 'afterEach', 'suiteSetup', 'suiteTeardown', 'setup', 'teardown']

  t.plan(methods.length)
  methods.forEach(method => {
    const code = textify(`
      ${method} (done) ->
        call(done)
    `)
    const errors = coffeelint.lint(code, config)

    t.is(errors.length, 0)
  })
})
