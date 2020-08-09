var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
//sudo sysctl fs.inotify.max_user_watches=16384

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 8545,            // Standard Ganache UI port
      network_id: '*',
      gas: 4698712
    }
  },
  compilers: {
    solc: {
      version: "^0.4.25"
    }
  }
};