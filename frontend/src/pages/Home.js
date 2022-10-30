import { createContext, useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import ConnectWalletButton from "../components/ConnectWalletButton";
import DisconnectWalletButton from "../components/DisconnectWalletButton";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import Loading from "../components/Loading";
import DomainForm from "../components/DomainForm";
import ProfileForm from "../components/ProfileForm";

const Home = () => {
  const { provider, walletAddress, ensName, ensTextRecord } = useWeb3Auth();

  return (
    <>
      {provider ? (
        <>
          {ensName !== null ? (
            <>
              <Box>wallet address: {walletAddress}</Box>
              <DomainForm />
              <Box>ENS domain: {ensName}</Box>
              <Box>email: {ensTextRecord.email}</Box>
              <Box>url: {ensTextRecord.url}</Box>
              <Box>avatar: {ensTextRecord.avatar}</Box>
              <Box>description: {ensTextRecord.description}</Box>
              <Box>notice: {ensTextRecord.notice}</Box>
              <Box>keywords: {ensTextRecord.keywords}</Box>
              <Box>discord: {ensTextRecord.discord}</Box>
              <Box>github: {ensTextRecord.github}</Box>
              <Box>reddit: {ensTextRecord.reddit}</Box>
              <Box>twitter: {ensTextRecord.twitter}</Box>
              <Box>telegram: {ensTextRecord.telegram}</Box>
              <ProfileForm />
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
