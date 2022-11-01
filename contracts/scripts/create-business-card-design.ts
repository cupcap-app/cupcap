import { ethers } from "hardhat";

const CUP_CAP_ADDRESS = process.env.CUPCAP_ADDRESS;

async function main() {
  const [account] = await ethers.getSigners();

  const cupCap = (await ethers.getContractFactory("CupCap")).attach(
    CUP_CAP_ADDRESS!
  );

  const tx = await cupCap.createBusinessCardDesign(
    // 名刺デザインのリソースが置いてあるURI (プレフィックス無し)
    "hoge"
  );

  await tx.wait();

  console.log(`Business Card Design Created hash=${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
