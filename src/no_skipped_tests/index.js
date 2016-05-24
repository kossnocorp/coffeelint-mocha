const {isSkippedCall} = require('../_lib/utils')

module.exports = NoSkippedTests

function NoSkippedTests () {}

NoSkippedTests.prototype.rule = {
  name: 'no_skipped_tests',
  level: 'error',
  message: 'Unexpected skipped Mocha test',
  description: `
    Mocha has a feature that allows you to skip tests by appending .skip
    to a test-suite or a test-case, or by prepending it with an x
    (e.g., xdescribe(...) instead of describe(...)). Sometimes tests
    are skipped as part of a debugging process, and aren't intended
    to be committed. This rule reminds you to remove .skip
    or the x prefix from your tests.
  `.trim()
}

NoSkippedTests.prototype.lintAST = function (ast, astApi) {
  ast.traverseChildren(false, node => {
    if (isSkippedCall(node)) {
      this.errors.push(astApi.createError({
        lineNumber: node.locationData['first_line'] + 1
      }))
    }
  })
}
