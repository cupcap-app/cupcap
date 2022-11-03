import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import Loading from "./Loading";
import ButtonPrimary from "./ButtonPrimary";
import logo from "../public/logo.png";

/**
 * ウォレット接続モーダル
 */
const ConnectWalletModal = ({}) => {
  // web3auth
  const { login, isInitializing, provider } = useWeb3Auth();
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
      {!provider && (
        <>
          <Box
            sx={{
              width: "90%",
              height: "90%",
              backgroundColor: "rgba(217, 217, 217, 0.1)",
              border: 0,
              borderRadius: "15px",
              backdropFilter: "blur(20px)",
              boxShadow: 10,
              display: "block",
              m: "auto",
              my: 3,
              overflow: "auto",
            }}
          >
            <Box
              component="img"
              sx={{
                width: 180,
                display: "block",
                m: "auto",
                py: 10,
              }}
              alt="logo"
              src={logo}
            />
            <Box
              sx={{
                width: 180,
                display: "block",
                m: "auto",
                pb: 10,
              }}
            >
              <Typography sx={{ textAlign: "center", color: "#FFF" }}>
                cupcap is xxxxxxxxxxxxxxxxxx. xxxxxxxxxxxxxxxxxxxx. xxxxxxxx
                xxxxxx.
              </Typography>
            </Box>
            {isInitializing || isConnecting ? (
              <Loading text="読み込み中" />
            ) : (
              <>
                <ButtonPrimary
                  text="Connect Wallet"
                  onClickHandler={onLoginClick}
                />
              </>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default ConnectWalletModal;
