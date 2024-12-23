const Sample = artifacts.require("../contracts/sampleContract");

module.exports = function(deployer) {
  deployer.deploy(Sample);
};
