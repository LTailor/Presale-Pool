import PoolSettingsStore from './PoolSettingsStore'
import WalletStore from './WalletStore';

class Store {
  constructor() {
    this.walletStore = new WalletStore()
    this.poolSettingsStore = new PoolSettingsStore()
  }
}

export default new Store();
