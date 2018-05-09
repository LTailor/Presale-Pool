const BigNumber = web3.BigNumber;
const REVERT_ERR = 'VM Exception while processing transaction: revert';

require('chai')
.use(require('chai-as-promised'))
.use(require('chai-bignumber')(web3.BigNumber))
.should();


const PresalePool = artifacts.require("PresalePool.sol");


const ETHER = new web3.BigNumber(10).toPower(18);

contract('PresalePool', function(accounts) {
  let presaleContract;

  const admin = accounts[0];
  const participant1 = accounts[1];

  describe('admin methods',async () => {
    before(async () => {
        presaleContract = await PresalePool.new();
        presaleContract.init([admin], admin, admin, {from: accounts[0]})
    });

    it('only admin can add to whitelist', async () => {
      await presaleContract.addToWhitelist(participant1,{from: participant1}).should.be.rejectedWith(REVERT_ERR);
      const status = await presaleContract.addToWhitelist(participant1,{from: admin});
      expect(status.receipt.status).to.equal('0x01');
    });

    it('only admin can remove from whitelist and this remove works', async () => {
      await presaleContract.removeFromWhitelist(participant1,{from: participant1}).should.be.rejectedWith(REVERT_ERR);
      const status = await presaleContract.removeFromWhitelist(participant1,{from: admin});
      expect(status.receipt.status).to.equal('0x01');
      await presaleContract.contribute({value: new web3.BigNumber(ETHER), from: participant1})
        .should.be.rejectedWith(REVERT_ERR);
    });
  });
});
