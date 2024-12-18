module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },

  mocha: {
  },

  compilers: {
    solc: {
      version: "0.5.7",
      settings: {
        optimizer: {
          enabled : true,
          runs: 200
        }
      }
    }
  }
}
