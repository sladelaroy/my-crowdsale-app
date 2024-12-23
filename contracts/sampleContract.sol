// SPDX-License-Identifier: MIT
pragma solidity >=0.8.14;

contract SampleContract {
    string public mystring ="hello web3";

    function updateString(string memory _newString) public payable {
        if (msg.value == 1 ether) {
            mystring = _newString;
        } else {
            payable(msg.sender).transfer(msg.value);
        }
    }
}