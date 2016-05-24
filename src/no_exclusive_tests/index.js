const {isExclusiveCall} = require('../_lib/utils')

module.exports = NoExclusiveTests

function NoExclusiveTests () {}

NoExclusiveTests.prototype.rule = {
  name: 'no_exclusive_tests',
  level: 'error',
  message: 'Unexpected exclusive Mocha test',
  description: `
    Mocha has a feature that allows you to run tests exclusively by appending
    .only to a test-suite or a test-case. This feature is really helpful
    to debug a failing test, so you don’t have to execute all of your tests.
    After you have fixed your test and before committing the changes you
    have to remove .only to ensure all tests are executed on your build system.
    This rule reminds you to remove .only from your tests by raising a warning
    whenever you are using the exclusivity feature.
  `.trim()
}

NoExclusiveTests.prototype.lintAST = function (ast, astApi) {
  ast.traverseChildren(false, node => {
    if (isExclusiveCall(node)) {
      this.errors.push(astApi.createError({
        lineNumber: node.locationData['first_line'] + 1
      }))
    }
  })
}
