import { ethers } from "hardhat";

const CUP_CAP_ADDRESS = process.env.CUPCAP_ADDRESS;

async function main() {
  const [_sender, target] = await ethers.getSigners();

  const cupCap = (await ethers.getContractFactory("CupCap")).attach(
    CUP_CAP_ADDRESS!
  );

  const tx = await cupCap.sendBusinessCard(
    // 受け取り主
    target.address
  );

  await tx.wait();

  console.log(`Business Card Minted hash=${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
