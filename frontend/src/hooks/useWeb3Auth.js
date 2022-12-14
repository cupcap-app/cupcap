import { createContext, useContext, useEffect, useState } from "react";
import { ADAPTER_EVENTS, WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { ethers } from "ethers";
import { ENS } from "@ensdomains/ensjs";

const ENS_REGISTRAR_ABI = require("../abis/ens/ethregistrar/ETHRegistrarController.sol/ETHRegistrarController.json");
const ENS_RESOLVER_ABI = require("../abis/ens/resolvers/Resolver.sol/Resolver.json");
const ENS_REVERSE_REGISTRAR = require("../abis/ens/registry/ReverseRegistrar.sol/ReverseRegistrar.json");
// import logo from "../public/logo.svg";

const CHAIN_CONFIGS = {
  ethereum: {
    mainnet: {
      chainName: "Ethereum",
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x1",
      rpcTarget:
        "https://eth-mainnet.g.alchemy.com/v2/Oa1UzWKEbhz_YAxLvActoqF2LTw4Bw1X",
    },
    testnet: {
      chainName: "Goerli",
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x5",
      rpcTarget:
        "https://eth-goerli.g.alchemy.com/v2/h-Piz66AMei2-elN93bLUjABX8h9Te9O",
    },
  },
  polygon: {
    mainnet: {
      chainName: "Polygon",
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x89",
      rpcTarget:
        "https://polygon-mainnet.g.alchemy.com/v2/FZXJbHdVFXf2wu9I4WJYVZxvrOeBGMxe",
    },
    testnet: {
      chainName: "Mumbai",
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x13881",
      rpcTarget:
        "https://polygon-mumbai.g.alchemy.com/v2/NiZJ0o9MX5coiRnbhET0fGQPjayiZrvc",
    },
  },
};

export const Web3AuthContext = createContext({
  web3Auth: null,
  provider: null,
  web3AuthUser: null,
  chain: "",
  setChain: () => {},
  walletAddress: null,
  ensName: null,
  ensTextRecord: {},
  login: async () => {},
  logout: async () => {},
  getNetwork: async () => {},
  changeNetwork: async () => {},
  getAccount: async () => {},
  signMessage: async () => {},
  getBalance: async () => {},
  getPrivateKey: async () => {},
  registerEnsName: async () => {},
  isInitializing: false,
});

export const useWeb3Auth = () => {
  return useContext(Web3AuthContext);
};

export const Web3AuthProvider = ({ children }) => {
  const [web3Auth, setWeb3Auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3AuthUser, setWeb3AuthUser] = useState(null);
  const [chain, setChain] = useState("polygon");
  const [walletAddress, setWalletAddress] = useState(null);
  const [ensInstance, setEnsInstance] = useState(null);
  const [ensTextRecord, setEnsTextRecord] = useState({
    email: "",
    url: "",
    avatar: "",
    description: "",
    notice: "",
    keywords: "",
    discord: "",
    github: "",
    reddit: "",
    twitter: "",
    telegram: "",
  });
  const [ensName, setEnsName] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // web3auth????????????????????????
  const subscribeAuthEvents = (web3Auth) => {
    web3Auth.on(ADAPTER_EVENTS.CONNECTED, async (data) => {
      console.log("web3Auth:", web3Auth);
      setWeb3Auth(web3Auth);
      console.log("web3AuthUser:", data);
      setWeb3AuthUser(data);
      const newProvider = new ethers.providers.Web3Provider(
        web3Auth.provider,
        "any"
      );
      console.log("Provider:", newProvider);
      setProvider(newProvider);
    });

    web3Auth.on(ADAPTER_EVENTS.CONNECTING, () => {
      console.log("connecting");
    });
    web3Auth.on(ADAPTER_EVENTS.ADAPTER_DATA_UPDATED, () => {
      console.log("adapter data updated");
    });
    web3Auth.on(ADAPTER_EVENTS.NOT_READY, () => {
      console.log("not ready");
    });
    web3Auth.on(ADAPTER_EVENTS.READY, () => {
      console.log("ready");
    });

    web3Auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
      console.log("disconnected");
      setWeb3AuthUser(null);
      setProvider(null);
      setWalletAddress(null);
      setEnsName(null);
    });

    web3Auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
      console.error("some error or user has cancelled login request", error);
    });
  };

  /**
   * web3auth ???????????????
   */
  const initWeb3Auth = async () => {
    try {
      console.log(process.env.REACT_APP_WEB3AUTH_CLIENT_ID);
      console.log(CHAIN_CONFIGS["polygon"][process.env.REACT_APP_NETWORK]);
      const web3Auth = new Web3Auth({
        clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID,
        chainConfig: CHAIN_CONFIGS["polygon"][process.env.REACT_APP_NETWORK],
        uiConfig: {
          theme: "dark",
          // TODO ????????????
          //   appLogo: logo,
        },
      });

      // OpenAPI
      web3Auth.configureAdapter(
        new OpenloginAdapter({
          adapterSettings: {
            clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID,
            network: "mainnet",
            uxMode: "popup",
            whiteLabel: {
              name: "CupCap",
              defaultLanguage: "ja",
              dark: true,
            },
          },
        })
      );

      subscribeAuthEvents(web3Auth);

      await web3Auth.initModal();
      setWeb3Auth(web3Auth);

      return web3Auth;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  /**
   * ENS ???????????????
   */
  const initEns = async (walletAddress) => {
    console.log("initEns::walletAddress", walletAddress);
    const ethProvider = new ethers.providers.JsonRpcProvider(
      // TODO: set in .env
      // "https://eth-mainnet.g.alchemy.com/v2/Oa1UzWKEbhz_YAxLvActoqF2LTw4Bw1X"
      "https://eth-goerli.g.alchemy.com/v2/h-Piz66AMei2-elN93bLUjABX8h9Te9O"
    );

    const ENSInstance = new ENS();
    await ENSInstance.setProvider(ethProvider);

    setEnsInstance(ENSInstance);

    console.log("getAddr", await ENSInstance.getAddr("fugafugapiyohoge.eth"));

    console.log(
      "fugafugapiyohoge",
      await ENSInstance.getProfile("fugafugapiyohoge.eth")
    );

    const ensName = (
      await ENSInstance.batch(ENSInstance.getName.batch(walletAddress))
    )[0].name;

    console.log("ensName", ensName);

    if (ensName) {
      const ensTextRecord = await ENSInstance.batch(
        ENSInstance.getText.batch(ensName, "email"),
        ENSInstance.getText.batch(ensName, "url"),
        ENSInstance.getText.batch(ensName, "avatar"),
        ENSInstance.getText.batch(ensName, "description"),
        ENSInstance.getText.batch(ensName, "notice"),
        ENSInstance.getText.batch(ensName, "keywords"),
        ENSInstance.getText.batch(ensName, "com.discord"),
        ENSInstance.getText.batch(ensName, "com.github"),
        ENSInstance.getText.batch(ensName, "com.reddit"),
        ENSInstance.getText.batch(ensName, "com.twitter"),
        ENSInstance.getText.batch(ensName, "org.telegram")
      );

      console.log("ensTextRecord", ensTextRecord);

      setEnsTextRecord({
        email: ensTextRecord[0],
        url: ensTextRecord[1],
        avatar: ensTextRecord[2],
        description: ensTextRecord[3],
        notice: ensTextRecord[4],
        keywords: ensTextRecord[5],
        discord: ensTextRecord[6],
        github: ensTextRecord[7],
        reddit: ensTextRecord[8],
        twitter: ensTextRecord[9],
        telegram: ensTextRecord[10],
      });
    }

    return ensName;
  };

  // web3auth?????????
  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      await initWeb3Auth();
      setIsInitializing(false);
    };
    init();
  }, []);

  // wallet address????????????
  useEffect(() => {
    if (!provider) {
      return;
    }
    console.log(provider);
    const updateWalletAddress = async () => {
      const account = await getAccount();
      const ensName = await initEns(account);
      setWalletAddress(account);
      setEnsName(ensName ? ensName : "");
    };
    updateWalletAddress();
  }, [provider]);

  const login = async () => {
    if (!web3Auth) {
      console.log("web3Auth not initialized yet");
      return;
    }
    const connecter = await web3Auth.connect();
    const newProvider = new ethers.providers.Web3Provider(connecter, "any");
    setProvider(newProvider);
  };

  const logout = async () => {
    if (!web3Auth) {
      console.log("web3Auth not initialized yet");
      return;
    }
    await web3Auth.logout();
    setProvider(null);
  };

  const getNetwork = async () => {
    if (!web3Auth) {
      console.log("web3Auth not initialized yet");
      return;
    }
    return (await provider.getNetwork()).chainId;
  };

  const changeNetwork = async (newChain) => {
    console.log(
      `${CHAIN_CONFIGS[chain][process.env.REACT_APP_NETWORK].chainName} -> ${
        CHAIN_CONFIGS[newChain][process.env.REACT_APP_NETWORK].chainName
      }`
    );

    if (web3AuthUser.adapter === "openlogin") {
      const privateKey = await web3Auth.provider.request({
        method: "eth_private_key",
      });
      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: {
          chainConfig: CHAIN_CONFIGS[newChain][process.env.REACT_APP_NETWORK],
        },
      });
      await privateKeyProvider.setupProvider(privateKey);
      const newProvider = new ethers.providers.Web3Provider(
        privateKeyProvider.provider,
        "any"
      );
      setProvider(newProvider);
      setChain(newChain);

      return { provider: newProvider, chain: newChain };
    } else {
      try {
        // here web3auth provider is the provider you get after user login with web3auth.
        await web3Auth.provider.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId:
                CHAIN_CONFIGS[newChain][process.env.REACT_APP_NETWORK].chainId,
            },
          ],
        });

        setChain(newChain);

        return { provider: provider, chain: newChain };
      } catch (switchError) {
        console.log(switchError);
        // This error code indicates that the chain has not been added to web3auth.
        if (switchError.code === 4902) {
          // TODO add network code
          // try {
          //   await web3Auth.provider.request({
          //     method: "wallet_addEthereumChain",
          //     params: [
          //       {
          //         chainId: "0x5",
          //         chainName: "...",
          //         rpcUrls: ["https://..."] /* ... */,
          //       },
          //     ],
          //   });
          // } catch (addError) {
          //   // handle "add" error
          // }
          console.log(
            "please add network " +
              CHAIN_CONFIGS[newChain][process.env.REACT_APP_NETWORK].chainName
          );
        }
        // handle other "switch" errors
      }
    }
  };

  const getAccount = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const signer = provider.getSigner();
    return await signer.getAddress();
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const address = await getAccount();
    const balance = ethers.utils.formatEther(
      await provider.getBalance(address) // Balance is in wei
    );
    return balance;
  };

  const signMessage = async ({ message }) => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const signer = provider.getSigner();
    return await signer.signMessage(message);
  };

  const getPrivateKey = async () => {
    if (!web3Auth) {
      console.log("provider not initialized yet");
      return;
    }
    try {
      const privateKey = await web3Auth.provider.request({
        method: "eth_private_key",
      });
      return privateKey;
    } catch (error) {
      console.error("Error", error);
    }
  };

  const registerEnsName = async (name) => {
    // if (!web3Auth || !ensInstance) {
    //   console.log("provider not initialized yet");
    //   return;
    // }
    // if (name.endsWith(".ens")) {
    //   name = name.substring(0, name.length - ".ens".length);
    // }
    // console.log(`registerENSName::domain=${name}`);
    // const { provider = null } = (await changeNetwork("ethereum")) ?? {};
    // console.log("registerENSName::changed to ethereum, new provider", provider);
    // if (!provider) {
    //   console.log("failed to changeNetwork");
    //   return;
    // }
    // const network = await provider.getNetwork();
    // console.log("registerEnsName::network", network);
    // const {
    //   registrar: registrarAddress,
    //   resolver: resolverAddress,
    //   reverseRegistrar: reverseRegistrarAddress,
    // } = ensContractAddressMap[network.name] ?? {};
    // console.log("registerEnsName::registrarAddress", registrarAddress);
    // console.log("registerEnsName::resolverAddress", resolverAddress);
    // console.log(
    //   "registerEnsName::reverseRegistrarAddress",
    //   reverseRegistrarAddress
    // );
    // console.log("registerEnsName::ENS_REGISTRAR_ABI", ENS_REGISTRAR_ABI.abi);
    // const signer = provider.getSigner();
    // console.log("registerEnsName::signer", signer);
    // const registrar = new ethers.Contract(
    //   registrarAddress,
    //   ENS_REGISTRAR_ABI.abi,
    //   signer
    // );
    // const valid = await registrar.valid(name);
    // if (!valid) {
    //   throw new Error("ens domain is not valid");
    // }
    // const available = await registrar.available(name);
    // if (!available) {
    //   throw new Error("ens domain is not available");
    // }
    // // 1. commitment phase
    // const randomValue = ethers.utils.randomBytes(32);
    // const secret =
    //   "0x" +
    //   Array.from(randomValue)
    //     .map((b) => b.toString(16).padStart(2, "0"))
    //     .join("");
    // const ownerAddress = await signer.getAddress();
    // // XXX: ???????????????3??????
    // const duration = Math.floor(getOneYearInSeconds() / 4);
    // console.log("registerEnsName::ownerAddress", ownerAddress);
    // console.log("registerEnsName::duration", duration);
    // console.log("registerEnsName::secret", secret);
    // const commitment = await registrar.makeCommitmentWithConfig(
    //   // name
    //   name,
    //   // owner
    //   ownerAddress,
    //   // secret
    //   secret,
    //   // resolver (public resolve)
    //   resolverAddress,
    //   // address (????????????????????????????????????)
    //   ownerAddress
    // );
    // console.log("registerEnsName::commitment", commitment);
    // const commitTx = await registrar.commit(commitment);
    // console.log("registerEnsName::commitTx", commitTx);
    // const commitTxResult = await commitTx.wait();
    // console.log("registerEnsName::commitTxResult", commitTxResult);
    // // 2. commit??????????????????1???????????????
    // // wait 1 min
    // await new Promise((resolve) => {
    //   setTimeout(resolve, 1000 * 60);
    // });
    // console.log("1 min has passed");
    // // 3. ??????
    // // ??????????????????
    // const value = await registrar.rentPrice(name, duration);
    // console.log("registerEnsName::value", value);
    // const registerTx = await registrar.registerWithConfig(
    //   // name
    //   name,
    //   // owner
    //   ownerAddress,
    //   // duration
    //   duration,
    //   // secret
    //   secret,
    //   // resolver (public resolve)
    //   resolverAddress,
    //   // address
    //   ownerAddress,
    //   {
    //     value: value,
    //   }
    // );
    // console.log("registerEnsName::registerTx", registerTx);
    // const registerTxResult = await registerTx.wait();
    // console.log("registerEnsName::registerTxResult", registerTxResult);
    // // 4. ??????????????????
    // const reverseRegistrar = new ethers.Contract(
    //   reverseRegistrarAddress,
    //   ENS_REVERSE_REGISTRAR.abi,
    //   signer
    // );
    // const reverseRegisterTx = await reverseRegistrar.setName(name);
    // console.log("registerEnsName::reverseRegisterTx", reverseRegisterTx);
    // const reverseRegisterResult = await reverseRegisterTx.wait();
    // console.log(
    //   "registerEnsName::reverseRegisterResult",
    //   reverseRegisterResult
    // );
    // console.log("registerEnsName::done");
  };

  const contextProvider = {
    web3Auth,
    provider,
    web3AuthUser,
    chain,
    setChain,
    walletAddress,
    ensName,
    ensTextRecord,
    login,
    logout,
    getNetwork,
    changeNetwork,
    getAccount,
    getBalance,
    signMessage,
    getPrivateKey,
    registerEnsName,
    isInitializing,
  };
  return (
    <Web3AuthContext.Provider value={contextProvider}>
      {children}
    </Web3AuthContext.Provider>
  );
};
