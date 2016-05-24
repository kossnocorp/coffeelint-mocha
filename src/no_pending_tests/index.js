const {isPendingTest} = require('../_lib/utils')

module.exports = NoPendingTests

function NoPendingTests () {}

NoPendingTests.prototype.rule = {
  name: 'no_pending_tests',
  level: 'error',
  message: 'Unexpected pending Mocha test',
  description: `
    Mocha allows specification of pending tests, which represent tests that
    aren't yet implemented, but are intended to be implemented eventually.
    These are designated like a normal mocha test, but with only
    the first argument provided (no callback for the actual implementation).
    For example: it('unimplemented test').
  `.trim()
}

NoPendingTests.prototype.lintAST = function (ast, astApi) {
  ast.traverseChildren(false, node => {
    if (isPendingTest(node)) {
      this.errors.push(astApi.createError({
        lineNumber: node.locationData['first_line'] + 1
      }))
    }
  })
}
