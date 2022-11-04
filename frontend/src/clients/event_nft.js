import { ethers } from "ethers";

const EVENT_NFT_ABI = require("../abis/cupcap/EventNFT.sol/EventNFT.json");

const REACT_APP_EVENT_NFT_ADDRESS = process.env.REACT_APP_EVENT_NFT_ADDRESS;
const REACT_APP_BUSINESS_CARD_ADDRESS =
  process.env.REACT_APP_BUSINESS_CARD_ADDRESS;

export async function eventURI(provider, eventID) {
  const eventNFT = new ethers.Contract(
    REACT_APP_EVENT_NFT_ADDRESS,
    EVENT_NFT_ABI.abi,
    provider.getSigner()
  );

  return eventNFT.tokenURI(eventID);
}
