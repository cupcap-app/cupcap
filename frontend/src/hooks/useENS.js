import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { ENS } from "@ensdomains/ensjs";
import { useWeb3Auth } from "./useWeb3Auth";
import { RPC_URLS } from "../consts/rpc";
import { ENS_CONTRACTS } from "../consts/ens";
import namehash from "eth-ens-namehash";

const ENS_REGISTRAR_ABI = require("../abis/ens/ethregistrar/ETHRegistrarController.sol/ETHRegistrarController.json");
const ENS_RESOLVER_ABI = require("../abis/ens/resolvers/Resolver.sol/Resolver.json");
const ENS_REVERSE_REGISTRAR = require("../abis/ens/registry/ReverseRegistrar.sol/ReverseRegistrar.json");

// 1年が何秒かを現在時刻を元に取得する
export function getOneYearInSeconds() {
  const now = new Date();

  const nextYear = new Date(now.getTime());
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const diff = nextYear.getTime() - now.getTime();

  // ミリ秒を1秒に変換する
  return Math.floor(diff / 1000);
}

// ENSで使用するRPCURLを返す
export function getEthereumRPCURL() {
  switch (process.env.REACT_APP_NETWORK) {
    case "mainnet":
      return RPC_URLS["ethereum"]["mainnet"];
    case "testnet":
      return RPC_URLS["ethereum"]["goerli"];
  }

  return null;
}

export function getENSAddresses() {
  switch (process.env.REACT_APP_NETWORK) {
    case "mainnet":
      return ENS_CONTRACTS["mainnet"];
    case "testnet":
      return ENS_CONTRACTS["goerli"];
  }

  return null;
}

// ステータス一覧
// 初期化が終わっていない
export const STATUS_NOT_INITIALIZED = "STATUS_NOT_INITIALIZED";
// ドメインを持っていないまたは使用するドメインが選択されていない
export const STATUS_DOMAIN_IS_NOT_REGISTERED =
  "STATUS_DOMAIN_IS_NOT_REGISTERED";
// ドメイン登録中、コミットを提出している最中
export const STATUS_SENDING_COMMITMENT = "STATUS_SENDING_COMMITMENT";
// ドメイン登録中、コミット提出後登録魔の待機期間
export const STATUS_WAITING_PERIOD = "STATUS_WAITING_PERIOD";
// ドメイン登録中、ドメイン登録のトランザクションを投げている
export const STATUS_SENDING_REGISTER = "STATUS_SENDING_REGISTER";
// ドメイン登録中、逆引きの登録
export const STATUS_SENDING_REVERSE_RESOLVING =
  "STATUS_SENDING_REVERSE_RESOLVING";
// 使用するドメインがセットされている
export const STATUS_SETTING_PROFILE = "STATUS_SETTING_PROFILE";
export const STATUS_DOMAIN_READY = "STATUS_DOMAIN_READY";

export const useENS = () => {
  const { provider, walletAddress, changeNetwork } = useWeb3Auth();

  // ENSの設定ステータス
  const [status, setStatus] = useState(STATUS_NOT_INITIALIZED);
  // 現在使用されているENSドメイン
  const [domain, setDomain] = useState(null); // xxx.eth
  // ENSjsのインスタンス
  const [ensInstance, setEnsInstance] = useState(null);
  // registrarコントラクトのインスタンス
  const [registrar, setRegistrar] = useState(null);

  useEffect(() => {
    (async () => {
      const rpcURL = getEthereumRPCURL();

      const ensInstance = new ENS();
      await ensInstance.setProvider(
        new ethers.providers.JsonRpcProvider(rpcURL)
      );

      setEnsInstance(ensInstance);
    })();
  }, []);

  useEffect(() => {
    if (!provider || !ensInstance) {
      return;
    }

    // (async () => {
    //   const primaryDomain = await getPrimaryDomain(walletAddress);

    //   if (primaryDomain !== null) {
    //     setDomain(primaryDomain);
    //     setStatus(STATUS_DOMAIN_READY);
    //   }
    // })();
  }, [provider, ensInstance, walletAddress]);

  useEffect(() => {
    (async () => {
      // Ethereumにスイッチ
      const { provider = null } = (await changeNetwork("ethereum")) ?? {};
      if (!provider) {
        throw new Error("provider is not ready");
      }

      const { registrar: registrarAddress } = getENSAddresses();

      const registrar = new ethers.Contract(
        registrarAddress,
        ENS_REGISTRAR_ABI.abi,
        provider.getSigner()
      );

      setRegistrar(registrar);
    })();
  }, []);

  // アカウントがドメインを保有しているか
  const hasDomain = useCallback(
    async (name) => {
      if (!ensInstance) {
        throw new Error("ensInstance is not ready");
      }

      if (name.endsWith(".eth")) {
        // 末尾に.ensがついている場合は消す
        name = name.substring(0, name.length - ".eth".length);
      }

      const domain = name + ".eth";

      const owner = await ensInstance.getAddr(domain);

      console.log(
        `ENS owner, domain=${domain}, owner=${owner}, wallet=${walletAddress}`
      );

      return owner === walletAddress;
    },
    [ensInstance, walletAddress]
  );

  // 指定したアドレスの使っているドメインを返す
  const getPrimaryDomain = useCallback(
    async (address) => {
      if (!ensInstance) {
        throw new Error("ENS instance is not ready");
      }

      const primaryName = await ensInstance.getName(address);

      console.log("primaryName", primaryName);

      return primaryName?.name ?? null;
    },
    [ensInstance]
  );

  // 逆引きの登録
  const registerReverseResolve = useCallback(async (provider, domain) => {
    // domain: xxx.eth
    const { reverseRegistrar: reverseRegistrarAddress } = getENSAddresses();

    const reverseRegistrar = new ethers.Contract(
      reverseRegistrarAddress,
      ENS_REVERSE_REGISTRAR.abi,
      provider.getSigner()
    );

    setStatus(STATUS_SENDING_REVERSE_RESOLVING);
    const reverseRegisterTx = await reverseRegistrar.setName(domain);

    const reverseRegisterResult = await reverseRegisterTx.wait();

    console.log("registerReverseResolve::reverseRegisterResult", {
      domain: domain,
      address: reverseRegisterTx.from,
      result: reverseRegisterResult,
    });
  }, []);

  // 必要であれば逆引きの登録を行う
  const registerReverseResolveIfNecessary = useCallback(
    async (provider, domain) => {
      // domain: xxx.eth
      const primaryDomain = await getPrimaryDomain(walletAddress);
      if (primaryDomain === null) {
        await registerReverseResolve(provider, domain);
      }
    },
    [walletAddress]
  );

  const available = useCallback(async () => {
    return registrar.available(domain);
  }, [registrar]);

  const valid = useCallback(async () => {
    return registrar.valid(domain);
  }, [registrar]);

  const getPrice = useCallback(
    async (name, duration) => {
      return registrar.rentPrice(name, duration);
    },
    [registrar]
  );

  // ENSを登録する, もし指定したENSが取得済みだが所有者の場合は足りない処理をする
  const registerENSName = useCallback(
    // durationはドメイン保有期間の秒数
    // 少なくとも1ヶ月以上にする必要がある
    // TODO: デフォルトで3ヶ月にしているが1年にしてもよい
    async (name, duration = Math.floor(getOneYearInSeconds() / 4)) => {
      if (name.endsWith(".eth")) {
        // 末尾に.ethがついている場合は消す
        name = name.substring(0, name.length - ".eth".length);
      }

      const domain = name + ".eth";

      // Ethereumにスイッチ
      const { provider = null } = (await changeNetwork("ethereum")) ?? {};
      if (!provider) {
        throw new Error("provider is not ready");
      }

      // ドメインを持っている場合は逆引きだけ確認して終了する
      if (await hasDomain(name)) {
        await registerReverseResolveIfNecessary(provider, name);

        setDomain(domain);
        setStatus(STATUS_DOMAIN_READY);

        return domain;
      }

      const {
        registrar: registrarAddress,
        resolver: resolverAddress,
        reverseRegistrar: reverseRegistrarAddress,
      } = getENSAddresses();
      const signer = provider.getSigner();

      const registrar = new ethers.Contract(
        registrarAddress,
        ENS_REGISTRAR_ABI.abi,
        signer
      );

      // 使えるかチェック
      const valid = await registrar.valid(domain);
      if (!valid) {
        throw new Error("ens domain is not valid");
      }

      const available = await registrar.available(domain);
      if (!available) {
        throw new Error("ens domain is not available");
      }

      // ENSで必要なパラメータ
      const ownerAddress = await signer.getAddress();

      // 1. 登録前にコミットメントを提出する
      const randomValue = ethers.utils.randomBytes(32);
      const secret =
        "0x" +
        Array.from(randomValue)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

      console.log("registerEnsName::makeCommitment", {
        ownerAddress,
        duration,
        secret,
      });

      const commitment = await registrar.makeCommitmentWithConfig(
        // name
        name,
        // owner
        ownerAddress,
        // secret
        secret,
        // resolver (public resolve)
        resolverAddress,
        // address (おそらく逆引きのアドレス)
        ownerAddress
      );

      console.log("registerEnsName::commitment", commitment);

      setStatus(STATUS_SENDING_COMMITMENT);
      const commitTx = await registrar.commit(commitment);

      console.log("registerEnsName::commitTx", commitTx);

      const commitTxResult = await commitTx.wait();

      console.log("registerEnsName::commitTxResult", commitTxResult);

      // 2. commitから登録まで1分以上待つ
      // wait 1 min
      setStatus(STATUS_WAITING_PERIOD);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000 * 60);
      });

      console.log("1 min has passed");

      // 3. 登録
      // 使用料を計算
      const value = await registrar.rentPrice(name, duration);

      console.log("registerEnsName::value", value);

      setStatus(STATUS_SENDING_REGISTER);
      const registerTx = await registrar.registerWithConfig(
        // name
        name,
        // owner
        ownerAddress,
        // duration
        duration,
        // secret
        secret,
        // resolver (public resolve)
        resolverAddress,
        // address
        ownerAddress,
        {
          value: value + 10,
        }
      );

      console.log("registerEnsName::registerTx", registerTx);

      const registerTxResult = await registerTx.wait();

      console.log("registerEnsName::registerTxResult", registerTxResult);

      // 4. 逆引きの登録
      await registerReverseResolve(provider, domain);

      setDomain(domain);
      setStatus(STATUS_DOMAIN_READY);

      return domain;
    },
    [domain, hasDomain]
  );

  // 指定したドメインにプロフィールを登録する
  // 第二引数のオブジェクトのキーはENSで使われるキーを指定する
  const registerProfile = useCallback(async (domain, data) => {
    setStatus(STATUS_SETTING_PROFILE);

    const { provider = null } = (await changeNetwork("ethereum")) ?? {};

    const { resolver: resolverAddress } = getENSAddresses();

    const node = namehash.hash(domain);

    const resolver = new ethers.Contract(
      resolverAddress,
      ENS_RESOLVER_ABI.abi,
      provider.getSigner()
    );

    const records = [];

    for (const [key, value] of Object.entries(data)) {
      records.push(
        resolver.interface.encodeFunctionData(
          "setText(bytes32,string,string)",
          [node, key, value]
        )
      );
    }

    const setTx = await resolver.multicall(records);

    const setRes = await setTx.wait();

    setStatus(STATUS_DOMAIN_READY);
    console.log("setRes", setRes);
  }, []);

  // ENSに登録されたテキストを複数取得する
  const getProfile = useCallback(async (domain, keys) => {
    const { provider = null } = (await changeNetwork("ethereum")) ?? {};
    const { resolver: resolverAddress } = getENSAddresses();
    const resolver = new ethers.Contract(
      resolverAddress,
      ENS_RESOLVER_ABI.abi,
      provider.getSigner()
    );

    const node = namehash.hash(domain);

    const results = await Promise.all(
      keys.map((key) => {
        return resolver.text(node, key);
      })
    );

    return results;
  }, []);

  console.log("primary domain", domain);
  console.log("status", status);

  return {
    domain,
    status,
    getPrimaryDomain,
    available,
    valid,
    hasDomain,
    getPrice,
    registerENSName,
    registerProfile,
    getProfile,
    registerReverseResolveIfNecessary,
  };
};
