var Test = require('./testConfig.js');

contract('TestCustomERC721Token', async accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    var config;
    before('setup contract', async () => {
        config = await Test.Config(accounts);

        await config.customERC721Token.mint(account_one, 444, { from: config.owner });
        await config.customERC721Token.mint(account_one, 555, { from: config.owner });
        await config.customERC721Token.mint(account_one, 666, { from: config.owner });
    });

    describe('match erc721 spec', function () {

        it('should return total supply', async function () {
            var result = await config.customERC721Token.totalSupply.call();
            assert.equal(result, 3, 'The total Supply should be 3.')
        })

        it('get_name', async function () {
            var result = await config.customERC721Token.get_name.call();
            assert.equal(result, 'DOBEN', 'Could not get name.')
        })

        it('get_symbol', async function () {
            var result = await config.customERC721Token.get_symbol.call();
            assert.equal(result, 'DB', 'Could not get symbol.')
        })

        it('should get token balance', async function () {
            var result = await config.customERC721Token.balanceOf.call(account_one);
            assert.equal(result, 3, 'The total amount of coins owned by account_one should be 3.')
        })

        it('Test: ERC721Enumerable', async function () {

            var result = await config.customERC721Token.tokenOfOwnerByIndex(account_one, 0)
            var result1 = await config.customERC721Token.tokenOfOwnerByIndex(account_one, 1)
            assert.equal(result.toNumber(), 444, 'tokenOfOwnerByIndex did not work correctly.')
            assert.equal(result1.toNumber(), 555, 'tokenOfOwnerByIndex did not work correctly.')

            var result2 = await config.customERC721Token.tokenByIndex(0)
            var result3 = await config.customERC721Token.tokenByIndex(1)
            var result4 = await config.customERC721Token.tokenByIndex(2)
            assert.equal(result2.toNumber(), 444, 'tokenByIndex did not work correctly.')
            assert.equal(result3.toNumber(), 555, 'tokenByIndex did not work correctly.')
            assert.equal(result4.toNumber(), 666, 'tokenByIndex did not work correctly.')

            await config.customERC721Token.transferFrom(account_one, account_two, 555, { from: account_one })
            var result5 = await config.customERC721Token.tokenOfOwnerByIndex(account_two, 0)
            assert.equal(result5.toNumber(), 555, 'tokenOfOwnerByIndex did not work after transferring token.')
        })

        it('can approve address', async function () {
            var to = accounts[3]
            var owner_token = accounts[5]
            var tokenId = 7;

            await config.customERC721Token.mint(owner_token, tokenId, { from: config.owner });
            await config.customERC721Token.approve(to, tokenId, { from: owner_token });
            var result = await config.customERC721Token.getApproved(tokenId)

            assert.equal(result, to, 'To address did not get the approval correctly.')
        })

        it('can approve operator', async function () {
            var to = accounts[3]

            await config.customERC721Token.setApprovalForAll(to, true, { from: config.owner });
            var result = await config.customERC721Token.isApprovedForAll(config.owner, to)

            assert.equal(result, true, 'The operator should have gotten the approval.')
        })

        it('should return token url', async function () {
            var tokenId = 55;

            await config.customERC721Token.mint(account_one, tokenId, { from: config.owner });
            var result = await config.customERC721Token.tokenURI.call(tokenId);
            var compare_string = 'https://DOBEN.com/my_own_url/' + String(tokenId);

            assert.equal(result, compare_string, 'It should return the correct token uri.')
        })

        it('should transfer token from one owner to another', async function () {
            var tokenId = 88;

            await config.customERC721Token.mint(account_one, tokenId, { from: config.owner });
            await config.customERC721Token.transferFrom(account_one, account_two, tokenId, { from: account_one })
            var result = await config.customERC721Token.ownerOf(tokenId);

            assert.equal(result, account_two, 'The token should have changed owner.')

            var tokenId = 90;
            await config.customERC721Token.mint(account_one, tokenId, { from: config.owner });
            await config.customERC721Token.safeTransferFrom(account_one, account_two, tokenId, { from: account_one });
            var result = await config.customERC721Token.ownerOf(tokenId);

            assert.equal(result, account_two, 'The token should have changed owner.')
        })
    });

    describe('have ownership properties', function () {
 
        it('should fail when minting when address is not contract owner', async function () {
            var tokenId = 100;

            config.customERC721Token.mint(account_two, tokenId, { from: config.owner })
            var result = await config.customERC721Token.ownerOf(tokenId);
            assert.equal(result, account_two, 'The token should be minted.')

            var tokenId = 101;
            try {
                await config.customERC721Token.mint(account_two, tokenId, { from: account_two })
            } catch (e) { }
            var result = await config.customERC721Token.ownerOf(tokenId);

            assert.equal(result, '0x0000000000000000000000000000000000000000', 'The token should not be minted by any person except the owner of contract.')
        })

        it('should return contract owner', async function () {
            var result = await config.customERC721Token.get_owner();
            assert.equal(result, config.owner, 'Could not fetch the owner of the contract.')
        })

        it('transfer ownership', async function () {
            var newOwner = accounts[3];

            await config.customERC721Token.transferOwnership(newOwner, { from: config.owner });
            var result = await config.customERC721Token.get_owner();

            assert.equal(result, newOwner, 'Could not change the owner of the contract correctly.')
        })
    });
})