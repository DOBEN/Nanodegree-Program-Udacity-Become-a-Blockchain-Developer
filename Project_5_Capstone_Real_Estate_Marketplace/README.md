# Udacity Blockchain Capstone

This project builds a decentralized housing marketplace.

In this project you can mint your own tokens to represent your title to the properties. Before you mint a token, you need to verify you own the property. Zokrates a zk-SNARKs verification system is used to create a verification system which can be designed to prove you have title to the property without revealing specific information on the property. 

Once the token has been verified, they are placed on a blockchain market place (OpenSea) for others to purchase. 


## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), and Dapp scaffolding (using HTML, and JS).

To install, download or clone the repo, then:

`npm install`

`truffle compile`

### This project uses following versions:

* Truffle version: v5.1.37
* OpenZeppelin version: openzeppelin-solidity@2.1.2
* Node version: v10.5.0

## Develop Client

To run truffle tests:

`truffle test ./eth-contracts/test/TestERC721Mintable.js`

`truffle test ./eth-contracts/test/TestSolnSquareVerifier.js`

`truffle test ./eth-contracts/test/TestSquareVerifier.js`

To use the dapp:

`cd eth-contracts/website`

`node app.js` 

To view dapp:

`http://localhost:8000`

To create a new Zokrates proof by using Zokrates's docker container:

`docker run -v ~/<your path>/Nanodegree-Program-Udacity-Become-a-Blockchain-Developer/Project_5_Capstone_Real_Estate_Marketplace/zokrates/code/square/:/home/zokrates/code -ti zokrates/zokrates /bin/bash`

`cd code`

`zokrates compile -i square.code`

`zokrates setup` 

`zokrates compute-witness -a 128352 850235`   (replace the two numbers with random numbers)    


`zokrates generate-proof`

Copy the `a, b, c, and input` fields from the generated proof.json file into the corresponding variables from the `./eth-contracts/website/app.js` file and increment the tokenID value in the `./eth-contracts/website/app.js` file

Now a new token can be minted by pressing the button on the dapp website: `http://localhost:8000`

# This project is deployed on Rinkeby and the generated tokens can be bought on a blockchain market place (OpenSea)

SquareVerifier Address on Rinkeby: 0xab699C219C14C17ACC7382CD7C64aFa90cE1B58a

SolnSquareVerifier Address on Rinkeby: 0x62f0e07A54a718fD6402B6EAfd06f9B7A8994a09

OpenSea MarketPlace Storefront link's: `https://rinkeby.opensea.io/assets/doben-v2`



Contract Abi's: `./eth-contracts/build/contracts`


# Project Resources

* [Remix - Solidity IDE](https://remix.ethereum.org/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Truffle Framework](https://truffleframework.com/)
* [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
* [Open Zeppelin ](https://openzeppelin.org/)
* [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
* [Docker](https://docs.docker.com/install/)
* [ZoKrates](https://github.com/Zokrates/ZoKrates)

# Comments

Zokrates uses G16 by default which has malleability issues: https://zokrates.github.io/toolbox/proving_schemes.html

When using G16, developers should pay attention to the fact that an attacker, seeing a valid proof, can very easily generate a different but still valid proof. Therefore, depending on the use case, making sure on chain that the same proof cannot be submitted twice may not be enough to guarantee that attackers cannot replay proofs. Mechanisms to solve this issue include:

    nullifiers

I used the nullifiers mechanisms by storing the "public b value" (proof.input[0] value) from the Zokrates proof on chain and nullifying it after a valid proof has been submitted with this "public b value".