// migrating the appropriate contracts

var SupplyChain = artifacts.require("./SupplyChain.sol");



module.exports = function(deployer,_,accounts) {

  deployer.deploy(SupplyChain,accounts[1],accounts[2],accounts[3],accounts[4]);
};
