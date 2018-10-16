import './PresalePool.sol';

contract PresalePoolProxy
{

  mapping (address => address) public presalePoolAddress;
  address distributionWallet = 0xaa81edab0ecb7753ea436a3a02ba334d2d4ebb3f;
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
