/**
 *                          Blockchain Class
 *  The Blockchain class contain the basics functions to create your own private blockchain
 *  It uses libraries like `crypto-js` to create the hashes for each block and `bitcoinjs-message` 
 *  to verify a message signature. The chain is stored in the array
 *  `this.chain = [];`. Of course each time you run the application the chain will be empty because and array
 *  isn't a persisten storage method.
 *  
 */

const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const bitcoinMessage = require('bitcoinjs-message');

class Blockchain {

    /**
     * Constructor of the class, you will need to setup your chain array and the height
     * of your chain (the length of your chain array).
     * Also everytime you create a Blockchain class you will need to initialized the chain creating
     * the Genesis Block.
     * The methods in this class will always return a Promise to allow client applications or
     * other backends to call asynchronous functions.
     */
    constructor() {
        console.log('blockchain initalized');
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    /**
     * This method will check for the height of the chain and if there isn't a Genesis Block it will create it.
     * You should use the `addBlock(block)` to create the Genesis Block
     * Passing as a data `{data: 'Genesis Block'}`
     */
    async initializeChain() {
        if (this.height === -1) {
            let block = new BlockClass.Block({ data: 'Genesis Block' });
            await this._addBlock(block);
        }
    }

    /**
     * Utility method that return a Promise that will resolve with the height of the chain
     */
    getChainHeight() {
        return new Promise((resolve, reject) => {
            resolve(this.height);
        });
    }

    /**
     * _addBlock(block) will store a block in the chain
     * @param {*} block 
     * The method will return a Promise that will resolve with the block added
     * or reject if an error happen during the execution.
     * You will need to check for the height to assign the `previousBlockHash`,
     * assign the `timestamp` and the correct `height`...At the end you need to 
     * create the `block hash` and push the block into the chain array. Don't for get 
     * to update the `this.height`
     * Note: the symbol `_` in the method name indicates in the javascript convention 
     * that this method is a private method. 
     */
    _addBlock(block) {
        return new Promise(async (resolve, reject) => {
            try {
                this.height += 1;
                block.height = this.height;

                if (this.height > 0) {
                    block.previousBlockHash = this.chain[this.height - 1].hash;
                }
                block.time = new Date().getTime().toString().slice(0, -3);
                block.hash = SHA256(JSON.stringify(block)).toString();
                this.chain.push(block)
                resolve('Block successfully added.')
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * The requestMessageOwnershipVerification(address) method
     * will allow you  to request a message that you will use to
     * sign it with your Bitcoin Wallet (Electrum or Bitcoin Core)
     * This is the first step before submit your Block.
     * The method return a Promise that will resolve with the message to be signed
     * @param {*} address 
     */
    requestMessageOwnershipVerification(address) {
        return new Promise((resolve) => {
            resolve(`${address}:${new Date().getTime().toString().slice(0, -3)}:starRegistry`)
        });
    }

    /**
     * The submitStar(address, message, signature, star) method
     * will allow users to register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     * Algorithm steps:
     * 1. Get the time from the message sent as a parameter example: `parseInt(message.split(':')[1])`
     * 2. Get the current time: `let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));`
     * 3. Check if the time elapsed is less than 5 minutes
     * 4. Veify the message with wallet address and signature: `bitcoinMessage.verify(message, address, signature)`
     * 5. Create the block and add it to the chain
     * 6. Resolve with the block added.
     * @param {*} address 
     * @param {*} message 
     * @param {*} signature 
     * @param {*} star 
     */
    submitStar(address, message, signature, star) {
        return new Promise(async (resolve, reject) => {

            var oldTime = parseInt(message.split(':')[1])

            let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
            if (currentTime - oldTime <= 300) {

                try {
                    if (bitcoinMessage.verify(message, address, signature) === false) {
                        reject('Bitcoin signature could not be verified')
                    }
                } catch (e) { reject('Bitcoin signature could not be verified with this error: ' + e) }

                var data = { "owner": address, star };
                let block = new BlockClass.Block(data);
                this._addBlock(block);
                resolve('Sucessfully added star.');
            } else {
                reject('TimeOut. You took more than 5 minutes to submit the star.');
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block
     *  with the hash passed as a parameter.
     * Search on the chain array for the block that has the hash.
     * @param {*} hash 
     */
    getBlockByHash(hash) {
        return new Promise((resolve, reject) => {
            for (var i = 0; i <= this.height; i++) {
                if (this.chain[i].hash === hash) {
                    resolve(this.chain[i]);
                }
            }
            resolve(null);
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block object 
     * with the height equal to the parameter `height`
     * @param {*} height 
     */
    getBlockByHeight(height) {
        return new Promise((resolve, reject) => {
            let block = this.chain.filter(p => p.height === height)[0];
            if (block) {
                resolve(block);
            } else {
                resolve(null);
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with an array of Stars objects existing in the chain 
     * and are belongs to the owner with the wallet address passed as parameter.
     * Remember the star should be returned decoded.
     * @param {*} address 
     */
    getStarsByWalletAddress(address) {
        return new Promise((resolve, reject) => {
            var StarArray = [];
            for (var i = 0; i <= this.height; i++) {
                var data = this.chain[i].getBData()
                if (this.chain[i].height != 0) {
                    if (data.owner === address) {
                        StarArray.push(data);
                    }
                }
            }
            resolve(StarArray);
        });
    }

    /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     * Steps to validate:
     * 1. You should validate each block using `validateBlock`
     * 2. Each Block should check the with the previousBlockHash
     */
    validateChain() {
        let errorLog = [];
        return new Promise(async (resolve, reject) => {
            for (var i = 0; i <= this.height; i++) {
                if (this.chain[i].height != 0) {
                    if (this.chain[i].previousBlockHash != this.chain[i - 1].hash) {
                        errorLog.push(`PreviousBlockhash in Block ${i} is not the same as hash of block ${i - 1}`)
                    }
                }
                try {
                    await this.chain[i].validate()
                } catch (err) {
                    errorLog.push(`In Block ${i} the hash is not the same.`);
                };
            }
            resolve(errorLog);
        });
    }
}

module.exports.Blockchain = Blockchain;   
