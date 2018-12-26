import presalePoolAbi from "../abis/PresalePool.json"
import Web3 from 'web3'
import getWeb3 from './getWeb3';
import Web3Utils from 'web3-utils'
import { observable } from "mobx";

class ContributorService {

  @observable contributorAddress = ''
  @observable maxPerContributor = 0
  @observable minPerContributor = 0
  @observable contribution = 0
  @observable maxAllocation = 0
  @observable poolFee = 0
  @observable poolValue
  @observable realValue
  @observable contributionInEther = 0

  init(smartContractAddress)
  {
    return this.getWeb3Promise = getWeb3().then(async (web3Config) => {

      const {web3Instance, defaultAccount} = web3Config
      this.contributorAddress = defaultAccount
      this.web3 = new Web3(web3Instance.currentProvider)
      this.presalePool = new this.web3.eth.Contract(presalePoolAbi, smartContractAddress)
      const settings = await this.presalePool.methods.getPresaleSettings()
      .call({
        from: this.contributorAddress
      })
      this.minPerContributor = settings[0]
      this.maxPerContributor = settings[1]
      this.maxAllocation = settings[2]

      const poolFee = await this.presalePool.methods.getPoolFeePerEther()
      .call({
        from: this.contributorAddress
      })
      this.poolFee = new Web3Utils.BN(poolFee).mul(new Web3Utils.BN(100)).div(Web3Utils.toWei(new Web3Utils.BN(1),'ether')).toString()

      this.contribution = await this.getContribution();

      this.poolValue = await this.presalePool.methods.getPoolValue()
      .call({
        from: this.contributorAddress
      });

      this.realValue = await this.presalePool.methods.getRealSum()
      .call({
        from: this.contributorAddress
      });
      this.contributionInEther = this.convertToEther(this.contribution);
    })
  }


  async getContribution() {
    const mySum = await this.presalePool.methods.getContributedSumAfterFees()
    .call({
      from: this.contributorAddress
    })

    return mySum;
  }

  convertToEther(contribution)
  {
    return this.web3.utils.fromWei(contribution.toString(), 'ether');
  }

  async contribute(etherValue)
  {
    await this.presalePool.methods.contribute()
    .send({
      from: this.contributorAddress,
      gasPrice: 1000,
      gas: 4600000,
      value: Web3Utils.toHex(etherValue)
    })
    this.contribution = await this.getContribution();
    this.contributionInEther = this.convertToEther(this.contribution);
  }

  withdrawContribution()
  {
    this.presalePool.methods.withdrawContribution()
    .send({
      from: this.contributorAddress,
      gasPrice: 1000,
      gas: 4600000
    })
    .on('error', error => console.log(error))
  }

  getTokens(address)
  {
    this.presalePool.methods.getTokens(address)
    .send({
      from: this.contributorAddress,
      gasPrice: 1000,
      gas: 4600000
    })
  }
}

export default new ContributorService();
