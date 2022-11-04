import { ethers } from "ethers";

const POAP_ABI = require("../abis/cupcap/POAP.sol/POAP.json");

const REACT_APP_POAP_ADDRESS = process.env.REACT_APP_POAP_ADDRESS;
const REACT_APP_BUSINESS_CARD_DESIGN_ADDRESS =
  process.env.REACT_APP_BUSINESS_CARD_DESIGN_ADDRESS;
const REACT_APP_BUSINESS_CARD_ADDRESS =
  process.env.REACT_APP_BUSINESS_CARD_ADDRESS;

// POAPを持っているか
export async function hasPOAP(provider, eventID, account) {
  const poap = new ethers.Contract(
    REACT_APP_POAP_ADDRESS,
    POAP_ABI.abi,
    provider.getSigner()
  );

  return poap.has(eventID, account);
}

// POAPのIDを返す、持っていない場合は0
export async function getID(provider, eventID, account) {
  const poap = new ethers.Contract(
    REACT_APP_POAP_ADDRESS,
    POAP_ABI.abi,
    provider.getSigner()
  );

  return poap.getID(eventID, account);
}

export async function poapURI(provider, eventID) {
  const poap = new ethers.Contract(
    REACT_APP_POAP_ADDRESS,
    POAP_ABI.abi,
    provider.getSigner()
  );

  return poap.tokenURI(eventID);
}
