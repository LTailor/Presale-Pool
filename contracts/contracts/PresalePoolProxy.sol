import './PresalePool.sol';

contract PresalePoolProxy
{
  event PresalePoolContractCreated(string id, address c);

  function init(string id,address wallet) public
  {
    PresalePool presalePool = new PresalePool();
    emit PresalePoolContractCreated(id, presalePool);
  }

  function callPresaleMethod(address destination, bytes data) external {
      require(
          destination.call.gas(msg.gas).value(msg.value)(data)
      );
  }

}
