const nftContractFactory = await hre.ethers.getContractFactory('CryptoDuck');
const nftContract = await nftContractFactory.deploy();
await nftContract.deployed();
console.log("Contract deployed to:", nftContract.address);

// Call the function.
let txn = await nftContract.makeAnEpicNFT()
// Wait for it to be mined.
await txn.wait()

// Mint another NFT for fun.
txn = await nftContract.makeAnEpicNFT()
// Wait for it to be mined.
await txn.wait()