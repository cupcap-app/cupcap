const EthCrypto = require("eth-crypto");
const { privateToAddress } = require("ethereumjs-util");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const wallet_name = process.argv[2];
const contractTxId = process.argv[3] || process.env.CONTRACT_TX_ID;
const name = process.env.NAME || "weavedb";
const version = process.env.VERSION || "1";
let privateKey = process.env.PRIVATE_KEY;
const { isNil } = require("ramda");
const WeaveDB = require("../sdk");

if (isNil(wallet_name)) {
  console.log("no wallet name given");
  process.exit();
}

if (isNil(contractTxId)) {
  console.log("contract not specified");
  process.exit();
}

const setup = async () => {
  const wallet_path = path.resolve(
    __dirname,
    ".wallets",
    `wallet-${wallet_name}.json`
  );
  if (!fs.existsSync(wallet_path)) {
    console.log("wallet doesn't exist");
    process.exit();
  }
  const wallet = JSON.parse(fs.readFileSync(wallet_path, "utf8"));
  console.log(wallet);
  const db = new WeaveDB({
    wallet,
    name,
    version,
    contractTxId,
    arweave: {
      host:
        wallet_name === "mainnet" ? "arweave.net" : "testnet.redstone.tools",
      port: 443,
      protocol: "https",
      timeout: 200000,
    },
  });

  console.log("set up WeaveDB..." + contractTxId);
  const schemas = {
    user_profile: {
      type: "object",
      required: ["account_address", "name"],
      properties: {
        user_address: {
          type: "string",
        },
        name: {
          type: "string",
        },
        email: {
          type: "string",
        },
        url: {
          type: "string",
        },
        avatar: {
          type: "string",
        },
        description: {
          type: "string",
        },
        notice: {
          type: "string",
        },
        keywords: {
          type: "string",
        },
        discord: {
          type: "string",
        },
        github: {
          type: "string",
        },
        reddit: {
          type: "string",
        },
        twitter: {
          type: "string",
        },
        telegram: {
          type: "string",
        },
      },
    },
  };
  // if (isNil(privateKey)) {
  //   const identity = EthCrypto.createIdentity();
  //   privateKey = identity.privateKey;
  // }
  // const addr = `0x${privateToAddress(
  //   Buffer.from(privateKey.replace(/^0x/, ""), "hex")
  // ).toString("hex")}`.toLowerCase();

  // await db.setSchema(schemas.user_profile, "user_profile", {
  //   privateKey,
  // });
  await db.setSchema(schemas.user_profile, "user_profile", { wallet });
  console.log("user_profile schema set!");

  const rules = {
    user_profile: {
      "allow create": {
        and: [
          { "!=": [{ var: "request.auth.signer" }, null] },
          {
            "==": [
              { var: "request.auth.signer" },
              { var: "resource.newData.user_address" },
            ],
          },
        ],
      },
      "allow delete": {
        "==": [
          { var: "request.auth.signer" },
          { var: "resource.newData.user_address" },
        ],
      },
    },
  };

  for (let k in rules) {
    await db.setRules(rules[k], k, {
      privateKey,
    });
    console.log(`${k} rules set!`);
  }

  process.exit();
};

setup();
