var CustomERC721Token = artifacts.require("CustomERC721Token");
var SquareVerifier = artifacts.require("SquareVerifier");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

var Config = async function (accounts) {
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0x69e1CB5cFcA8A311586e3406ed0301C06fb839a2",
        "0xF014343BDFFbED8660A9d8721deC985126f189F3",
        "0x0E79EDbD6A727CfeE09A2b1d0A59F7752d5bf7C9",
        "0x9bC1169Ca09555bf2721A5C9eC6D69c8073bfeB4",
        "0xa23eAEf02F9E0338EEcDa8Fdd0A73aDD781b2A86",
        "0x6b85cc8f612d5457d49775439335f83e12b8cfde",
        "0xcbd22ff1ded1423fbc24a7af2148745878800024",
        "0xc257274276a4e539741ca11b590b9447b26a8051",
        "0x2f2899d6d35b1a48a4fbdc93a37a72f264a9fca7"
    ];

    let owner = accounts[9];

    let customERC721Token = await CustomERC721Token.new('DOBEN', 'DB', { gas: 6721975, from: owner });
    let squareVerifier = await SquareVerifier.new({ gas: 6721975, from: owner });
    let solnSquareVerifier = await SolnSquareVerifier.new(SquareVerifier.address, 'DOBEN', 'DB', { gas: 6721975, from: owner });

    return {
        owner: owner,
        testAddresses: testAddresses,
        customERC721Token: customERC721Token,
        squareVerifier: squareVerifier,
        solnSquareVerifier: solnSquareVerifier,
    }
}

module.exports = {
    Config: Config
};