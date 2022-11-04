import React, { useCallback, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import lf from "localforage";
import { db } from "./client";
import { isNil } from "ramda";

const CONTRACT_TX_ID = process.env.REACT_APP_WEAVE_DB_CONTRACT_TX_ID;
const PROFILE_SCHEMA_NAME = "profile";

const useWeaveDBAccount = () => {
  const [user, setUser] = useState(null);

  // load user
  useEffect(() => {
    // 必ず即時関数を使ってasyncをする
    (async () => {
      const walletAddress = await lf.getItem(`temp_address:current`);

      if (!isNil(walletAddress)) {
        const identity = await lf.getItem(
          `temp_address:${CONTRACT_TX_ID}:${walletAddress}`
        );

        if (!isNil(identity))
          setUser({
            wallet: walletAddress,
            privateKey: identity.privateKey,
          });
      }
    })();
  }, []);

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

      setUser({
        wallet: walletAddress,
        privateKey: identity.privateKey,
      });

      return;
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

      setUser({
        wallet: walletAddress,
        privateKey: identity.privateKey,
      });
    }
  }, []);

  return [user, walletConnect];
};

export const WeaveDBWrite = () => {
  const [user, walletConnect] = useWeaveDBAccount();
  const [name, setName] = useState("");
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async () => {
    const profile = await db.get(
      PROFILE_SCHEMA_NAME,
      ["user_address", "=", user.wallet.toLowerCase()],
      ["user_address", "desc"]
    );

    console.log("loaded profile", profile);

    setProfile(profile[0] ?? null);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchProfile();
  }, [user, fetchProfile]);

  const updateProfile = useCallback(async () => {
    if (!name) {
      return;
    }

    try {
      const profile = await db.get(
        PROFILE_SCHEMA_NAME,
        ["user_address", "=", user.wallet.toLowerCase()],
        ["user_address", "desc"]
      );
      const now = new Date().getTime();

      if (!profile || profile.length === 0) {
        const res = await db.add(
          {
            user_address: user.wallet.toLowerCase(),
            created_at: now,
            updated_at: now,
            avatar: "avatar_hoge",
            display_name: name,
            com_github: "github test",
            com_twitter: "twitter test",
            com_discord: "discord test",
            org_telegram: "telegram test",
            email: "email test",
            url: "url: test",
            description: "description test",
          },
          PROFILE_SCHEMA_NAME,
          user
        );

        console.log("res", res);

        await fetchProfile();

        return;
      }

      const res = await db.update(
        { display_name: name, updated_at: now },
        PROFILE_SCHEMA_NAME,
        profile[0].id,
        user
      );

      console.log("res", res);

      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  }, [user, name]);

  return (
    <>
      {!user && (
        <button onClick={() => walletConnect()}>Connect To Waller</button>
      )}
      {user && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}
        >
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={() => updateProfile()}>Update</button>
        </div>
      )}
    </>
  );
};

export const WeaveDBGet = () => {
  const [user, walletConnect] = useWeaveDBAccount();
  const [profile, setProfile] = useState(null);

  const getProfile = useCallback(async () => {
    setProfile(
      await db.get(
        PROFILE_SCHEMA_NAME,
        ["user_address", "=", user.wallet.toLowerCase()],
        ["user_address", "desc"]
      )
    );
  }, [db, user]);

  console.log("WeaveDBGet profile", profile);

  return (
    <>
      {!user && (
        <button onClick={() => walletConnect()}>Connect To Waller</button>
      )}
      {user && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}
        >
          <button onClick={() => getProfile()}>Fetch</button>
          {JSON.stringify(profile)}
        </div>
      )}
    </>
  );
};
