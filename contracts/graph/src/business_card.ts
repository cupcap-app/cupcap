import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  TransferSingle,
  TransferBatch,
} from "../generated/BusinessCardDesign/BusinessCardDesign";
import { BusinessCard } from "../generated/schema";

function obtainBusinessCardEntity(
  from: Address,
  to: Address,
  tokenID: BigInt
): BusinessCard {
  const id = `${from.toHex()}:${to.toHex()}`;

  const card = BusinessCard.load(id);
  if (card) {
    return card;
  }

  const newCard = new BusinessCard(id);
  newCard.from = from;
  newCard.to = to;
  newCard.tokenID = tokenID;

  newCard.save();

  return newCard;
}

export function handleTransferSingle(e: TransferSingle): void {
  obtainBusinessCardEntity(e.params.operator, e.params.to, e.params.id);
}
