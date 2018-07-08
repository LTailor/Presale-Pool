import './PresalePool.sol';

contract PresalePoolProxy
{

  mapping (address => address) public presalePoolAddress;
  address distributionWallet = 0x0612640F0557C41aA2b31cB27F982DF8c63001eE;
  function init(address[] admins, address wallet) public
  {
    PresalePool presalePool = new PresalePool();
    presalePool.init(admins, distributionWallet, wallet);
    presalePoolAddress[msg.sender] = presalePool;
    presalePool.setNewOwner(msg.sender);
  }

  function getPresalePoolAddress(address creatorWallet) view external returns(address)
  {
    return presalePoolAddress[creatorWallet];
  }
}
