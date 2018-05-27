var proxy = artifacts.require("../contracts/TestToken.sol");
module.exports = function(deployer) {
  deployer.deploy(proxy);
};
