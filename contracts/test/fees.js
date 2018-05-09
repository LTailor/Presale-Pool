const BigNumber = web3.BigNumber;
const REVERT_ERR = 'VM Exception while processing transaction: revert';

require('chai')
.use(require('chai-as-promised'))
.use(require('chai-bignumber')(web3.BigNumber))
.should();

const util = require('./util.js');

const PresalePool = artifacts.require("PresalePool.sol");
const TestToken = artifacts.require("TestToken.sol");

const ETHER = new web3.BigNumber(10).toPower(18);

contract('PresalePool', function(accounts) {
  let presaleContract;
  let testToken;

  const owner = accounts[0];
  const admin = accounts[1];
  const poolWallet = accounts[2]
  const participant = accounts[3];
  const distWallet = accounts[4];

  const tokenDecimals = 18;
  const teamFee = new web3.BigNumber(10000);
  const poolFee = new web3.BigNumber(15000);
  const participantContribution = new web3.BigNumber(ETHER * 3);

  describe('fees methods',async () => {
    before(async () => {
        presaleContract = await PresalePool.new();
        testToken = await TestToken.new();
        presaleContract.init([admin], distWallet, poolWallet, {from: owner})
    });

    it('Pool and team fees are being setted correctly', async () => {
      await presaleContract.addToWhitelist(participant,{from: admin});
      //admin sets fees
      await presaleContract.setTeamFeePerEther(teamFee, {from: owner});
      await presaleContract.setPoolFeePerEther(poolFee, {from: admin});

      const teamBalanceBefore = await web3.eth.getBalance(distWallet);
      const poolBalanceBefore = await web3.eth.getBalance(poolWallet);
      // participant makes contribution to our pool
      await presaleContract.contribute({value: participantContribution, from: participant});
      await presaleContract.setTokenRate(ETHER, tokenDecimals, {from: admin});
      await presaleContract.close({from: admin});

      // admin of the pool sends contribution to the presale after pool is closed
      await presaleContract.sendContribution(testToken.address.toLowerCase(), 0, util.testTokenPresaleData(), {from: admin});
      await presaleContract.setTransferedState({from: admin});

      const presaleContrib = await presaleContract.getContributedSumAfterFees({from:participant});

      // transfer ether to pool wallet and team wallet (fees)
      await presaleContract.sendFeeToTeam({from: owner});
      await presaleContract.sendFeeToPoolAdmin({from: admin});

      // compare what wallets had and what they have now
      const totalTeamFee = participantContribution.mul(teamFee).div(ETHER);
      const totalPoolFee = participantContribution.mul(poolFee).div(ETHER);
      const teamBalance = await web3.eth.getBalance(distWallet);
      const poolBalance = await web3.eth.getBalance(poolWallet);

      expect(teamBalance.minus(teamBalanceBefore)).to.deep.equal(totalTeamFee);
      expect(poolBalance.minus(poolBalanceBefore)).to.deep.equal(totalPoolFee);

      expect(presaleContrib).to.deep.equal(participantContribution.minus(totalTeamFee.plus(totalPoolFee)));
    });
  });
});
