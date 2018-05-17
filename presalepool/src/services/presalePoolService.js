import proxyAbi from "../abis/PresalePoolProxy.json"
import presalePoolAbi from "../abis/PresalePool.json"
import Web3 from 'web3'
import getWeb3 from './getWeb3';
const abi = require('web3-eth-abi');

class PresalePoolService {

  presalePoolProxyAddress = "0x2125ecf1f163d52f472adc107ba1cc27ba109f5f";
  constructor() {
    this.getWeb3Promise = getWeb3().then(async (web3Config) => {
      const {web3Instance, defaultAccount, trustApiName} = web3Config;
      this.defaultAccount = defaultAccount;
      this.web3 = new Web3(web3Instance.currentProvider);
    });
  }

  init(walletSettings, poolSettings)
  {
    this.walletSettings = walletSettings
    this.poolSettings = poolSettings
    this.poolProxy = new this.web3.eth.Contract(proxyAbi, this.presalePoolProxyAddress)
    this.poolProxy.methods.init(poolSettings.admins, walletSettings.walletAddress)
    .send({
      from: this.defaultAccount,
      gasPrice: 1000,
      gas: 4600000
    })
    .on('transactionHash', (hash) => {
      console.log(hash);
      this.poolProxy.methods.getPresalePoolAddress(this.defaultAccount).call({from:this.defaultAccount})
      .then((address)=>{
        this.presalePoolAddress = address;
        this.presalePool = new this.web3.eth.Contract(presalePoolAbi, this.presalePoolAddress);
        this.presalePool.methods.setPresaleSettings(0, 0, this.poolSettings.minContribution, this.poolSettings.maxContribution)
        .send({
          from: this.defaultAccount,
          gasPrice: 1000,
          gas: 4600000
        }
        )
        .on('transactionHash', (hash) => {
          console.log(hash);
        })
      });
    })
    .on('error', (error) => {
      console.log(error);
    });
  }
}

export default new PresalePoolService;
