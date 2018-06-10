pragma solidity 0.4.23;

interface PresalePool {
    function withdrawContribution() external;
    function contribute() payable external;
}

contract WithdrawReentrancy {

}
