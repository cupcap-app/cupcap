import { ethers } from "hardhat";

const STORAGE_BASE_URI = "ipfs://";

async function main() {
  // POAP
  console.log("deploying POAP ...");
  const poapFactory = await ethers.getContractFactory("POAP");
  const poap = await poapFactory.deploy();
  await poap.deployed();
  console.log(
    `deployed POAP address: ${poap.address}, txHash: ${poap.deployTransaction.hash}\n`
  );

  // EventNFT
  console.log("deploying EventNFT ...");
  const eventNFTFactory = await ethers.getContractFactory("EventNFT");
  const eventNFT = await eventNFTFactory.deploy(poap.address);
  console.log(
    `deployed EventNFT address: ${eventNFT.address}, txHash: ${eventNFT.deployTransaction.hash}\n`
  );

  // BusinessCardDeign
  console.log("deploying BusinessCardDeign...");
  const businessCardDeignFactory = await ethers.getContractFactory(
    "BusinessCardDeign"
  );
  const businessCardDeign = await businessCardDeignFactory.deploy(
    STORAGE_BASE_URI
  );
  console.log(
    `deployed BusinessCardDeign address: ${businessCardDeign.address}, txHash: ${businessCardDeign.deployTransaction.hash}\n`
  );

  // BusinessCard
  console.log("deploying BusinessCard...");
  const businessCardFactory = await ethers.getContractFactory("BusinessCard");
  const businessCard = await businessCardFactory.deploy();
  console.log(
    `deployed BusinessCard address: ${businessCard.address}, txHash: ${businessCard.deployTransaction.hash}\n`
  );

  // CuoCap
  console.log("deploying CupCap...");
  const cupCapFactory = await ethers.getContractFactory("CupCap");
  const cupCap = await cupCapFactory.deploy(
    eventNFT.address,
    businessCardDeign.address,
    businessCard.address
  );
  console.log(
    `deployed CupCap address: ${cupCap.address}, txHash: ${cupCap.deployTransaction.hash}\n`
  );

  // Move Owner
  console.log("Moving ownerships to CupCap\n");
  await poap.transferOwnership(cupCap.address);
  await eventNFT.transferOwnership(cupCap.address);
  await businessCardDeign.transferOwnership(cupCap.address);
  await businessCard.transferOwnership(cupCap.address);

  console.log("Setup is Done!!");
  console.log(`POAP: ${poap.address}`);
  console.log(`EventNFT: ${eventNFT.address}`);
  console.log(`BusinessCardDeign: ${businessCardDeign.address}`);
  console.log(`BusinessCard: ${businessCard.address}`);
  console.log(`CupCap: ${cupCap.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
