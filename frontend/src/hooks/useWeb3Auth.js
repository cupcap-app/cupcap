import { createContext, useContext, useEffect, useState } from "react";
import { ADAPTER_EVENTS, WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { ethers } from "ethers";
import { ENS } from "@ensdomains/ensjs";
// import logo from "../public/logo.svg";

const CHAIN_CONFIGS = {
  ethereum: {
    mainnet: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x1",
    },
    testnet: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x5",
    },
  },
  polygon: {
    mainnet: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x89",
    },
    testnet: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x13881",
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
  getAccount: async () => {},
  signMessage: async () => {},
  getBalance: async () => {},
  getPrivateKey: async () => {},
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
    web3Auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
      console.log("web3Auth:", web3Auth);
      setWeb3Auth(web3Auth);
      console.log("web3AuthUser:", data);
      setWeb3AuthUser(data);
      const newProvider = new ethers.providers.Web3Provider(web3Auth.provider);
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
      console.log(CHAIN_CONFIGS[chain][process.env.REACT_APP_NETWORK]);
      const web3Auth = new Web3Auth({
        clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID,
        chainConfig: CHAIN_CONFIGS[chain][process.env.REACT_APP_NETWORK],
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
  }, [chain]);

  // wallet addressのセット
  useEffect(() => {
    if (!provider) {
      return;
    }
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
    const newProvider = new ethers.providers.Web3Provider(connecter);
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
    getAccount,
    getBalance,
    signMessage,
    getPrivateKey,
    isInitializing,
  };
  return (
    <Web3AuthContext.Provider value={contextProvider}>
      {children}
    </Web3AuthContext.Provider>
  );
};
