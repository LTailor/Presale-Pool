import { action, observable } from "mobx"
class PoolSettingsStore {
  @observable presalePoolAddress = ''
  @observable maxAllocation = 0
  @observable maxContribution = 0
  @observable minContribtuion = 0
  @observable feePercentage = 0
  constructor() {

  }

  setSettings(maxAllocation, maxContribution, minContribution, fee)
  {
    this.maxAllocation = maxAllocation;
    this.maxContribution = maxContribution;
    this.minContribution = minContribution;
    this.feePercentage = fee
  }

  setAdmins(admins)
  {
    this.admins = admins.filter( a => typeof(a) != 'undefined' && a!='');
  }

  setWhitelist(addresses)
  {
    this.whitelist = addresses
  }
}

export default PoolSettingsStore;
