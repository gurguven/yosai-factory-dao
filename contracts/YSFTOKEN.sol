// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YSFTOKEN is ERC20, Ownable {
    constructor() ERC20("YSF TOKEN", "YSF") {}

    function mint(address to, uint256 amount) public onlyOwner {
        uint etherAmount = amount * 10**18;
        _mint(to, etherAmount);
    }

    function _approve(address sender, uint256 amount) public {
        uint etherAmount = amount * 10**18;
        approve(sender, etherAmount);
    }
}
