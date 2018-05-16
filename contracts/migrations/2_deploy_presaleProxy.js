var proxy = artifacts.require("../contracts/PresalePoolProxy.sol");
module.exports = function(deployer) {
  deployer.deploy(proxy);
};
