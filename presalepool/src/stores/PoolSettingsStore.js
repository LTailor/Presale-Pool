class PoolSettingsStore {
  constructor() {

  }

  setSettings(maxAllocation, maxContribution, minContribution)
  {
    this.maxAllocation = maxAllocation;
    this.maxContribution = maxContribution;
    this.minContribution = minContribution;
  }

  setAdmins(admins)
  {
    this.admins = admins.filter( a => typeof(a) != 'undefined' && a!='');
  }
}

export default PoolSettingsStore;
