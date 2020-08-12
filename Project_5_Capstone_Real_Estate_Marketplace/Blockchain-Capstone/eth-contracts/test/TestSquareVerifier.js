var Test = require('./testConfig.js');
var proof = require('./proof.json');
var fake_proof = require('./fake_proof.json');

contract('SquareVerifier', async accounts => {

    var config;

    beforeEach(async function () {
        config = await Test.Config(accounts);
    })

    // Test verification with correct proof
    // - use the contents from proof.json generated from zokrates steps
    it('Test verification with correct proof', async function () {
        let result = await config.squareVerifier.verifyTx(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);

        assert.equal(result, true, 'The verification of the fake_proof should fail.')
    })
    
    // Test verification with incorrect proof
    it('Test verification with incorrect proof', async function () {
        let result = await config.squareVerifier.verifyTx(fake_proof.proof.a, fake_proof.proof.b, fake_proof.proof.c, fake_proof.inputs);
        
        assert.equal(result, false, 'The verification of the fake_proof should fail.')
    })
})
