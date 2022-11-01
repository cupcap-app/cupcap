import { ethers } from "hardhat";

const CUP_CAP_ADDRESS = process.env.CUPCAP_ADDRESS;
const EVENT_ID = process.env.EVENT_ID ?? "0";

async function main() {
  const cupCap = (await ethers.getContractFactory("CupCap")).attach(
    CUP_CAP_ADDRESS!
  );

  const tx = await cupCap.participateEvent(EVENT_ID);

  await tx.wait();

  console.log(`Participated hash=${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
