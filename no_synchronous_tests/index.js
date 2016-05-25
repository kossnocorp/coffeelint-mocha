const {textify, isSyncTest, isSyncHook} = require('../_lib/utils')

module.exports = NoSynchronousTests

function NoSynchronousTests () {}

NoSynchronousTests.prototype.rule = {
  name: 'no_synchronous_tests',
  level: 'error',
  message: 'Unexpected synchronous test',
  description: textify(`
    Mocha automatically determines whether a test is synchronous or
    asynchronous based on the arity of the function passed into it.
    When writing tests for a asynchronous function, omitting the done callback
    or forgetting to return a promise can often lead to false-positive
    test cases. This rule warns against the implicit synchronous feature,
    and should be combined with handle-done-callback for best results.
  `)
}

NoSynchronousTests.prototype.lintAST = function (ast, astApi) {
  ast.traverseChildren(true, node => {
    if (isSyncTest(node) || isSyncHook(node)) {
      this.errors.push(astApi.createError({
        lineNumber: node.locationData['first_line'] + 1
      }))
    }
  })
}
