class PoolSettingsStore {
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
}

export default PoolSettingsStore;
