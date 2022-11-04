import { ethers } from "ethers";

const BUSINESS_CARD_ABI = require("../abis/cupcap/BusinessCard.sol/BusinessCard.json");

const REACT_APP_BUSINESS_CARD_ADDRESS =
  process.env.REACT_APP_BUSINESS_CARD_ADDRESS;

// ユーザのアカウントIDを取得する
export async function getBusinessCardID(provider, account) {
  const businessCard = new ethers.Contract(
    REACT_APP_BUSINESS_CARD_ADDRESS,
    BUSINESS_CARD_ABI.abi,
    provider.getSigner()
  );

  return businessCard.tokenID(account);
}

// ユーザのURIを返す
export async function getBusinessCardURI(provider, cardID) {
  const businessCard = new ethers.Contract(
    REACT_APP_BUSINESS_CARD_ADDRESS,
    BUSINESS_CARD_ABI.abi,
    provider.getSigner()
  );

  return businessCard.uri(cardID);
}
