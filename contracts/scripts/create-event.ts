import { ethers } from "hardhat";

const CUP_CAP_ADDRESS = process.env.CUPCAP_ADDRESS;

async function main() {
  const [account] = await ethers.getSigners();

  const cupCap = (await ethers.getContractFactory("CupCap")).attach(
    CUP_CAP_ADDRESS!
  );

  const tx = await cupCap.createEvent(
    // 主催者のアドレス
    account.address,
    // イベント詳細が書かれたJSONが置いてあるURI
    "ipfs://event1",
    // 何人参加できるか
    10,
    // 開始時刻 (0の場合はブロック生成時間)
    Math.floor(new Date().getTime() / 1000) + 60,
    // 終了時刻
    // ミリ秒を秒に変える
    Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 * 7,
    // XXX: 今のところtrueにすると動かないです
    // ホストを作成時に参加させるか
    false
  );

  await tx.wait();

  console.log(`Event Created hash=${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
