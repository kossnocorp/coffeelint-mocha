# coffeelint-mocha
[![Build Status](https://travis-ci.org/kossnocorp/coffeelint-mocha.svg?branch=master)](https://travis-ci.org/kossnocorp/coffeelint-mocha) [![Coverage Status](https://coveralls.io/repos/github/kossnocorp/coffeelint-mocha/badge.svg?branch=master)](https://coveralls.io/github/kossnocorp/coffeelint-mocha?branch=master)

[CoffeeLint](http://www.coffeelint.org/) rules for
[Mocha test framework](http://mochajs.org/).

It a port of [eslint-plugin-mocha](https://github.com/lo1tuma/eslint-plugin-mocha)
to CoffeeLint.

## Installation

To install [the package](https://www.npmjs.com/package/coffeelint-mocha), run:

```bash
npm install coffeelint-mocha --save-dev
```

## Example

Add rules to your `coffeelint.json`:

```json
{
  "handle_done_callback": {
    "module": "coffeelint-mocha/handle_done_callback",
    "level": "error"
  },
  "no_exclusive_tests": {
    "module": "coffeelint-mocha/no_exclusive_tests",
    "level": "error"
  },
  "no_global_tests": {
    "module": "coffeelint-mocha/no_global_tests",
    "level": "error"
  },
  "no_pending_tests": {
    "module": "coffeelint-mocha/no_pending_tests",
    "level": "error"
  },
  "no_skipped_tests": {
    "module": "coffeelint-mocha/no_skipped_tests",
    "level": "error"
  },
  "no_synchronous_tests": {
    "module": "coffeelint-mocha/no_synchronous_tests",
    "level": "error"
  }
}
```

## Rules

### `handle_done_callback`

Mocha allows you to write asynchronous tests by adding a `done` callback
to the parameters of your test function. It is easy to forget calling this
callback after the asynchronous operation is done.

Example:

```js
// Bad
it('returns a user', function (done) {
  getUser(42)
    .then(function (user) {
      assert.deepEqual(user, {id: 42, name: 'Sasha'})
      // done callback wasn't called
    })
})

// Good
it('returns a user', function (done) {
  getUser(42)
    .then(function (user) {
      assert.deepEqual(user, {id: 42, name: 'Sasha'})
      done() // Ok
    })
})

// Good
it('returns a user', function (done) {
  getUser(42)
    .then(function (user) {
      assert.deepEqual(user, {id: 42, name: 'Sasha'})
    })
    .then(done) // Ok
})
```

To start using the rule, add `handle_done_callback` to your `coffeelint.json`:

```json
{
  "handle_done_callback": {
    "module": "coffeelint-mocha/handle_done_callback",
    "level": "error"
  }
}
```

### `no_exclusive_tests`

Mocha has a feature that allows you to run tests exclusively by
appending `.only` to a test-suite or a test-case. This feature is really
helpful to debug a failing test, so you don’t have to execute all of your tests.
After you have fixed your test and before committing the changes you have to
remove `.only` to ensure all tests are executed on your build system.

This rule reminds you to remove `.only` from your tests by raising
an error whenever you are using the exclusivity feature.

Example:

```js
// Bad
it.only('multiples numbers', function () {
  assert.equal(multiply(21, 2), 42)
})

// Good
it('multiples numbers', function () {
  assert.equal(multiply(21, 2), 42)
})
```

To start using the rule, add `no_exclusive_tests` to your `coffeelint.json`:

```json
{
  "no_exclusive_tests": {
    "module": "coffeelint-mocha/no_exclusive_tests",
    "level": "error"
  }
}
```

### `no_global_tests`

Mocha gives you the possibility to structure your tests inside of suites
using `describe`, `suite` or `context`.

Example:

```js
// Bad
it('multiples numbers', function () {
  assert.equal(multiply(21, 2), 42)
})

// Good
describe('multiply', function () {
  it('multiples numbers', function () {
    assert.equal(multiply(21, 2), 42)
  })
})
```

To start using the rule, add `no_global_tests` to your `coffeelint.json`:

```json
{
  "no_global_tests": {
    "module": "coffeelint-mocha/no_global_tests",
    "level": "error"
  }
}
```

### `no_pending_tests`

Mocha allows specification of pending tests, which represent tests
that aren't yet implemented, but are intended to be implemented eventually.
These are designated like a normal mocha test, but with only
the first argument provided (no callback for the actual implementation).
For example: `it('unimplemented test')`

This rule allows you to raise errors on pending tests. This can be useful,
for example, for reminding developers that pending tests exist
in the repository, so they're more likely to get implemented.

Example:

```js
// Bad
it('multiples numbers')

// Good
it('multiples numbers', function () {
  assert.equal(multiply(21, 2), 42)
})
```

To start using the rule, add `no_pending_tests` to your `coffeelint.json`:

```json
{
  "no_pending_tests": {
    "module": "coffeelint-mocha/no_pending_tests",
    "level": "error"
  }
}
```

### `no_skipped_tests`

Mocha has a feature that allows you to skip tests by appending `.skip`
to a test-suite or a test-case, or by prepending it with an `x`
(e.g., `xdescribe(...)` instead of `describe(...)`). Sometimes tests are skipped
as part of a debugging process, and aren't intended to be committed.
This rule reminds you to remove `.skip` or the `x` prefix from your tests.

Example:

```js
// Bad
xit('multiples numbers', function () {
  assert.equal(multiply(21, 2), 42)
})

// Bad
it.skip('multiples numbers', function () {
  assert.equal(multiply(21, 2), 42)
})

// Good
it('multiples numbers', function () {
  assert.equal(multiply(21, 2), 42)
})
```

To start using the rule, add `no_skipped_tests` to your `coffeelint.json`:

```json
{
  "no_skipped_tests": {
    "module": "coffeelint-mocha/no_skipped_tests",
    "level": "error"
  }
}
```

### `no_synchronous_tests`

Mocha automatically determines whether a test is synchronous or asynchronous
based on the arity of the function passed into it. When writing tests for
a asynchronous function, omitting the `done` callback or forgetting to return
a promise can often lead to false-positive test cases. This rule warns against
the implicit synchronous feature, and should be combined with
`handle_done_callback` for best results.

Example:

```js
// Bad
it('multiples numbers', function () {
  assert.equal(multiply(21, 2), 42)
})

// Good
it('multiples numbers', function (done) {
  assert.equal(multiply(21, 2), 42)
  done()
})
```

To start using the rule, add `no_synchronous_tests` to your `coffeelint.json`:

```json
{
  "no_synchronous_tests": {
    "module": "coffeelint-mocha/no_synchronous_tests",
    "level": "error"
  }
}
```

## License

[MIT © Sasha Koss](https://kossnocorp.mit-license.org/)
