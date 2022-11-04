import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import lf from "localforage";
import { isNil } from "ramda";
import { useWeb3Auth } from "./useWeb3Auth";
import client from "weavedb-client";

const CONTRACT_TX_ID = process.env.REACT_APP_WEAVEDB_CONTRACT_TX_ID;
const PROFILE_SCHEMA_NAME = "profile";

const configuration = {
  name: "weavedb",
  version: "1",
  contractTxId: process.env.REACT_APP_WEAVEDB_CONTRACT_TX_ID,
  rpc: process.env.REACT_APP_WEAVEDB_GRPC_URL,
};

console.log("[DEBUG] WeaveDB client configuration", configuration);

const db = new client(configuration);

export const useWeaveDB = () => {
  const { walletAddress } = useWeb3Auth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (walletAddress) {
      walletConnect();
    }
  }, [walletAddress]);

  const walletConnect = useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);

    const walletAddress = await provider.getSigner().getAddress();
    let identity = await lf.getItem(
      `temp_address:${CONTRACT_TX_ID}:${walletAddress}`
    );

    console.log("walletAddress", walletAddress);
    console.log("identity", identity);

    let tx;
    if (!isNil(identity)) {
      await lf.setItem("temp_address:current", walletAddress);

      const user = {
        wallet: walletAddress,
        privateKey: identity.privateKey,
      };

      setUser(user);

      return user;
    } else {
      ({ tx, identity } = await db.createTempAddress(walletAddress));
    }

    if (!isNil(tx) && isNil(tx.err)) {
      identity.tx = tx;
      identity.linked_address = walletAddress;

      await lf.setItem("temp_address:current", walletAddress);
      await lf.setItem(
        `temp_address:${CONTRACT_TX_ID}:${walletAddress}`,
        identity
      );

      const user = {
        wallet: walletAddress,
        privateKey: identity.privateKey,
      };

      setUser(user);
    }
  }, []);

  const createProfile = useCallback(async (user, data) => {
    const now = new Date().getTime();

    await db.add(
      {
        user_address: user.wallet.toLowerCase(),
        created_at: now,
        updated_at: now,
        ...data,
      },
      PROFILE_SCHEMA_NAME,
      user
    );
  }, []);

  const updateProfile = useCallback(async (user, id, data) => {
    const now = new Date().getTime();

    await db.update(
      { ...data, updated_at: now },
      PROFILE_SCHEMA_NAME,
      id,
      user
    );
  }, []);

  const putProfile = useCallback(
    async (data) => {
      let targetUser = user;
      if (!targetUser) {
        targetUser = await walletConnect();
      }

      const profiles = await db.get(
        PROFILE_SCHEMA_NAME,
        ["user_address", "=", targetUser.wallet.toLowerCase()],
        ["created_at", "desc"]
      );

      if (!profiles || profiles.length === 0) {
        return createProfile(targetUser, data);
      } else {
        return updateProfile(targetUser, profiles[0].id, data);
      }
    },
    [user, db]
  );

  const getMyProfile = useCallback(async () => {
    let targetUser = user;
    if (!targetUser) {
      targetUser = await walletConnect();
    }

    return await db.get(
      PROFILE_SCHEMA_NAME,
      ["user_address", "=", targetUser.wallet.toLowerCase()],
      ["created_at", "desc"]
    );
  }, [user]);

  const getProfile = useCallback(async (eth_address) => {
    return await db.get(
      PROFILE_SCHEMA_NAME,
      ["eth_address", "=", eth_address],
      ["created_at", "desc"]
    );
  }, []);

  console.log("WeaveDB user", user);

  return {
    user,
    putProfile,
    getProfile,
    getMyProfile,
    walletConnect,
  };
};

// WeaveDBのレコードスキーマ
// {
//     "user_address": {
//         "type": "string"
//       },
//       "created_at": {
//         "type": "number"
//       },
//       "updated_at": {
//         "type": "number"
//       },
//       "avatar": {
//         "type": "string"
//       },
//       "display_name": {
//         "type": "string"
//       },
//       "com_github": {
//         "type": "string"
//       },
//       "com_twitter": {
//         "type": "string"
//       },
//       "com_discord": {
//         "type": "string"
//       },
//       "org_telegram": {
//         "type": "string"
//       },
//       "email": {
//         "type": "string"
//       },
//       "url": {
//         "type": "string"
//       },
//       "description": {
//         "type": "string"
//       }
// }
