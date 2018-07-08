const BigNumber = web3.BigNumber;
const REVERT_ERR = 'VM Exception while processing transaction: revert';

require('chai')
.use(require('chai-as-promised'))
.use(require('chai-bignumber')(web3.BigNumber))
.should();

const PresalePool = artifacts.require("PresalePool.sol");
const AttackContract = artifacts.require("WithdrawReentrancy.sol");

const ETHER = new web3.BigNumber(10).toPower(18);

contract('PresalePool', function(accounts) {
    let presaleContract;
    let testToken;
    const admin = accounts[0];
    const participant1 = accounts[1];
    const participant2 = accounts[2];
    const tokenDecimals = 18;

    describe('test possible attacks',async () => {
      before(async () => {
          presaleContract = await PresalePool.new();
          attack = await AttackContract.new();
          await presaleContract.init([admin],admin, admin, {from: admin})
          await presaleContract.setPresaleSettings(0, 0, ETHER.mul(2), ETHER.mul(10), ETHER.mul(30), {from: admin});

      });


      it('withdraw reentrancy attack', async () => {

        // admin of the pool adds participants to whitelist so they can make contributions
        await presaleContract.addAddressesToWhitelist([attack.address,participant1],{from: admin});

        await web3.eth.sendTransaction({from:participant2,to:attack.address, value:web3.toWei(1, "ether")});

        await presaleContract.contribute({value: 2 * ETHER, from: participant1});
        await attack.setTargetAddress(presaleContract.address)
        await attack.runAttack()

        (ETHER*2).should.be.bignumber.equal(await web3.eth.getBalance(attack.address));
      });

    });
});
