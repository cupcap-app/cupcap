const fs = require("fs")
const path = require("path")
const Arweave = require("arweave")
const wallet_name = process.argv[2]
const contractTxIdIntmax = process.argv[3]
const { isNil } = require("ramda")
const {
  PstContract,
  PstState,
  Warp,
  WarpNodeFactory,
  LoggerFactory,
  InteractionResult,
} = require("warp-contracts")

if (isNil(wallet_name)) {
  console.log("no wallet name given")
  process.exit()
}

let warp, walletAddress, arweave, wallet

async function deployContract(secure) {
  const contractSrc = fs.readFileSync(
    path.join(__dirname, "../dist/contracts/contract.js"),
    "utf8"
  )

  const stateFromFile = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../dist/contracts/initial-state.json"),
      "utf8"
    )
  )

  const initialState = {
    ...stateFromFile,
    ...{
      owner: walletAddress,
    },
  }
  initialState.contracts.intmax = contractTxIdIntmax
  const res = await warp.createContract.deploy(
    {
      wallet,
      initState: JSON.stringify(initialState),
      src: contractSrc,
    },
    wallet_name === "mainnet"
  )
  console.log("deployed WeaveDB contract")
  console.log(res)
  return res.contractTxId
}

const deploy = async () => {
  arweave = Arweave.init({
    host: wallet_name === "mainnet" ? "arweave.net" : "testnet.redstone.tools",
    port: 443,
    protocol: "https",
  })
  LoggerFactory.INST.logLevel("error")
  warp = WarpNodeFactory.memCachedBased(arweave).useWarpGateway().build()
  const wallet_path = path.resolve(
    __dirname,
    ".wallets",
    `wallet-${wallet_name}.json`
  )

  if (!fs.existsSync(wallet_path)) {
    console.log("wallet doesn't exist")
    process.exit()
  }
  wallet = JSON.parse(fs.readFileSync(wallet_path, "utf8"))
  walletAddress = await arweave.wallets.jwkToAddress(wallet)
  await deployContract(true)
  process.exit()
}

deploy()
