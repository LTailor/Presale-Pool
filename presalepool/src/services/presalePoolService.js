import proxyAbi from "../abis/PresalePoolProxy.json"
import Web3 from 'web3'
import getWeb3 from './getWeb3';
const abi = require('web3-eth-abi');

class PresalePoolService {

  presalePoolProxyAddress = "0x846b2d01ff79ae034d7ce4d639de32ca09933e37";
  constructor() {
    this.getWeb3Promise = getWeb3().then(async (web3Config) => {
      const {web3Instance, defaultAccount, trustApiName} = web3Config;
      this.defaultAccount = defaultAccount;
      this.web3 = new Web3(web3Instance.currentProvider);
    });
  }

  function getMethodCallData(methodName, parametersDescription, parameters )
  {
    return abi.encodeFunctionCall({
      name: methodName,
      type: 'function',
      inputs: parametersDescription
    }, parameters);
  }

  init(walletSettings, poolSettings)
  {
    this.walletSettings = walletSettings
    this.poolSettings = poolSettings
    this.poolProxy = new this.web3.eth.Contract(proxyAbi, this.presalePoolProxyAddress)
    var event = this.poolProxy.events.PresalePoolContractCreated({}, {}, function(error, event){ console.log(error); });

    this.poolProxy.methods.init(walletSettings.walletAddress, walletSettings.walletAddress)
    .send({
      from: this.defaultAccount,
      gasPrice: 1000,
      gas: 4600000
    })
    .on('transactionHash', (hash) => {
      console.log(hash);
    })
    .on('error', (error) => {
      console.log(error);
    });
  }

}

export default new PresalePoolService;
