import { observable } from "mobx";
import PoolSettingsStore from './PoolSettingsStore'
import WalletStore from './WalletStore';
import GasPriceStore from './GasPriceStore';



class Store {
  @observable web3Settings = {};
  constructor() {
    this.walletStore = new WalletStore()
    this.poolSettingsStore = new PoolSettingsStore()
    this.gasPriceStore = new GasPriceStore();
  }

  setWeb3Settings(settings) {
    this.web3Settings = settings;
  }
}

export default new Store();
