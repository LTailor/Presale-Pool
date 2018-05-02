
pragma solidity 0.4.23;

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

  modifier whenExchangeRateSetted()
  {
    require(exchangeRate > 0);
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
  event Paid(uint balance);

  mapping (address=> Participant) participantsInfo;
  PresaleInfo private presaleInfo;
  address public owner;
  uint public exchangeRate;
  uint private tokenDecimals;
  uint contributionBalance;

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
    participantsInfo[admin].admin = true;
    participantsInfo[admin].isWhitelisted = true;
  }

  function contribute() onlyWhitelisted whenOpened payable external
  {
    Participant storage participant = participantsInfo[msg.sender];
    participant.sum = participant.sum.add(msg.value);
    contributionBalance = contributionBalance.add(msg.value);
  }

  function getContributedSum() constant returns(uint)
  {
    return participantsInfo[msg.sender].sum;
  }

  function close() onlyAdmin
  {
    presaleInfo.state = PresaleState.Closed;
    Closed();
  }

  function sendContribution(address token)  onlyAdmin whenClosed external
  {
    token.transfer(contributionBalance);
    presaleInfo.state = PresaleState.Paid;
    Paid(contributionBalance);
  }

  function getTokens(address tokenAddress) external onlyWhitelisted whenTransfered whenExchangeRateSetted
  {
    uint reward = calculateParticipantTokens(msg.sender);
    ERC20 token = ERC20(tokenAddress);

    token.transfer(msg.sender, reward);
  }

  function setTransferedState() external onlyAdmin
  {
    presaleInfo.state = PresaleState.Transfered;
    Transfered();
  }

  function calculateParticipantTokens(address participant) internal returns(uint)
  {
    uint sum = participantsInfo[participant].sum;
    uint tokens = (10 ** tokenDecimals) * sum / exchangeRate;

    return tokens;
  }

  function setTokenRate(uint rate, uint decimals) onlyAdmin
  {
    exchangeRate = rate;
    tokenDecimals = decimals;
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
