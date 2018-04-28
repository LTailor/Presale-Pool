const BigNumber = web3.BigNumber;
const REVERT_ERR = 'VM Exception while processing transaction: revert';

require('chai')
.use(require('chai-as-promised'))
.should();


const PresalePool = artifacts.require("PresalePool.sol");

const ETHER = new web3.BigNumber(10).toPower(18);

contract('PresalePool', function(accounts) {
    let presaleContract;

    beforeEach(async () => {
        presaleContract = await PresalePool.new();
        presaleContract.init([accounts[0]], {from: accounts[0]})
    });

    it('constructor should set owner', async () => {
    accounts[0].should.be.equal(
        await presaleContract.owner()
    );
  });


    it('rejects if not sent by participant in whitelist', async () => {
    await presaleContract.contribute({value: new web3.BigNumber(ETHER), from: accounts[2], gas: 25000})
      .should.be.rejectedWith(REVERT_ERR);
    });

    it('done if sent by participant in whitelist', async () => {
      await presaleContract.addToWhitelist([accounts[2]],{from: accounts[0], gas: 25000});
      await presaleContract.contribute({value: new web3.BigNumber(ETHER), from: accounts[2], gas: 25000});
      ETHER.should.be.bignumber.equal(
                await presaleContract.getContributedSum({from: accounts[2],gas: 25000})
            );
    });
});
