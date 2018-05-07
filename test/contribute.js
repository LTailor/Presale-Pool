const BigNumber = web3.BigNumber;
const REVERT_ERR = 'VM Exception while processing transaction: revert';

require('chai')
.use(require('chai-as-promised'))
.use(require('chai-bignumber')(web3.BigNumber))
.should();

const util = require('./util');

const PresalePool = artifacts.require("PresalePool.sol");
const TestToken = artifacts.require("TestToken.sol");

const ETHER = new web3.BigNumber(10).toPower(18);

contract('PresalePool', function(accounts) {
    let presaleContract;
    let testToken;
    const admin = accounts[0];
    const participant1 = accounts[1];
    const participant2 = accounts[2];
    const participant3 = accounts[3];
    const tokenDecimals = 18;

    describe('contribution methods',async () => {
      before(async () => {
          presaleContract = await PresalePool.new();
          testToken = await TestToken.new();
          presaleContract.init([admin],admin, admin, {from: accounts[0]})
      });

      it('constructor should set owner', async () => {
      accounts[0].should.be.equal(
          await presaleContract.owner()
        );
      });

      it('rejects if not sent by participant in whitelist', async () => {
      await presaleContract.contribute({value: new web3.BigNumber(ETHER), from: participant3})
        .should.be.rejectedWith(REVERT_ERR);
      });

      it('done if sent by participant in whitelist', async () => {
        await presaleContract.addToWhitelist(participant3,{from: admin});
        await presaleContract.contribute({value: new web3.BigNumber(ETHER), from: participant3});
        ETHER.should.be.bignumber.equal(await presaleContract.getContributedSum({from: participant3}));
      });

      it('participants get reward correctly', async () => {

        // admin of the pool adds participants to whitelist so they can make contributions
        await presaleContract.addToWhitelist(participant1,{from: admin});
        await presaleContract.addToWhitelist(participant2,{from: admin});

        // participants make contribution to our pool
        await presaleContract.contribute({value: new web3.BigNumber(ETHER * 2), from: participant1});
        await presaleContract.contribute({value: new web3.BigNumber(ETHER * 5), from: participant2});

        await presaleContract.setTokenRate(ETHER, tokenDecimals, {from: admin});
        await presaleContract.close({from: admin});

        // admin of the pool sends contribution to the presale after pool is closed
        await presaleContract.sendContribution(testToken.address.toLowerCase(), 0, util.testTokenPresaleData(), {from: admin});
        await presaleContract.setTransferedState({from: admin});

        // participants want to get tokens to their balances and we want to be sure that they have got true value of tokens
        await presaleContract.getTokens(testToken.address, {from: participant1 });
        let tokens = await testToken.balanceOf(participant1);
        expect(tokens).to.deep.equal(new web3.BigNumber(2 * Math.pow(10, tokenDecimals)));

        await presaleContract.getTokens(testToken.address, {from: participant2 });
        tokens = await testToken.balanceOf(participant2);
        expect(tokens).to.deep.equal(new web3.BigNumber(5 * Math.pow(10, tokenDecimals)));
      });
    });
});
