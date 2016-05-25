module.exports = {
  isAsyncTest,
  isSyncTest,
  isTestHasBody,
  isTestCall,
  isAsyncHook,
  isSyncHook,
  isHookHasBody,
  isHookCall,
  isSkippedCall,
  isExclusiveCall,
  isPendingTest,
  isCall,
  isScopeCall,
  isAsyncCallbackCall,
  isCallWithAsyncCallbackInArgs,
  isFunction,
  getAsyncCallbackName,
  getMochaMethodBody,
  textify
}

function isAsyncTest (node) {
  return isTestCall(node) && isTestHasBody(node) && !!node.args[1].params[0]
}

function isSyncTest (node) {
  return isTestCall(node) && isTestHasBody(node) && !node.args[1].params[0]
}

function isTestHasBody (node) {
  return isFunction(node.args[1])
}

function isTestCall (node) {
  return isCall(node) &&
    includesExactCall(node, [
      'it', 'it.only', 'it.skip',
      'test', 'test.only', 'test.skip',
      'specify', 'specify.only', 'specify.skip'
    ])
}

function isAsyncHook (node) {
  return isHookCall(node) && isHookHasBody(node) && !!node.args[0].params[0]
}

function isSyncHook (node) {
  return isHookCall(node) && isHookHasBody(node) && !node.args[0].params[0]
}

function isHookHasBody (node) {
  return isFunction(node.args[0])
}

function isHookCall (node) {
  return isCall(node) &&
    includesExactCall(node, ['before', 'after', 'beforeEach', 'afterEach', 'suiteSetup', 'suiteTeardown', 'setup', 'teardown'])
}

function isSkippedCall (node) {
  return isCall(node) &&
    includesExactCall(node, [
      'xit', 'it.skip', 'xit.skip',
      'xspecify', 'specify.skip', 'xspecify.skip',
      'xtest', 'test.skip', 'xtest.skip',
      'xdescribe', 'describe.skip', 'xdescribe.skip',
      'xcontext', 'context.skip', 'xcontext.skip',
      'xsuite', 'suite.skip', 'xsuite.skip'
    ])
}

function isExclusiveCall (node) {
  return isCall(node) &&
    includesExactCall(node, [
      'it.only', 'xit.only',
      'specify.only', 'xspecify.only',
      'test.only', 'xtest.only',
      'describe.only', 'xdescribe.only',
      'context.only', 'xcontext.only',
      'suite.only', 'xsuite.only',
    ])
}

function isPendingTest (node) {
  return isTestCall(node) && !isTestHasBody(node)
}

function isCall (node) {
  return node.constructor.name === 'Call'
}

function includesExactCall (node, callStrs) {
  return callStrs.map(callStr => isExactCall(node, callStr)).includes(true)
}

function isExactCall (node, callStr) {
  const chain = callStr.split('.')
  const matchesHead = chain[0] === node.variable.base.value
  const matchesLength = node.variable.properties.length === chain.length - 1
  const matchesChain = node.variable.properties.map(p => p.name.value).join('.') === chain.slice(1).join('.')

  return matchesHead && matchesLength && matchesChain
}

function isScopeCall (node) {
  return isCall(node) &&
    includesExactCall(node, [
      'describe', 'describe.skip', 'xdescribe.skip', 'describe.only', 'xdescribe.only',
      'xcontext', 'context.skip', 'xcontext.skip', 'context.only', 'xcontext.only',
      'xsuite', 'suite.skip', 'xsuite.skip', 'suite.only', 'xsuite.only'
    ])
}

function isAsyncCallbackCall (node, asyncCallbackName) {
  return isCall(node) && isExactCall(node, asyncCallbackName)
}

function isCallWithAsyncCallbackInArgs (node, asyncCallbackName) {
  return isCall(node) && node.args.find(a => a.base.value === asyncCallbackName)
}

function isFunction (node) {
  return node && node.constructor.name === 'Code'
}

function getAsyncCallbackName (node) {
  return getMochaMethodBody(node).params[0].name.value
}

function getMochaMethodBody (node) {
  if (isTestCall(node)) {
    return node.args[1]
  } else if (isHookCall(node)) {
    return node.args[0]
  }
}

function textify (str) {
  const dirtyLines = str.split('\n')
  const lines = dirtyLines.slice(1, dirtyLines.length - 1)
  const baseIndent = lines[0].search(/[^\s]/)
  return lines.map(line => line.slice(baseIndent)).join('\n')
}
