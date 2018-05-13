import Web3Utils from 'web3-utils';

class WalletStore {
  constructor() {

  }

  checkAddress(str)
  {
    return Web3Utils.isAddress(str);
  }
}

export default new WalletStore();
