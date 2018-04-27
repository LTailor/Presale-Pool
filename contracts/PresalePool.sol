
pragma solidity 0.4.18;

import "./SafeMath.sol";

interface ERC20 {
    function transfer(address _to, uint _value) public returns (bool success);
    function balanceOf(address _owner) public constant returns (uint balance);
}

contract PresalePool {

  using SafeMath for uint;
  modifier onlyAdmin()
  {
    require(participantsInfo[msg.sender].admin);
    _;
  }

  modifier onlyWhitelisted()
  {
    require(participantsInfo[msg.sender].isWhitelisted);
    _;
  }

  modifier whenClosed()
  {
    require(!presaleInfo.closed);
    _;
  }

  address[] public admins;

  struct PresaleInfo
  {
    bool closed;
  }

  struct Participant
  {
    bool admin;
    bool isWhitelisted;
    uint sum;
  }

  mapping (address=> Participant) participantsInfo;
  PresaleInfo private presaleInfo;

  function PresalePool(address[] _admins)
  {
    admins = _admins;
  }

  function addAdmin(address admin) internal
  {
    Participant storage adminInfo = participantsInfo[admin];
    adminInfo.admin = true;
    adminInfo.isWhitelisted = true;
  }

  function contribute() onlyWhitelisted payable external
  {
    Participant storage participant = participantsInfo[msg.sender];
    participant.sum = participant.sum.add(msg.value);
  }

  function sendContribution(address token) onlyAdmin external
  {
    token.transfer(this.balance);
  }

  function getTokens(address tokenAddress) external onlyWhitelisted whenClosed
  {
    uint reward = calculateTokens(msg.sender);
    ERC20 token = ERC20(tokenAddress);

    token.transfer(msg.sender, reward);
  }

  function calculateTokens(address participant) internal returns(uint)
  {
    return 0;
  }

  function addToWhiteList(address participant) external onlyAdmin
  {
    Participant storage participantInfo = participantsInfo[participant];
    participantInfo.isWhitelisted = true;
  }

  function removeFromWhiteList(address participant) external onlyAdmin
  {
    Participant storage participantInfo = participantsInfo[participant];
    participantInfo.isWhitelisted = false;
  }
}
