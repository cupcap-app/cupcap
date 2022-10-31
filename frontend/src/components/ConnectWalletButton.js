import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import Loading from "./Loading";
import ButtonPrimary from "./ButtonPrimary";

/**
 * ウォレット接続ボタン
 */
const ConnectWalletButton = ({}) => {
  // web3auth
  const { login, isInitializing } = useWeb3Auth();
  const [isConnecting, setIsConnecting] = useState(false);

  const onLoginClick = () => {
    const connect = async () => {
      setIsConnecting(true);
      await login();
      setIsConnecting(false);
    };
    connect();
  };

  return (
    <>
      <Container maxWidth="false" sx={{ maxWidth: 500 }}>
        {isInitializing || isConnecting ? (
          <Loading text="読み込み中" />
        ) : (
          <>
            <ButtonPrimary
              text="SignIn / SignUp"
              onClickHandler={onLoginClick}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default ConnectWalletButton;
