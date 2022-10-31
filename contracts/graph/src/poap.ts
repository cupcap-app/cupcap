import { BigInt } from "@graphprotocol/graph-ts";
import { Issued } from "../generated/POAP/POAP";
import { POAP } from "../generated/schema";

function getPOAPEntiry(eventID: BigInt, poapIndex: BigInt): POAP {
  const id = `${eventID.toString()}_${poapIndex.toString()}`;

  const poap = POAP.load(id);
  if (poap) {
    return poap;
  }

  return new POAP(id);
}

export function handleIssued(e: Issued): void {
  const poap = getPOAPEntiry(e.params.eventID, e.params.index);

  poap.eventID = e.params.eventID;
  poap.holder = e.params.account;
  poap.index = e.params.index;

  poap.save();
}
