import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Box, TextField, Stack, Typography } from "@mui/material";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import Loading from "./Loading";
import ButtonPrimary from "./ButtonPrimary";
import hologram_front from "../public/hologram_front.png";
import hologram_back from "../public/hologram_back.png";

/**
 * カード選択モーダル
 */
const CardSelectModal = ({ setDone }) => {
  // web3auth
  const { provider, ensTextRecord, changeNetwork } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState(false);

  const settingDoneHandler = () => {
    setDone(true);
  };

  return (
    <>
      {provider && (
        <>
          <Box
            sx={{
              width: "90%",
              height: "90%",
              backgroundColor: "rgba(217, 217, 217, 0.1)",
              border: 0,
              borderRadius: "15px",
              backdropFilter: "blur(41.1333px)",
              boxShadow: 10,
              display: "block",
              m: "auto",
              my: 3,
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                width: "90%",
                maxHeight: "90%",
                display: "block",
                m: "auto",
              }}
            >
              <Box sx={{ color: "#FFF", my: 2 }}>
                <Typography>Choose your card design</Typography>
              </Box>
            </Box>
            <Box
              component="img"
              sx={{
                width: 300,
                height: 180,
                display: "block",
                m: "auto",
              }}
              alt="hologram_front"
              src={hologram_front}
            />
            <Box
              component="img"
              sx={{
                width: 300,
                height: 180,
                display: "block",
                m: "auto",
                mb: 5,
              }}
              alt="hologram_back"
              src={hologram_back}
            />
            <ButtonPrimary text={"Done"} onClickHandler={settingDoneHandler} />
          </Box>
        </>
      )}
    </>
  );
};

export default CardSelectModal;
