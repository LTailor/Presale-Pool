import proxyAbi from "../abis/PresalePoolProxy.json"
import presalePoolAbi from "../abis/PresalePool.json"
import Web3 from 'web3'
import Web3Utils from 'web3-utils'
import getWeb3 from './getWeb3';
const abi = require('web3-eth-abi');

class PresalePoolService {

  presalePoolProxyAddress = "0xc9ed4e85678aed26162d8b8876fec077a94596e7";
  constructor() {
    this.getWeb3Promise = getWeb3().then(async (web3Config) => {
      const {web3Instance, defaultAccount} = web3Config;
      this.defaultAccount = defaultAccount;
      this.web3 = new Web3(web3Instance.currentProvider);
    });
  }

  createPool(walletSettings, poolSettings)
  { 
    this.walletSettings = walletSettings
    this.walletAddress = walletSettings.walletAddress
    this.poolSettings = poolSettings
    this.poolProxy = new this.web3.eth.Contract(proxyAbi, this.presalePoolProxyAddress)
    this.poolProxy.methods.init(poolSettings.admins, walletSettings.walletAddress)
    .send({
      from: walletSettings.walletAddress,
      gasPrice: 1000,
      gas: 4600000
    })
    .on('transactionHash', (hash) => {
      console.log(hash); }).then(()=>{
      this.poolProxy.methods.getPresalePoolAddress(walletSettings.walletAddress).call({from:walletSettings.walletAddress})
      .then((address)=>{
        console.log(address)
        this.poolSettings.presalePoolAddress = address
        this.presalePoolAddress = address
        this.presalePool = new this.web3.eth.Contract(presalePoolAbi, this.poolSettings.presalePoolAddress)
        this.save()
      });
    })
  }

  init(poolSettings)
  {
    this.getWeb3Promise = getWeb3().then(async (web3Config) => {

      const {web3Instance, defaultAccount} = web3Config
      this.walletAddress = defaultAccount
      this.web3 = new Web3(web3Instance.currentProvider)
      this.poolSettings = poolSettings
      this.presalePool = new this.web3.eth.Contract(presalePoolAbi, this.poolSettings.presalePoolAddress)
      const settings = await this.presalePool.methods.getPresaleSettings()
      .call({
        from: this.defaultAccount
      })
      this.poolSettings.minContribution = settings[0]
      this.poolSettings.maxContribution = settings[1]
      this.poolSettings.maxAllocation = settings[2]

      const poolFee = await this.presalePool.methods.getPoolFeePerEther()
      .call({
        from: this.defaultAccount
      })

      this.poolSettings.whitelistAddresses = await this.presalePool.methods.getWhitelist()
      .call({
        from: this.defaultAccount
      })

       this.poolSettings.admins = await this.presalePool.methods.getAdmins()
      .call({
        from: this.defaultAccount
      })

      this.poolSettings.status = await this.presalePool.methods.getCurrentState()
      .call({
       from: this.defaultAccount
      })

      const tokenRateValues = await this.presalePool.methods.getTokenRate()
      .call({
       from: this.defaultAccount
      })

      this.poolSettings.tokenPrice = tokenRateValues[0]

      this.poolSettings.feePercentage = new Web3Utils.BN(poolFee).mul(new Web3Utils.BN(100)).div(Web3Utils.toWei(new Web3Utils.BN(1),'ether')).toString()
    })

    return this.getWeb3Promise
  }

  async closePresale()
  {
    await this.presalePool.methods.close()
    .send({
      from: this.defaultAccount,
      gasPrice: 1000,
      gas: 4600000
    }
    ).on('transactionHash', (hash) => {
          this.poolSettings.status = 1
    })
  }

  async setTransferedState()
  {
    await this.presalePool.methods.setTransferedState()
    .send({
      from: this.defaultAccount,
      gasPrice: 1000,
      gas: 4600000
    }
    ).on('transactionHash', (hash) => {
          this.poolSettings.status = 3
    })
  }

  async sendContribution(address, data)
  {
    await this.presalePool.methods.sendContribution(address, 50000, data)
    .send({
      from: this.defaultAccount,
      gasPrice: 1000,
      gas: 4600000
    }
    ).on('transactionHash', (hash) => {
          this.poolSettings.status = 2
    })
  }

  async save()
  {
    if(typeof(this.poolSettings) == 'undefined')
    {
      return
    }

    const minContributionEther = Web3Utils.toWei(new Web3Utils.BN(1),'ether')
    .mul(new Web3Utils.BN(this.poolSettings.minContribution));
    const maxContributionEther = Web3Utils.toWei(new Web3Utils.BN(1),'ether')
    .mul(new Web3Utils.BN(this.poolSettings.maxContribution));
    const maxAllocationEther = Web3Utils.toWei(new Web3Utils.BN(1),'ether')
    .mul(new Web3Utils.BN(this.poolSettings.maxAllocation));

    this.presalePool.methods.setPresaleSettings(0, 0, minContributionEther, maxContributionEther, maxAllocationEther)
    .send({
      from: this.walletAddress,
      gasPrice: 1000,
      gas: 4600000
    }
    )
    .on('transactionHash', (hash) => {
      console.log(hash);
    })

    const feePerEther = Web3Utils.toWei(new Web3Utils.BN(1),'ether')
    .mul(new Web3Utils.BN(this.poolSettings.feePercentage))
    .div(new Web3Utils.BN(100))

    this.presalePool.methods.setPoolFeePerEther(feePerEther)
    .send({
      from: this.walletAddress,
      gasPrice: 1000,
      gas: 4600000
    }
    )
    .on('transactionHash', (hash) => {
      console.log(hash);
    })

    this.presalePool.methods.addAddressesToWhitelist(this.poolSettings.whitelist)
    .send({
      from: this.walletAddress,
      gasPrice: 1000,
      gas: 4600000
    }
    )
    .on('transactionHash', (hash) => {
      console.log(hash);
    })

    const tokenPriceEther = Web3Utils.toWei(new Web3Utils.BN(1),'ether')
    .mul(new Web3Utils.BN(this.poolSettings.tokenPrice));

    this.presalePool.methods.setTokenRate(tokenPriceEther, new Web3Utils.BN(18))
    .send({
      from: this.walletAddress,
      gasPrice: 1000,
      gas: 4600000
    }
    )
    .on('transactionHash', (hash) => {
      console.log(hash);
    })
    .on('error', (error) => {
      throw error
    })
  }
}

export default new PresalePoolService;
