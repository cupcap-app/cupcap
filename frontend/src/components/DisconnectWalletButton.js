import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import Loading from "./Loading";
import ButtonPrimary from "./ButtonPrimary";

/**
 * ウォレット接続解除ボタン
 */
const DisconnectWalletButton = ({}) => {
  // web3auth
  const { logout } = useWeb3Auth();

  return (
    <>
      <Container maxWidth="false" sx={{ maxWidth: 500 }}>
        <ButtonPrimary text="Signout" onClickHandler={() => logout()} />
      </Container>
    </>
  );
};

export default DisconnectWalletButton;
