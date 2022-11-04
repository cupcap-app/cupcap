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
  await eventNFT.deployed();
  console.log(
    `deployed EventNFT address: ${eventNFT.address}, txHash: ${eventNFT.deployTransaction.hash}\n`
  );

  // BusinessCardDesign
  console.log("deploying BusinessCardDesign...");
  const BusinessCardDesignFactory = await ethers.getContractFactory(
    "BusinessCardDesign"
  );
  const businessCardDesign = await BusinessCardDesignFactory.deploy(
    STORAGE_BASE_URI
  );
  await businessCardDesign.deployed();
  console.log(
    `deployed BusinessCardDesign address: ${businessCardDesign.address}, txHash: ${businessCardDesign.deployTransaction.hash}\n`
  );

  // BusinessCard
  console.log("deploying BusinessCard...");
  const businessCardFactory = await ethers.getContractFactory("BusinessCard");
  const businessCard = await businessCardFactory.deploy();
  await businessCard.deployed();
  console.log(
    `deployed BusinessCard address: ${businessCard.address}, txHash: ${businessCard.deployTransaction.hash}\n`
  );

  // CuoCap
  console.log("deploying CupCap...");
  const cupCapFactory = await ethers.getContractFactory("CupCap");
  const cupCap = await cupCapFactory.deploy(
    eventNFT.address,
    businessCardDesign.address,
    businessCard.address
  );
  await cupCap.deployed();
  console.log(
    `deployed CupCap address: ${cupCap.address}, txHash: ${cupCap.deployTransaction.hash}\n`
  );

  // Move Owner
  console.log("Moving ownerships to CupCap\n");
  await (await poap.transferOwnership(eventNFT.address)).wait();
  await (await eventNFT.transferOwnership(cupCap.address)).wait();
  await (await businessCardDesign.transferOwnership(cupCap.address)).wait();
  await (await await businessCard.transferOwnership(cupCap.address)).wait();

  console.log("Setup is Done!!");
  console.log(`POAP: ${poap.address}`);
  console.log(`EventNFT: ${eventNFT.address}`);
  console.log(`BusinessCardDesign: ${businessCardDesign.address}`);
  console.log(`BusinessCard: ${businessCard.address}`);
  console.log(`CupCap: ${cupCap.address}`);

  console.log("");
  console.log("Please paste the following data to .env");

  console.log("");
  console.log(`CUPCAP_ADDRESS=${cupCap.address}`);
  console.log(`EVENT_NFT_ADDRESS=${eventNFT.address}`);
  console.log(`POAP_ADDRESS=${poap.address}`);
  console.log(`BUSINESS_CARD_DESIGN_ADDRESS=${businessCardDesign.address}`);
  console.log(`BUSINESS_CARD_ADDRESS=${businessCard.address}`);
  console.log("");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
