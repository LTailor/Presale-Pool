import PoolSettingsStore from './PoolSettingsStore'
import WalletStore from './WalletStore';
import { action, observable } from "mobx";

class Store {
  @observable web3Settings = {};
  constructor() {
    this.walletStore = new WalletStore()
    this.poolSettingsStore = new PoolSettingsStore()
  }

  setWeb3Settings(settings) {
    this.web3Settings = settings;
  }
}

export default new Store();
