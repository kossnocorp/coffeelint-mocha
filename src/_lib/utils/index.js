module.exports = {
  isAsyncTest,
  isSyncTest,
  isTestHasBody,
  isTestCall,
  isSyncHook,
  isHookHasBody,
  isHookCall,
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
    ['it', 'specify', 'test'].includes(node.variable.base.value) &&
    (node.variable.properties.length === 0 ||
     node.variable.properties.length === 1 && node.variable.properties[0].name.value === 'only')
}

function isSyncHook (node) {
  return isHookCall(node) && isHookHasBody(node) && !node.args[0].params[0]
}

function isHookHasBody (node) {
  return isFunction(node.args[0])
}

function isHookCall (node) {
  return isCall(node) &&
    ['before', 'after', 'beforeEach', 'afterEach', 'suiteSetup', 'suiteTeardown', 'setup', 'teardown']
      .includes(node.variable.base.value) &&
    node.variable.properties.length === 0
}

function isCall (node) {
  return node.constructor.name === 'Call'
}

function isFunction (node) {
  return node.constructor.name === 'Code'
}
