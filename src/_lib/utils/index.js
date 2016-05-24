module.exports = {
  isAsyncTest,
  isSyncTest,
  isTestHasBody,
  isTestCall,
  isSyncHook,
  isHookHasBody,
  isHookCall,
  isSkippedCall,
  isPendingTest,
  isCall,
  isFunction
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
    includesExactCall(node, ['it', 'it.only', 'specify', 'specify.only', 'test', 'test.only'])
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

function isFunction (node) {
  return node && node.constructor.name === 'Code'
}
