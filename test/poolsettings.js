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

  describe('pool settings',async () => {
    before(async () => {
        presaleContract = await PresalePool.new();
        presaleContract.init([admin], admin, admin, {from: accounts[0]});
    });


    it('if dates not setted methods called correctly', async () => {
      await presaleContract.addToWhitelist(participant1,{from: admin});
      await presaleContract.contribute({value: new web3.BigNumber(ETHER * 2), from: participant1});
      const contractBalance = await web3.eth.getBalance(presaleContract.address);
      expect(contractBalance).to.deep.equal(new web3.BigNumber(ETHER * 2));
    });

    it('if min and max contributions not setted methods called correctly', async () => {
      await presaleContract.contribute({value: new web3.BigNumber(ETHER * 2), from: participant1});
      const contractBalance = await web3.eth.getBalance(presaleContract.address);
      expect(contractBalance).to.deep.equal(new web3.BigNumber(ETHER * 4));
    });

    const startDate = new Date().getTime() / 1000;
    const endDate = startDate + 3600;

    it('participant can contribute only in date', async () => {
      await presaleContract.setPresaleSettings(startDate, endDate, ETHER, new web3.BigNumber(ETHER * 5));
      await presaleContract.contribute({value: new web3.BigNumber(ETHER * 2), from: participant1});
      await presaleContract.setPresaleSettings(startDate+3600, endDate+3600, ETHER, new web3.BigNumber(ETHER * 5));
      await presaleContract.contribute({value: new web3.BigNumber(ETHER), from: participant1}).should.be.rejectedWith(REVERT_ERR);
    });

    it('participant can contribute only between min and max range', async () => {
      await presaleContract.setPresaleSettings(startDate, endDate+3600, ETHER, new web3.BigNumber(ETHER * 5));
      await presaleContract.contribute({value: new web3.BigNumber(ETHER * 7), from: participant1}).should.be.rejectedWith(REVERT_ERR);
      await presaleContract.setPresaleSettings(startDate, endDate+3600, ETHER, new web3.BigNumber(ETHER * 5));
      await presaleContract.contribute({value: new web3.BigNumber(ETHER), from: participant1});
    });
  });
});
