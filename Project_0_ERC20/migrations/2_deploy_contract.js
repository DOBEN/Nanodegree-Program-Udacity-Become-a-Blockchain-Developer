const SampleToken = artifacts.require("SampleToken");

module.exports = function(deployer) {
  deployer.deploy(SampleToken,'DOBEN','DB','2','100000');
};
