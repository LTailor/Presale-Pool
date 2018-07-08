module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*",
      gasPrice: 1,
      gas: 4612388,
      from: "0xaa81Edab0eCB7753ea436a3A02Ba334D2d4EBb3F"
    },
    test: {
      host: "localhost",
      port: 7545,
      network_id: "*",
      gasPrice: 100,
      gas: 4612388
    }
  }
};
