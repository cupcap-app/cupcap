import React, { useState } from "react";
import { Button, Box } from "@mui/material";
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

/**
 * マイページボタン
 */
const MypageButton = ({ setDone }) => {
  // web3auth
  const { provider, ensTextRecord, changeNetwork } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {provider && (
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
    </>
  );
};

export default MypageButton;
