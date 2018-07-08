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
  const participant2 = accounts[2];

  describe('pool settings',async () => {
    before(async () => {
        presaleContract = await PresalePool.new();
        await presaleContract.init([admin], admin, admin, {from: admin});
        await presaleContract.setPresaleSettings(0, 0, ETHER * 2, ETHER * 10, ETHER * 30, {from: admin});
    });


    it('if dates not setted methods called correctly', async () => {
      await presaleContract.addToWhitelist(participant1,{from: admin});
      await presaleContract.addToWhitelist(participant2,{from: admin});
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
      await presaleContract.setPresaleSettings(startDate, endDate, ETHER, ETHER * 7, ETHER * 30, {from:admin});
      await presaleContract.contribute({value: new web3.BigNumber(ETHER * 2), from: participant1});
      await presaleContract.setPresaleSettings(startDate+3600, endDate+3600, ETHER, ETHER * 5, ETHER * 30, {from:admin});
      await presaleContract.contribute({value: new web3.BigNumber(ETHER), from: participant1}).should.be.rejectedWith(REVERT_ERR);
    });

    it('participant can contribute only < max contribution', async () => {
      await presaleContract.setPresaleSettings(startDate, endDate+3600, ETHER, ETHER * 7, ETHER * 30, {from:admin});
      await presaleContract.contribute({value: new web3.BigNumber(ETHER * 8), from: participant1}).should.be.rejectedWith(REVERT_ERR);

      await presaleContract.contribute({value: new web3.BigNumber(ETHER * 4), from: participant1})
      await presaleContract.contribute({value: new web3.BigNumber(ETHER * 5), from: participant1}).should.be.rejectedWith(REVERT_ERR);
    });

    it('rebalancing correct', async () => {
      await presaleContract.withdrawContribution({from: participant1});
      await presaleContract.setPresaleSettings(startDate, endDate+3600, ETHER*3, ETHER * 5, ETHER * 30, {from:admin});
      await presaleContract.contribute({value: new web3.BigNumber(ETHER * 2), from: participant1});
      (ETHER*0).should.be.bignumber.equal(await presaleContract.getContributedSum({from: participant1}));
      (ETHER*0).should.be.bignumber.equal(await presaleContract.getPoolValue({from: participant1}));

      await presaleContract.setPresaleSettings(startDate, endDate+3600, ETHER, ETHER * 5, ETHER * 30, {from:admin});
      (ETHER*2).should.be.bignumber.equal(await presaleContract.getContributedSum({from: participant1}));
      (ETHER*2).should.be.bignumber.equal(await presaleContract.getPoolValue({from: participant1}));

      await presaleContract.setPresaleSettings(startDate, endDate+3600, ETHER*3, ETHER * 9, ETHER * 30, {from:admin});
      (ETHER*0).should.be.bignumber.equal(await presaleContract.getContributedSum({from: participant1}));
      (ETHER*0).should.be.bignumber.equal(await presaleContract.getPoolValue({from: participant1}));
      (ETHER*2).should.be.bignumber.equal(await presaleContract.getRealSum({from: participant1}));

      await presaleContract.contribute({value: new web3.BigNumber(ETHER * 4), from: participant2});
      (ETHER*4).should.be.bignumber.equal(await presaleContract.getPoolValue({from: participant1}));
      const p2Balance = await web3.eth.getBalance(participant2)

      await presaleContract.setPresaleSettings(startDate, endDate+3600, ETHER, ETHER * 3, ETHER * 30, {from:admin});
      (p2Balance.add(ETHER*4)).should.be.bignumber.equal(await web3.eth.getBalance(participant2));
      (ETHER*0).should.be.bignumber.equal(await presaleContract.getContributedSum({from: participant2}));
      (ETHER*2).should.be.bignumber.equal(await presaleContract.getPoolValue({from: participant1}));
    });
  });
});
