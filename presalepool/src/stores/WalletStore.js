import Web3Utils from 'web3-utils';
import { observable } from "mobx";

class WalletStore {
  @observable address = '';

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
