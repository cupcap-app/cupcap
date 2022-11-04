import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import PlofileCard from "./PlofileCard";
import ButtonPrimary from "./ButtonPrimary";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import mypage_icon from "../public/mypage_icon.svg";

const buttonStyle = {
  position: "absolute",
  top: "6%",
  left: "85%",
  transform: "translate(-50%, -50%)",
  width: 50,
  height: 60,
  backgroundColor: "rgba(217, 217, 217, 0.1)",
  border: 0,
  borderRadius: "10px",
  backdropFilter: "blur(3.83333px)",
  boxShadow:
    "inset 3.83333px -3.83333px 3.83333px rgba(194, 194, 194, 0.1), inset -3.83333px 3.83333px 3.83333px rgba(255, 255, 255, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(217, 217, 217, 0.1)",
    backdropFilter: "blur(3.83333px)",
    boxShadow:
      "inset 3.83333px -3.83333px 3.83333px rgba(194, 194, 194, 0.1), inset -3.83333px 3.83333px 3.83333px rgba(255, 255, 255, 0.1)",
  },
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -25%)",
  width: 400,
  height: 600,
  maxWidth: "70%",
  maxHeight: "60%",
  backgroundColor: "rgba(217, 217, 217, 0.1)",
  border: 0,
  borderRadius: "15px",
  backdropFilter: "blur(10px)",
  boxShadow: 10,
  p: 4,
  ".MuiBackdrop-root": {
    backgroundColor: "#FFF",
  },
};

/**
 * マイページボタン
 */
const MypageButton = ({ cardImage, plofileInfo }) => {
  // web3auth
  const { provider, ensTextRecord, changeNetwork } = useWeb3Auth();
  const [activeMypageModal, setActiveMypageModal] = useState(false);

  const onMypageHandler = () => {
    setActiveMypageModal(!activeMypageModal);
  };

  return (
    <>
      {provider && (
        <>
          {activeMypageModal && (
            <>
              <Box component={Button} sx={buttonStyle}>
                <Box
                  component="img"
                  sx={{
                    width: 25,
                    height: 25,
                  }}
                  alt="mypage_icon"
                  src={mypage_icon}
                />
              </Box>
            </>
          )}
          <Box component={Button} sx={buttonStyle} onClick={onMypageHandler}>
            <Box
              component="img"
              sx={{
                width: 25,
                height: 25,
              }}
              alt="mypage_icon"
              src={mypage_icon}
            />
          </Box>
          <AnimatePresence>
            {activeMypageModal && (
              <>
                <Box
                  key="mypageModal"
                  sx={modalStyle}
                  component={motion.div}
                  initial={{ top: "0%" }}
                  animate={{ top: "30%" }}
                  exit={{ top: "-80%" }}
                >
                  <PlofileCard
                    cardImage={cardImage}
                    plofileInfo={plofileInfo}
                  />
                  <ButtonPrimary
                    text="CLOSE"
                    onClickHandler={onMypageHandler}
                  />
                </Box>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default MypageButton;
