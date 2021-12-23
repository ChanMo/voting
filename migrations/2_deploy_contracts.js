const Ballot = artifacts.require('Ballot');
const web3 = require('web3')

module.exports = function(deployer) {
  const params = ["Sun", "Zhu", "Tang", "Sha","Bai"]
  const paramsHex = params.map(i => web3.utils.asciiToHex(i))
  deployer.deploy(Ballot, paramsHex);
}
