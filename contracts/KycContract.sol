pragma solidity ^0.8.20;

import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';
contract KycContract is Ownable {

  constructor() Ownable(msg.sender) {
    
  }

  mapping(address => bool) allowed;
  function setKycCompleted(address _addr) public onlyOwner {
    allowed[_addr] = true;
  }

  function setKycRevoked(address _addr) public onlyOwner {
    allowed[_addr] = false;
  }

  function kycCompleted(address _addr) public view returns(bool) {
    return allowed[_addr];
  }
}