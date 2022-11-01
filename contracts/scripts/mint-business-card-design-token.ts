import { ethers } from "hardhat";

const CUP_CAP_ADDRESS = process.env.CUPCAP_ADDRESS;
const DESIGN_ID = process.env.DESIGN_ID as string;

async function main() {
  const [account, target] = await ethers.getSigners();

  const cupCap = (await ethers.getContractFactory("CupCap")).attach(
    CUP_CAP_ADDRESS!
  );

  const tx = await cupCap.mintDesignToken(
    // 受け取り主
    target.address,
    // デザインID
    DESIGN_ID,
    // 量
    10
  );

  await tx.wait();

  console.log(`Business Card Design Token Minted hash=${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
