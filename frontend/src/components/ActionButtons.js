import React, { useState } from "react";
import { Button, Box, Grid, Stack } from "@mui/material";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import card_list_icon from "../public/card_list_icon.svg";
import pin_mode_icon from "../public/pin_mode_icon.svg";
import vector from "../public/vector.svg";

const buttonStyle = {
  width: 50,
  height: 70,
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
 * アクションボタン
 */
const ActionButtons = ({ setDone }) => {
  // web3auth
  const { provider, ensTextRecord, changeNetwork } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {provider && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: "90%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              maxWidth: "55%",
            }}
          >
            <Grid container spacing={2} sx={{ margin: "auto" }}>
              <Grid item xs={4}>
                <Box component={Button} sx={buttonStyle}>
                  <Box
                    component="img"
                    sx={{
                      width: 25,
                      height: 25,
                    }}
                    alt="vector"
                    src={vector}
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box component={Button} sx={buttonStyle}>
                  <Box
                    component="img"
                    sx={{
                      width: 25,
                      height: 25,
                    }}
                    alt="pin_mode_icon"
                    src={pin_mode_icon}
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box component={Button} sx={buttonStyle}>
                  <Box
                    component="img"
                    sx={{
                      width: 25,
                      height: 25,
                    }}
                    alt="card_list_icon"
                    src={card_list_icon}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

export default ActionButtons;
