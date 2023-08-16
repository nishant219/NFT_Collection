# Crypto Devs NFT Collection

The Crypto Devs NFT Collection consists of unique NFTs that celebrate the world of blockchain and cryptocurrency development. Each NFT represents a piece of this vibrant ecosystem and carries a distinctive identity.
```
## About the Project
```
The Crypto Devs NFT Collection is an Ethereum-based project that allows users to mint and own limited edition NFTs. The project features the following key functionalities:

- A total of 20 unique Crypto Devs NFTs.
- Users can mint NFTs through a presale period or after the presale ends.
- Whitelisted users have a 5-minute presale period with guaranteed NFT availability.
- NFT metadata and images are hosted on IPFS, and the base URI can be customized.
- Ownership of NFTs is tracked on the Ethereum blockchain using ERC-721 tokens.

## Image Gallery
Here are some of the images:

| Image | Description |
|-------|-------------|
| <img src="https://github.com/nishant219/NFT_Collection/blob/bed5c0d4b8acf4eb797e2eac8fada1cc219fb021/my-app/public/cryptodevs/Screenshot%202023-08-16%20140824.png" alt="Image 1" height="150" width="300" /> | UI image |
| <img src="https://github.com/nishant219/NFT_Collection/blob/main/my-app/public/cryptodevs/code-CryptoDev.png" alt="Image 2" height="150" width="300" /> | Available functions |


## Smart Contract Details

The project's smart contract is developed using Solidity and leverages the OpenZeppelin library for ERC-721 token and access control features. The contract provides the following functionalities:

- Starting and ending presale periods.
- Whitelisting users for the presale.
- Minting NFTs during presale and after.
- Pausing and unpausing the contract.
- Withdrawing contract's Ether balance.

## Getting Started

1. Clone this repository.
2. Install the necessary dependencies using `npm install`.
3. Customize the deployment script in the `scripts` directory.
4. Configure the network settings in the `hardhat.config.js` file.
5. Run `npx hardhat compile` to compile the contracts.
6. Run `npx hardhat run scripts/deploy.js --network <networkName>` to deploy the contract.
7. Update the website and UI to interact with the deployed contract.

## Project Structure

- `contracts`: Contains the Solidity smart contract for the Crypto Devs NFTs.
- `scripts`: Contains deployment scripts and auxiliary scripts.
- `test`: Contains unit tests for the smart contract.
- `website`: Placeholder for the project's website/UI.

## Contributing

Contributions to the Crypto Devs NFT Collection are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Create a pull request to the main repository.

Contributions and feedback are welcome! If you find any issues or have suggestions for improvements, please feel free to submit a pull request or open an issue. Please follow the contribution guidelines.
Author : Nishant(@nishant219)
