pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

import './ERC721Mintable.sol';

contract SquareVerifier{
function verifyTx(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public view returns (bool);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token{

    SquareVerifier squareVerifier;

    constructor(address squareVerifier_address, string memory name, string memory symbol) CustomERC721Token( name, symbol) public {
        squareVerifier=SquareVerifier(squareVerifier_address);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solutions{
        uint256 _index;
        address _address;
    }

    // TODO define an array of the above struct
    Solutions[] public _my_solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(uint256=>bool)  _unique_solutions;  

    // TODO Create an event to emit when a solution is added
    event Solution_added(uint256 _index,  address _address);

    // TODO Create a function to add the solutions to the array and emit the event
    function add_solution(uint256 key) public {
        Solutions memory new_solution=Solutions(key,msg.sender);
        _my_solutions.push(new_solution);
        emit Solution_added(new_solution._index,  new_solution._address);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, address to, uint256 tokenId) whenNotPaused() public{
        require(squareVerifier.verifyTx(a, b, c, input), 'Your zk-snark proof has to be true.');
        require(_unique_solutions[input[0]] == false, 'The zk-snark proof can only be used once.');
        _unique_solutions[input[0]] = true;
        add_solution(input[0]);
        super.mint(to,tokenId);
        super.setTokenURI(tokenId);
    }

    function is_already_added(uint256 key) view public returns (bool){
        return _unique_solutions[key];
    }
}
