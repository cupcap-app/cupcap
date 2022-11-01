import { createContext, useContext, useEffect, useState } from "react";
import { ADAPTER_EVENTS, WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { ethers } from "ethers";
import { ENS } from "@ensdomains/ensjs";
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

  // web3authイベントリスナー
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
   * web3auth 初期化処理
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
          // TODO ロゴ設定
          //   appLogo: logo,
        },
      });
      const openloginAdapter = new OpenloginAdapter({
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
      });
      web3Auth.configureAdapter(openloginAdapter);

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
   * ENS 初期化処理
   */
  const initEns = async (walletAddress) => {
    const ethProvider = new ethers.providers.JsonRpcProvider(
      "https://eth-mainnet.g.alchemy.com/v2/Oa1UzWKEbhz_YAxLvActoqF2LTw4Bw1X"
      // "https://eth-goerli.g.alchemy.com/v2/h-Piz66AMei2-elN93bLUjABX8h9Te9O"
    );
    const ENSInstance = new ENS();
    await ENSInstance.setProvider(ethProvider);
    setEnsInstance(ENSInstance);
    const ensName = (
      await ENSInstance.batch(ENSInstance.getName.batch(walletAddress))
    )[0].name;
    console.log(ensName);
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
      console.log(ensTextRecord);
    }

    return ensName;
  };

  // web3auth初期化
  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      await initWeb3Auth();
      setIsInitializing(false);
    };
    init();
  }, []);

  // wallet addressのセット
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
    if (!web3Auth || !ensInstance) {
      console.log("provider not initialized yet");
      return;
    }
    await changeNetwork("ethereum");
    const ENSInstance = new ENS();
    await ENSInstance.setProvider(provider);
    try {
      const duration = 31536000;
      const { customData, ...commitPopTx } =
        await ENSInstance.commitName.populateTransaction(name, {
          duration,
          owner: walletAddress,
          addressOrIndex: walletAddress,
        });
      const commitTx = await provider.getSigner().sendTransaction(commitPopTx);
      console.log(commitTx);
      await commitTx.wait();
      console.log("commitTx:done");

      const { secret, wrapperExpiry } = customData;

      // console.log("sleep 1minuts");
      // await new Promise((resolve) => setTimeout(resolve, 70000));

      const controller =
        await ENSInstance.contracts.getEthRegistrarController();
      console.log(controller);
      console.log(name, duration);
      const [price] = await controller.rentPrice(name, duration);

      console.log({
        secret,
        wrapperExpiry,
        duration,
        owner: walletAddress,
        addressOrIndex: walletAddress,
        value: price,
      });

      const tx = await ENSInstance.registerName(name, {
        secret,
        wrapperExpiry,
        duration,
        owner: walletAddress,
        addressOrIndex: walletAddress,
        value: price.mul(120).div(100),
      });
      console.log(tx);
      await tx.wait();
      console.log("tx:done");
    } catch (error) {
      console.error("Error", error);
    }
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
