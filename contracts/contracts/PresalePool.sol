
pragma solidity 0.4.23;

import "./SafeMath.sol";

interface ERC20 {
    function transfer(address _to, uint _value) external returns (bool success);
    function balanceOf(address _owner) external view returns (uint balance);
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

  modifier onlyInDate()
  {
    if (presaleInfo.startDate!=0 && presaleInfo.endDate!=0)
    {
      require(now >= presaleInfo.startDate && now <= presaleInfo.endDate);
    }
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
    uint minContribution;
    uint maxContribution;
    uint startDate;
    uint endDate;
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
  event GotTokens(address participant, uint tokens);
  event TeamFeeSetted(uint feePerEther);
  event PoolFeeSetted(uint feePerEther);
  event ParticipateContributed(address participant);
  event ParticipantWithdrawed(address participant, uint amount);

  mapping (address=> Participant) participantsInfo;
  PresaleInfo private presaleInfo;
  address public owner;
  address public distributionWallet;
  address public poolDistributionWallet;
  uint public exchangeRate;
  uint private tokenDecimals;
  uint contributionBalance;
  uint feePerEtherTeam;
  uint feePerEtherPool;
  uint totalTeamFee;
  uint totalPoolFee;

  constructor() public
  {
    owner = msg.sender;
  }

  function init(address[] _admins, address _distributionWallet, address _poolDistributionWallet) external onlyOwner
  {
    presaleInfo.state = PresaleState.Opened;
    distributionWallet = _distributionWallet;
    poolDistributionWallet = _poolDistributionWallet;

    for (uint i = 0; i < _admins.length; i++) {
        addAdmin(_admins[i]);
    }
  }

  function setNewOwner(address _owner) external onlyOwner
  {
    owner = _owner;
  }

  function addAdmin(address admin) internal
  {
    participantsInfo[admin].admin = true;
    participantsInfo[admin].isWhitelisted = true;
  }

  function contribute() onlyWhitelisted whenOpened payable onlyInDate external
  {
    checkContribution(msg.value);
    Participant storage participant = participantsInfo[msg.sender];
    participant.sum = participant.sum.add(msg.value);
    contributionBalance = contributionBalance.add(msg.value);

    emit ParticipateContributed(msg.sender);
  }

  function withdrawContribution() whenOpened external
  {
    Participant memory participant = participantsInfo[msg.sender];
    contributionBalance = contributionBalance.sub(participant.sum);
    require(msg.sender.call.value(participant.sum)());

    emit ParticipantWithdrawed(msg.sender, participant.sum);
    participant.sum = 0;
  }

  function checkContribution(uint value) internal view
  {
    if (presaleInfo.minContribution != 0 && presaleInfo.maxContribution !=0 )
    {
      require(value >= presaleInfo.minContribution && value <= presaleInfo.maxContribution);
    }
  }

  function sendContribution(address token, uint gasLimit, bytes data) external onlyAdmin whenClosed
  {
    uint fee = calculateTotalValueFee(contributionBalance);
    uint gas = (gasLimit > 0) ? gasLimit : gasleft();
    require(
        token.call.gas(gas).value(contributionBalance - fee)(data)
    );

    presaleInfo.state = PresaleState.Paid;

    emit Paid(contributionBalance.sub(fee));
  }

  function getTokens(address tokenAddress) external
  {
    uint reward = calculateParticipantTokens(msg.sender);
    ERC20 token = ERC20(tokenAddress);

    require(token.transfer(msg.sender, reward));
    emit GotTokens(msg.sender, reward);
  }

  function calculateParticipantTokens(address participant) internal view  returns(uint)
  {
    uint sum = participantsInfo[participant].sum;
    uint fee = calculateTotalValueFee(sum);
    sum = sum.sub(fee);

    uint tokens = (10 ** tokenDecimals).mul(sum).div(exchangeRate);

    return tokens;
  }

  function calculateTotalValueFee(uint value) internal view returns(uint)
  {
    uint fee = value.mul(feePerEtherPool.add(feePerEtherTeam)).div(1 ether);
    return fee;
  }

  function calculateTeamValueFee(uint value) internal view returns(uint)
  {
    uint fee = value.mul(feePerEtherTeam).div(1 ether);
    return fee;
  }

  function calculatePoolValueFee(uint value) internal view returns(uint)
  {
    uint fee = value.mul(feePerEtherPool).div(1 ether);
    return fee;
  }

  function setPresaleSettings(uint _startDate, uint _endDate, uint _minContribution, uint _maxContribution) onlyAdmin
  {
    presaleInfo.startDate = _startDate;
    presaleInfo.endDate = _endDate;
    presaleInfo.minContribution = _minContribution;
    presaleInfo.maxContribution = _maxContribution;
  }

  function setTokenRate(uint rate, uint decimals) external onlyAdmin
  {
    exchangeRate = rate;
    tokenDecimals = decimals;
  }

  function setTeamFeePerEther(uint fee) external onlyOwner
  {
    feePerEtherTeam = fee;
    emit TeamFeeSetted(fee);
  }

  function setPoolFeePerEther(uint fee) external onlyAdmin
  {
    feePerEtherPool = fee;
    emit PoolFeeSetted(fee);
  }

  function sendFeeToTeam() external onlyOwner
  {
    distributionWallet.transfer(calculateTeamValueFee(contributionBalance));
  }

  function sendFeeToPoolAdmin() external onlyAdmin
  {
    poolDistributionWallet.transfer(calculatePoolValueFee(contributionBalance));
  }

  function addToWhitelist(address participant) external onlyAdmin
  {
    Participant storage participantInfo = participantsInfo[participant];
    participantInfo.isWhitelisted = true;

    emit AddedToWhiteList(participant);
  }

  function removeFromWhitelist(address participant) external onlyAdmin
  {
    Participant storage participantInfo = participantsInfo[participant];
    participantInfo.isWhitelisted = false;
  }

  function getContributedSum() external view returns(uint)
  {
    return participantsInfo[msg.sender].sum;
  }

  function getContributedSumAfterFees() external view returns(uint)
  {
    return participantsInfo[msg.sender].sum.sub(calculateTotalValueFee(participantsInfo[msg.sender].sum));
  }

  function setTransferedState() external onlyAdmin
  {
    presaleInfo.state = PresaleState.Transfered;

    emit Transfered();
  }

  function close() public onlyAdmin
  {
    presaleInfo.state = PresaleState.Closed;

    emit Closed();
  }
}
