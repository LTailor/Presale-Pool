import Web3Utils from 'web3-utils';
import { action, observable } from "mobx";

class WalletStore {
  @observable address = '';
  constructor() {
  }

  checkAddress(str)
  {
    return Web3Utils.isAddress(str);
  }

  setAddress(address)
  {
    this.walletAddress = address;
  }
}

export default WalletStore;
