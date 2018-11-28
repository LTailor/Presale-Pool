import PoolSettingsStore from './PoolSettingsStore'
import WalletStore from './WalletStore';

class Store {
  constructor() {
    this.walletStore = new WalletStore()
    this.poolSettingsStore = new PoolSettingsStore()
  }

  setWeb3(web3) {
    this.web3 = web3;
  }
}

export default new Store();
