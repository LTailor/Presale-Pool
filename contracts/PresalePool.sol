
pragma solidity 0.4.18;

import "./SafeMath.sol";

interface ERC20 {
    function transfer(address _to, uint _value) public returns (bool success);
    function balanceOf(address _owner) public constant returns (uint balance);
}

contract PresalePool {

  using SafeMath for uint;

  enum PresaleState { Opened, Closed, Paid, Transfered}

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

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
    require(presaleInfo.state == PresaleState.Closed);
    _;
  }

  modifier whenOpened()
  {
    require(presaleInfo.state == PresaleState.Opened);
    _;
  }

  modifier whenTransfered()
  {
    require(presaleInfo.state == PresaleState.Transfered);
    _;
  }

  struct PresaleInfo
  {
    PresaleState state;
  }

  struct Participant
  {
    bool admin;
    bool isWhitelisted;
    uint sum;
  }

  event AddedToWhiteList(address participant);
  event Closed();
  event Transfered();
  event Paid();

  mapping (address=> Participant) participantsInfo;
  PresaleInfo private presaleInfo;
  address public owner;

  function PresalePool() public
  {
    owner = msg.sender;
  }

  function init(address[] _admins) public onlyOwner
  {
    presaleInfo.state = PresaleState.Opened;
    for (uint i = 0; i < _admins.length; i++) {
        addAdmin(_admins[i]);
    }
  }

  function addAdmin(address admin) internal
  {
    Participant storage adminInfo = participantsInfo[admin];
    adminInfo.admin = true;
    adminInfo.isWhitelisted = true;
  }

  function contribute() onlyWhitelisted whenOpened payable external
  {
    Participant storage participant = participantsInfo[msg.sender];
    participant.sum = participant.sum.add(msg.value);
  }

  function getContributedSum() returns(uint)
  {
    Participant storage participant = participantsInfo[msg.sender];
    return participant.sum;
  }

  function close() onlyAdmin
  {
    presaleInfo.state = PresaleState.Closed;
    Closed();
  }

  function sendContribution(address token) onlyAdmin whenClosed external
  {
    token.transfer(this.balance);
    presaleInfo.state = PresaleState.Paid;
  }

  function getTokens(address tokenAddress) external onlyWhitelisted whenTransfered
  {
    uint reward = calculateTokens(msg.sender);
    ERC20 token = ERC20(tokenAddress);

    token.transfer(msg.sender, reward);
  }

  function setTransferedState()
  {
    presaleInfo.state = PresaleState.Transfered;
    Transfered();
  }

  function calculateTokens(address participant) internal returns(uint)
  {
    return 0;
  }

  function addToWhitelist(address participant) external onlyAdmin
  {
    Participant storage participantInfo = participantsInfo[participant];
    participantInfo.isWhitelisted = true;
    AddedToWhiteList(participant);
  }

  function removeFromWhitelist(address participant) external onlyAdmin
  {
    Participant storage participantInfo = participantsInfo[participant];
    participantInfo.isWhitelisted = false;
  }
}
