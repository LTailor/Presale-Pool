module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "5777",
      gas:4700000000,
      gasPrice: 10000000000,
    },
    test: {
      host: "localhost",
      port: 7545,
      network_id: "*",
      gasPrice: 100,
      gas: 470000000,
      gasPrice: 10000000000,
    }
  }
};
