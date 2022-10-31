import { ethers } from "hardhat";

const BUSINESS_CARD_DESIGN_ADDRESS = process.env.BUSINESS_CARD_DESIGN_ADDRESS;
const DESIGN_ID = process.env.DESIGN_ID as string;

async function main() {
  const [account, target] = await ethers.getSigners();

  const cupCap = (await ethers.getContractFactory("BusinessCardDesign")).attach(
    BUSINESS_CARD_DESIGN_ADDRESS!
  );

  const tx = await cupCap
    .connect(target)
    .safeTransferFrom(
      target.address,
      account.address,
      DESIGN_ID,
      5,
      ethers.utils.toUtf8Bytes("")
    );

  await tx.wait();

  console.log(`Business Card Design Token Transferred hash=${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
