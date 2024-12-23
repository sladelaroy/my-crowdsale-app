const MyToken = artifacts.require("SmoothieToken");

const chai = require("chai");
const BN = web3.utils.BN;

const chaiBN = require("chai-bn")(BN);


chai.use(chaiBN)

(async () => {
  const chaiAsPromised = await import("chai-as-promised");
  chai.use(chaiAsPromised.default)
})();

const expect = chai.expect;

contract ("My token test", async () => {
  it("all tokens should be in my account", async () => {
    let instance = await MyToken.deployed();
    let totalSupply = await instance.totalSupply();
    expect(await instance.balanceOf(accounts[0])).to.be.a.bignumber.equal(totalSupply)
  })
})

