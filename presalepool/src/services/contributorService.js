import presalePoolAbi from "../abis/PresalePool.json"
import Web3 from 'web3'
import getWeb3 from './getWeb3';
import { observer } from "mobx-react";
import { observable } from "mobx";

const abi = require('web3-eth-abi');

class ContributorService {

  @observable contributorAddress = ''
  @observable maxPerContributor = 0
  @observable minPerContributor = 0
  @observable contribution = 0
  @observable contributionInEther = 0

  constructor() {

  }

  init(smartContractAddress)
  {
    this.getWeb3Promise = getWeb3().then(async (web3Config) => {

      const {web3Instance, defaultAccount, trustApiName} = web3Config
      this.contributorAddress = defaultAccount
      this.web3 = new Web3(web3Instance.currentProvider)
      this.presalePool = new this.web3.eth.Contract(presalePoolAbi, smartContractAddress)
      const settings = await this.presalePool.methods.getPresaleSettings()
      .call({
        from: this.contributorAddress
      })
      this.maxPerContributor = settings[0]
      this.minPerContributor = settings[1]
      this.maxAllocation = settings[2]

      const mySum = await this.presalePool.methods.getContributedSum()
      .call({
        from: this.contributorAddress
      })

      this.contribution = mySum
      this.contributionInEther = this.web3.utils.fromWei(mySum, 'ether');
    })
  }

  contribute()
  {
    this.presalePool.methods.contribute()
    .send({
      from: this.contributorAddress,
      gasPrice: 1000,
      gas: 4600000
    })
  }

  withdrawContribution()
  {
    this.presalePool.methods.withdrawContribution()
    .send({
      from: this.contributorAddress,
      gasPrice: 1000,
      gas: 4600000
    })
  }
}

export default new ContributorService;
