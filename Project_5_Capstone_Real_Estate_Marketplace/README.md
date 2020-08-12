
SquareVerifier Address on Rinkeby: 0x0119b9F8F31a2a29Ea71Cf56A5030Ce25DFA761F

SolnSquareVerifier Address on Rinkeby: 0x918fa51F0ddedA345823E621246BA7dac296Be2b

Contract Abi's: ./eth-contracts/build/contracts

OpenSea MarketPlace Storefront link's: https://rinkeby.opensea.io/assets/unidentified-contract-v688

Zokrates uses G16 by default which has malleability issues: https://zokrates.github.io/toolbox/proving_schemes.html

When using G16, developers should pay attention to the fact that an attacker, seeing a valid proof, can very easily generate a different but still valid proof. Therefore, depending on the use case, making sure on chain that the same proof cannot be submitted twice may not be enough to guarantee that attackers cannot replay proofs. Mechanisms to solve this issue include:

    nullifiers

I used the nullifiers mechanisms by storing the "public b value" (proof.input[0] value) from the Zokrates proof on chain and nullifying it after a valid proof has been submitted with this "public b value".
