const {isScopeCall, isTestCall} = require('../_lib/utils')

module.exports = NoGlobalTests

function NoGlobalTests () {}

NoGlobalTests.prototype.rule = {
  name: 'no_global_tests',
  level: 'error',
  message: 'Unexpected global Mocha test',
  description: `
    Mocha gives you the possibility to structure your tests inside of suites
    using describe, suite or context. This rule checks each Mocha test
    function to not be located directly in the global scope.
  `.trim()
}

NoGlobalTests.prototype.lintAST = function (ast, astApi) {
  ast.traverseChildren(false, node => {
    if (isScopeCall(node)) {
      return false
    } else if (isTestCall(node)) {
      this.errors.push(astApi.createError({
        lineNumber: node.locationData['first_line'] + 1
      }))
    }
  })
}
