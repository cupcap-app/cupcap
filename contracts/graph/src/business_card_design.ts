import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  DesignCreated,
  TransferSingle,
  TransferBatch,
} from "../generated/BusinessCardDesign/BusinessCardDesign";
import {
  BusinessCardDesign,
  BusinessCardDesignBalance,
} from "../generated/schema";

function getBusinessCardEDesignEntity(designID: BigInt): BusinessCardDesign {
  const id = designID.toHex();

  const design = BusinessCardDesign.load(id);
  if (design) {
    return design;
  }

  return new BusinessCardDesign(id);
}

function getBusinessCardDesignBalanceEntity(
  tokenID: BigInt,
  account: Address
): BusinessCardDesignBalance {
  const id = `${tokenID.toHex()}_${account.toHex()}`;

  const balance = BusinessCardDesignBalance.load(id);
  if (balance) {
    return balance;
  }

  const newBalance = new BusinessCardDesignBalance(id);
  newBalance.amount = BigInt.zero();
  newBalance.token = tokenID;
  newBalance.holder = account;

  return newBalance;
}

export function handleDesignCreated(e: DesignCreated): void {
  const design = getBusinessCardEDesignEntity(e.params.designID);

  design.uri = e.params.uri;

  design.save();
}

function updateBalance(tokenID: BigInt, account: Address, diff: BigInt): void {
  const balance = getBusinessCardDesignBalanceEntity(tokenID, account);

  balance.amount = balance.amount.plus(diff);

  balance.save();
}

export function handleTransferSingle(e: TransferSingle): void {
  if (e.params.from.notEqual(Address.zero())) {
    updateBalance(e.params.id, e.params.from, e.params.value.neg());
  }

  if (e.params.to.notEqual(Address.zero())) {
    updateBalance(e.params.id, e.params.to, e.params.value);
  }
}

export function handleTransferBatch(e: TransferBatch): void {
  for (let i = 0; i < e.params.ids.length; i++) {
    const id = e.params.ids.at(i);
    const value = e.params.values.at(i);

    if (e.params.from.notEqual(Address.zero())) {
      updateBalance(id, e.params.from, value.neg());
    }

    if (e.params.to.notEqual(Address.zero())) {
      updateBalance(id, e.params.to, value);
    }
  }
}
