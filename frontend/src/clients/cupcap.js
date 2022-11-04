import { ethers } from "ethers";

const CUPCAP_ABI = require("../abis/cupcap/CupCap.sol/CupCap.json");
const CUPCAP_ADDRESS = process.env.REACT_APP_CUPCAP_ADDRESS;

export async function createEvent(
  provider,
  hostAddress, // 主催者アドレス
  resourceURL, // イベントの詳細が書かれたリソースのURI
  limitOfParticipants, // 参加者の上限
  startedAt, // 開始時刻 (秒)
  endedAt, // 終了時刻 (秒)
  shouldHostInclude // 主催者を参加者として追加するか
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.createEvent(
    hostAddress,
    resourceURL,
    limitOfParticipants,
    startedAt,
    endedAt,
    shouldHostInclude
  );

  const res = await tx.wait();

  return res;
}

// 特定のERC20トークン保有者のみが参加できるイベントを作成
export async function createEventForERC20Holder(
  provider,
  hostAddress, // 主催者アドレス
  resourceURL, // イベントの詳細が書かれたリソースのURI
  limitOfParticipants, // 参加者の上限
  startedAt, // 開始時刻 (秒)
  endedAt, // 終了時刻 (秒)
  shouldHostInclude, // 主催者を参加者として追加するか
  tokenAddress // 該当のERC20コントラクトアドレス
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.createEventForERC20Holder(
    hostAddress,
    resourceURL,
    limitOfParticipants,
    startedAt,
    endedAt,
    shouldHostInclude,
    tokenAddress
  );

  const res = await tx.wait();

  return res;
}

// 特定のERC721トークン保有者のみが参加できるイベントを作成
export async function createEventForERC721Holder(
  provider,
  hostAddress, // 主催者アドレス
  resourceURL, // イベントの詳細が書かれたリソースのURI
  limitOfParticipants, // 参加者の上限
  startedAt, // 開始時刻 (秒)
  endedAt, // 終了時刻 (秒)
  shouldHostInclude, // 主催者を参加者として追加するか
  tokenAddress // 該当のERC721コントラクトアドレス
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.createEventForERC721Holder(
    hostAddress,
    resourceURL,
    limitOfParticipants,
    startedAt,
    endedAt,
    shouldHostInclude,
    tokenAddress
  );

  const res = await tx.wait();

  return res;
}

// 特定のERC1155内の特定トークン保有者のみが参加できるイベントを作成
export async function createEventForERC1155Holder(
  provider,
  hostAddress, // 主催者アドレス
  resourceURL, // イベントの詳細が書かれたリソースのURI
  limitOfParticipants, // 参加者の上限
  startedAt, // 開始時刻 (秒)
  endedAt, // 終了時刻 (秒)
  shouldHostInclude, // 主催者を参加者として追加するか
  tokenAddress, // 該当のERC1155コントラクトアドレス
  tokenID // ERC1155内のトークンを識別するID
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.createEventForERC1155Holder(
    hostAddress,
    resourceURL,
    limitOfParticipants,
    startedAt,
    endedAt,
    shouldHostInclude,
    tokenAddress,
    tokenID
  );

  const res = await tx.wait();

  return res;
}

// 過去の特定のイベントに参加したことがある人のみ参加可能なイベントを作成
export async function createEventForPastParticipant(
  provider,
  hostAddress, // 主催者アドレス
  resourceURL, // イベントの詳細が書かれたリソースのURI
  limitOfParticipants, // 参加者の上限
  startedAt, // 開始時刻 (秒)
  endedAt, // 終了時刻 (秒)
  shouldHostInclude, // 主催者を参加者として追加するか
  eventID // CupcapのイベントID
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.createEventForPastParticipant(
    hostAddress,
    resourceURL,
    limitOfParticipants,
    startedAt,
    endedAt,
    shouldHostInclude,
    eventID
  );

  const res = await tx.wait();

  return res;
}

// 指定のイベントに参加登録する
export async function participateEvent(
  provider,
  eventID // イベントID
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.participateEvent(eventID);

  const res = await tx.wait();

  return res;
}

// ホストが特定のアカウントをイベントに参加登録する
export async function participateEventByHost(
  provider,
  eventID, // イベントID
  account // 対象のアカウント
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.participateEventByHost(eventID, account);

  const res = await tx.wait();

  return res;
}

// 指定のイベントに参加する
export async function attendEvent(
  provider,
  eventID // イベントID
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.attendEvent(eventID);

  const res = await tx.wait();

  return res;
}

// ホストが特定のアカウントをイベントに追加する
export async function attendEventByHost(
  provider,
  eventID, // イベントID
  account // 対象アカウント
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.attendEventByHost(eventID, account);

  const res = await tx.wait();

  return res;
}

// 新しいデザインを登録する
// XXX: とりあえず使わなくてもいいかも？
export async function createBusinessCardDesign(
  provider,
  resourceURI // 名刺デザインのURI
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.createBusinessCardDesign(resourceURI);

  const res = await tx.wait();

  return res;
}

// デザイントークンを新規発行する
// XXX: とりあえず使わなくてもいいかも？
export async function mintDesignToken(
  provider,
  to, // 送信先
  designID, // デザインID
  number // 数量
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.mintDesignToken(to, designID, number);

  const res = await tx.wait();

  return res;
}

// 使用するデザインを選択する
// XXX: とりあえず使わなくてもいいかも？
export async function selectDesign(
  provider,
  designID // デザインID
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.selectDesign(designID);

  const res = await tx.wait();

  return res;
}

// 名刺のリソースURIを指定する
// XXX: とりあえず使わなくてもいいかも？
// ex. ipfs://[hash]
//     ens://domain
export async function setBusinessCardResource(
  provider,
  resourceURI // デザインID
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.setBusinessCardResource(resourceURI);

  const res = await tx.wait();

  return res;
}

// 名刺を送る
export async function sendBusinessCard(
  provider,
  recipient // 受け取り主
) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.sendBusinessCard(recipient);

  const res = await tx.wait();

  return res;
}

// 名刺を受け取る, 受取人がコストを支払う
// 署名のもとのテキスト: [from,to]
export async function takeBusinessCard(provider, from, signature) {
  const cupcap = new ethers.Contract(
    CUPCAP_ADDRESS,
    CUPCAP_ABI.abi,
    provider.getSigner()
  );

  const tx = await cupcap.takeBusinessCard(from, signature);

  const res = await tx.wait();

  return res;
}
