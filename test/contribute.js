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
    beforeEach(async () => {
        presaleContract = await PresalePool.new();
        presaleContract.init([admin], {from: accounts[0]})
    });

    it('constructor should set owner', async () => {
    accounts[0].should.be.equal(
        await presaleContract.owner()
      );
    });

    describe('contribution methods',async () => {
      it('rejects if not sent by participant in whitelist', async () => {
      await presaleContract.contribute({value: new web3.BigNumber(ETHER), from: participant1})
        .should.be.rejectedWith(REVERT_ERR);
      });

      it('done if sent by participant in whitelist', async () => {
        await presaleContract.addToWhitelist(participant1,{from: admin});
        await presaleContract.contribute({value: new web3.BigNumber(ETHER), from: participant1});
        ETHER.should.be.bignumber.equal(await presaleContract.getContributedSum({from: participant1}));
      });
    });
});
