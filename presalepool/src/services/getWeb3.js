let getWeb3 = () => {
  return new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function () {
      var results
      var web3 = window.web3

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        web3 = new window.Web3(web3.currentProvider)
        web3.version.getNetwork((err, netId) => {
          var defaultAccount = web3.eth.defaultAccount || null;
          results = {
            web3Instance: web3,
            netId,
            injectedWeb3: true,
            defaultAccount
          }
          resolve(results)
        })

        console.log('Injected web3 detected.');

      } else {
        // Fallback to localhost if no web3 injection.
        const errorMsg = `Metamask is not installed. Please go to
        <a target="_blank" href="https://metamask.io">Metamask website</a> and return to this page after you installed it`
        reject({message: errorMsg})
        console.log('No web3 instance injected, using Local web3.');
        console.error('Metamask not found');
      }
    })
  })
}

export default getWeb3
