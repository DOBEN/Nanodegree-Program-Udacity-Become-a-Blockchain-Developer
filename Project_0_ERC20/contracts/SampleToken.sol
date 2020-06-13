pragma solidity >=0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
//import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract SampleToken is ERC20 {


    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint _initialSupply) ERC20(_name, _symbol) public {
        require(_initialSupply > 0, "INITIAL_SUPPLY has to be greater than 0");
        _setupDecimals(_decimals);
        _mint(msg.sender, _initialSupply);
    }
}