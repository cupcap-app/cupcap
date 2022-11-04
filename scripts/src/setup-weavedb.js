const EthCrypto = require("eth-crypto");
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const WeaveDB = require("weavedb-sdk");
const { isNil } = require("ramda");

const PROFILE_TABLE_NAME = "profile";
const PROFILE_SCHEMA = require("../../schemas/weavedb_profile_schema.json");
const PROFILE_RULE = require("../../schemas/weavedb_profile_rule.json");

const MAINET_HOST = "arweave.net";
const TESTNET_HOST = "testnet.redstone.tools";

const relativeWalletPath = process.argv[2];
const contractTxId = process.argv[3];

if (isNil(relativeWalletPath)) {
  console.error("wallet path is not specified in first argument");

  process.exit();
}

if (isNil(contractTxId)) {
  console.error("contract tx id is not specified in second argument");

  process.exit();
}

const setup = async () => {
  const walletPath = path.resolve(__dirname, relativeWalletPath);

  console.log("walletPath", walletPath);

  if (!fs.existsSync(walletPath)) {
    console.error("wallet doesn't exist");

    process.exit();
  }

  const wallet = JSON.parse(fs.readFileSync(walletPath, "utf8"));
  const sdk = new WeaveDB({
    wallet,
    name: "weavedb",
    version: "1",
    contractTxId,
    arweave: {
      host: MAINET_HOST,
      port: 443,
      protocol: "https",
      timeout: 200000,
    },
  });

  console.log(`connecting WeaveDB @ ${contractTxId}`);

  const identity = EthCrypto.createIdentity();

  await sdk.setSchema(PROFILE_SCHEMA, PROFILE_TABLE_NAME, {
    privateKey: identity.privateKey,
  });

  console.log(`${PROFILE_TABLE_NAME} schema has been set`);

  await sdk.setRules(PROFILE_RULE, PROFILE_TABLE_NAME, {
    privateKey: identity.privateKey,
  });

  console.log(`${PROFILE_TABLE_NAME} rule has been set`);
  console.log("exit");

  process.exit();
};

setup();
