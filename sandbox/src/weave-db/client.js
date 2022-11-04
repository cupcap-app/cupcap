import client from "weavedb-client";

const configuration = {
  name: "weavedb",
  version: "1",
  contractTxId: process.env.REACT_APP_WEAVE_DB_CONTRACT_TX_ID,
  rpc: process.env.REACT_APP_WEAVE_DB_RPC_URL,
};

console.log("[DEBUG] WeaveDB client configuration", configuration);

export const db = new client(configuration);
