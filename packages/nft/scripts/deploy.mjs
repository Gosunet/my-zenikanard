const nftContractFactory = await hre.ethers.getContractFactory('CryptoDuck');
const nftContract = await nftContractFactory.deploy();
await nftContract.deployed();
console.log("Contract deployed to:", nftContract.address);

const svg = "https://theduckgallery.zenika.com/ducks/JuliaLehoux.png"

// Call the function.
let txn = await nftContract.makeAnEpicNFT(svg)
// Wait for it to be mined.
await txn.wait()
console.log("Minted NFT #1")

txn = await nftContract.makeAnEpicNFT(svg)
// Wait for it to be mined.
await txn.wait()
console.log("Minted NFT #2")