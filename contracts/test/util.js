
const abi = require('web3-eth-abi');
function getMethodCallData(methodName, parametersDescription, parameters )
{
  return abi.encodeFunctionCall({
    name: methodName,
    type: 'function',
    inputs: parametersDescription
  }, parameters);
}

function testTokenPresaleData()
{
  return getMethodCallData('presale', [],[]);
}

module.exports = {
  testTokenPresaleData: testTokenPresaleData
}
