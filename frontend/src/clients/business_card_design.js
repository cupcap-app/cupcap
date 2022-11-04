import { ethers } from "ethers";

const BUSINESS_CARD_DESIGN_ABI = require("../abis/cupcap/BusinessCardDesign.sol/BusinessCardDesign.json");

const REACT_APP_BUSINESS_CARD_DESIGN_ADDRESS =
  process.env.REACT_APP_BUSINESS_CARD_DESIGN_ADDRESS;

// URI取得
export async function getDesignURI(provider, designID) {
  const businessCard = new ethers.Contract(
    REACT_APP_BUSINESS_CARD_DESIGN_ADDRESS,
    BUSINESS_CARD_DESIGN_ABI.abi,
    provider.getSigner()
  );

  return businessCard.uri(designID);
}

// URI取得
export async function hasCardDesign(provider, designID, account) {
  const businessCard = new ethers.Contract(
    REACT_APP_BUSINESS_CARD_DESIGN_ADDRESS,
    BUSINESS_CARD_DESIGN_ABI.abi,
    provider.getSigner()
  );

  return businessCard.hasCardDesign(designID, account);
}

// 選択しているデザインを取得する
export async function selectedDesign(provider, account) {
  const businessCard = new ethers.Contract(
    REACT_APP_BUSINESS_CARD_DESIGN_ADDRESS,
    BUSINESS_CARD_DESIGN_ABI.abi,
    provider.getSigner()
  );

  return businessCard.selectedDesignID(account);
}
