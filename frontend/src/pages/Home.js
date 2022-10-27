import { createContext, useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import ConnectWalletButton from "../components/ConnectWalletButton";
import DisconnectWalletButton from "../components/DisconnectWalletButton";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import Loading from "../components/Loading";

const Home = () => {
  const { provider, walletAddress, ensName } = useWeb3Auth();

  return (
    <>
      {provider ? (
        <>
          {ensName !== null ? (
            <>
              <Box>ENS: {ensName}</Box>
              <Box>{walletAddress}</Box>
            </>
          ) : (
            <>
              <Loading text="読み込み中" />
            </>
          )}

          <DisconnectWalletButton />
        </>
      ) : (
        <>
          <ConnectWalletButton />
        </>
      )}
    </>
  );
};

export default Home;
