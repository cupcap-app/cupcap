import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";

require("dotenv").config();

const privateKeys = (
  process.env.PRIVATE_KEYS ??
  "0000000000000000000000000000000000000000000000000000000000000000"
).split(",");

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    ethereum: {
      url: process.env.JSONRPC_URL ?? "",
      accounts: [...privateKeys],
    },
    polygon: {
      url: process.env.JSONRPC_URL ?? "https://polygon-rpc.com/",
      accounts: [...privateKeys],
    },
    mumbai: {
      url: process.env.JSONRPC_URL ?? "https://rpc-mumbai.matic.today/",
      accounts: [...privateKeys],
    },
  },
  gasReporter: {
    currency: "EUR",
    gasPrice: 21,
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
    alwaysGenerateOverloads: false,
    externalArtifacts: ["externalArtifacts/*.json"],
  },
};

export default config;
