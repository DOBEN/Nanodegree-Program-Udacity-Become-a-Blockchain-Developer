var Test = require('./testConfig.js');
var proof = require('./proof.json');

contract('SolnSquareVerifier', async accounts => {

    var config;

    beforeEach(async function () {
        config = await Test.Config(accounts);
    })

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('Test if a new solution can be added for contract - SolnSquareVerifier', async function () {
        var sender = accounts[4];

        await config.solnSquareVerifier.add_solution(proof.inputs[0], { from: sender });
        var result2 = await config.solnSquareVerifier._my_solutions(0)

        assert.equal(result2._index, parseInt(proof.inputs[0]), 'New solution could not be added correctly.')
        assert.equal(result2._address, sender, 'New solution could not be added correctly.')
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('Test an ERC721 token can be minted for contract - SolnSquareVerifier', async function () {
        var tokenId = 42;
        var to = accounts[8];

        await config.solnSquareVerifier.mint(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, to, tokenId, { from: config.owner })
        var result = await config.solnSquareVerifier.balanceOf.call(to);
        var result2 = await config.solnSquareVerifier.ownerOf.call(tokenId);

        assert.equal(result, 1, 'There should be one token minted.')
        assert.equal(result2, to, 'There should be one token minted by to account.')

        var result1 = await config.solnSquareVerifier.tokenURI(tokenId)
        var compare_string = 'https://DOBEN.com/my_own_url/' + String(tokenId);

        assert.equal(result1, compare_string, 'The token URL was not set correctly.')
    })

    it('pause minting', async function () {
        var tokenId = 99;

        await config.solnSquareVerifier.set_paused_value(true, { from: config.owner })
        var before_result = await config.solnSquareVerifier.balanceOf.call(config.owner);
        try {
            await config.solnSquareVerifier.mint(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, config.owner, tokenId, { from: config.owner })
        } catch (e) { }
        var after_result = await config.solnSquareVerifier.balanceOf.call(config.owner);

        assert.equal(before_result - after_result, 0, 'There should be no token minted if contract is paused.')

        await config.solnSquareVerifier.set_paused_value(false, { from: config.owner })
        await config.solnSquareVerifier.mint(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, config.owner, tokenId, { from: config.owner })
        var after2_result = await config.solnSquareVerifier.balanceOf.call(config.owner);

        assert.equal(after2_result-after_result, 1, 'There should be a token minted if contract is not paused.')
    })
})