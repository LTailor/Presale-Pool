
import Web3Utils from 'web3-utils';

class GasPriceStore {
  getGasPrice() {
    if (this.gasPrice) {
      return new Promise((resolve, reject) => {
        resolve(Web3Utils.toHex(this.gasPrice));
      });
    }
    return new Promise((resolve, reject) => {
      this.fetchPromise = fetch('https://ethgasstation.info/json/ethgasAPI.json').then((response) => {
        return response.json() 
      }).then((data) =>{
        const price = data.fast;
        const weiPrice = Web3Utils.toWei(price.toString(), 'gwei');
        console.log(weiPrice);
        this.gasPrice = weiPrice;
        resolve(Web3Utils.toHex(weiPrice));
      })
      .catch((e)=>{
        reject(e);
      })
    })
  }
}

export default GasPriceStore;