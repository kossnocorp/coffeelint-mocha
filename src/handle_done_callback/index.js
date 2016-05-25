const {
  textify, isAsyncTest, isAsyncHook, isAsyncCallbackCall,
  isCallWithAsyncCallbackInArgs, getAsyncCallbackName
} = require('../_lib/utils')

module.exports = HandleDoneCallback

function HandleDoneCallback () {}

HandleDoneCallback.prototype.rule = {
  name: 'handle_done_callback',
  level: 'error',
  message: 'Expected done callback to be handled',
  description: textify(`
    Mocha allows you to write asynchronous tests by adding a done callback to
    the parameters of your test function. It is easy to forget calling this
    callback after the asynchronous operation is done.
  `)
}

HandleDoneCallback.prototype.lintAST = function (ast, astApi) {
  ast.traverseChildren(false, node => {
    if (isAsyncTest(node) || isAsyncHook(node)) {
      const asyncCallbackName = getAsyncCallbackName(node)
      var doneHandled = false

      node.traverseChildren(true, innerNode => {
        if (isAsyncCallbackCall(innerNode, asyncCallbackName) ||
            isCallWithAsyncCallbackInArgs(innerNode, asyncCallbackName)) {
          doneHandled = true
          return false
        }
      })

      if (!doneHandled) {
        this.errors.push(astApi.createError({
          lineNumber: node.locationData['first_line'] + 1
        }))
      }

      return false
    }
  })
}
