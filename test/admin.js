const BigNumber = web3.BigNumber;
const REVERT_ERR = 'VM Exception while processing transaction: revert';

require('chai')
.use(require('chai-as-promised'))
.use(require('chai-bignumber')(web3.BigNumber))
.should();


const PresalePool = artifacts.require("PresalePool.sol");
const TestToken = artifacts.require("TestToken.sol");

const ETHER = new web3.BigNumber(10).toPower(18);

contract('PresalePool', function(accounts) {
  let presaleContract;
  let testToken;
  const admin = accounts[0];
  const participant1 = accounts[1];
  beforeEach(async () => {
      presaleContract = await PresalePool.new();
      testToken = await TestToken.new();
      presaleContract.init([admin], {from: accounts[0]})
  });

  describe('admin methods',async () => {
    it('only admin can add to whitelist', async () => {
      await presaleContract.addToWhitelist(participant1,{from: participant1}).should.be.rejectedWith(REVERT_ERR);
      const status = await presaleContract.addToWhitelist(participant1,{from: admin});
      expect(status.receipt.status).to.equal(1);
    });

    it('participant gets reward correctly', async () => {
      await presaleContract.addToWhitelist(participant1,{from: admin});

      await presaleContract.contribute({value: new web3.BigNumber(ETHER * 2), from: participant1});

      await presaleContract.setTokenRate(ETHER, 18, {from: admin});

      await presaleContract.close({from: admin, gas: 500000});
      await presaleContract.sendContribution(testToken.address.toLowerCase(), {from: admin});

      await presaleContract.setTransferedState({from: admin});
      await presaleContract.getTokens(testToken.address, {from: participant1});

      const tokens = await testToken.balanceOf(participant1);

      expect(tokens).to.equal(new web3.BigNumber(2));
    });
  });
});
