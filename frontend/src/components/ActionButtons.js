import React, { useState } from "react";
import { Button, Box, Grid, Modal, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import ButtonPrimary from "./ButtonPrimary";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import card_list_icon from "../public/card_list_icon.svg";
import pin_mode_icon from "../public/pin_mode_icon.svg";
import event_list_icon from "../public/event_list_icon.svg";

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
  "&:active": {
    background: "aqua",
  },
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -25%)",
  width: 400,
  height: 500,
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
 * アクションボタン
 */
const ActionButtons = ({ setIsPinMode }) => {
  // web3auth
  const { provider, ensTextRecord, changeNetwork } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState(false);
  const [eventMode, setEventMode] = useState(false);
  const [activePinMode, setActivePinMode] = useState(false);
  const [activeCardList, setActiveCardList] = useState(false);
  const onEventListHandler = () => {
    if (!eventMode) {
      setActiveCardList(false);
    }
    setEventMode(!eventMode);
  };
  const onPinModeHandler = () => {
    setActivePinMode(!activePinMode);
    setIsPinMode(!activePinMode);
  };
  const onCardListHandler = () => {
    if (!activeCardList) {
      setEventMode(false);
    }
    setActiveCardList(!activeCardList);
  };

  return (
    <>
      {provider && (
        <>
          {/* ぼかし用の表示 */}
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
            <Grid container spacing={0}>
              <Grid item xs={4}>
                {eventMode && (
                  <>
                    <Box component={Button} sx={buttonStyle}>
                      <Box
                        component="img"
                        sx={{
                          width: 25,
                          height: 25,
                        }}
                        alt="event_list_icon"
                        src={event_list_icon}
                      />
                    </Box>
                  </>
                )}
              </Grid>
              <Grid item xs={4}>
                {activePinMode && (
                  <>
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
                  </>
                )}
              </Grid>
              <Grid item xs={4}>
                {activeCardList && (
                  <>
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
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
          {/* ぼかし用の表示ここまで */}
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
            <Grid container spacing={0}>
              <Grid item xs={4}>
                <Box
                  component={Button}
                  sx={buttonStyle}
                  onClick={onEventListHandler}
                >
                  <Box
                    component="img"
                    sx={{
                      width: 25,
                      height: 25,
                    }}
                    alt="event_list_icon"
                    src={event_list_icon}
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box
                  component={Button}
                  sx={buttonStyle}
                  onClick={onPinModeHandler}
                >
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
                <Box
                  component={Button}
                  sx={buttonStyle}
                  onClick={onCardListHandler}
                >
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
          <AnimatePresence>
            {activeCardList && (
              <>
                <Box
                  key="activeCardListModal"
                  sx={modalStyle}
                  component={motion.div}
                  initial={{ top: "100%" }}
                  animate={{ top: "30%" }}
                  exit={{ top: "-80%" }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ color: "#FFF" }}
                  >
                    カードリスト？？？
                  </Typography>
                  <Typography sx={{ mt: 2, color: "#FFF" }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor
                    ligula.
                  </Typography>
                  <ButtonPrimary
                    text="CLOSE"
                    onClickHandler={onCardListHandler}
                  />
                </Box>
              </>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {eventMode && (
              <>
                <Box
                  key="eventModeModal"
                  sx={modalStyle}
                  component={motion.div}
                  initial={{ top: "100%" }}
                  animate={{ top: "30%" }}
                  exit={{ top: "-80%" }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ color: "#FFF" }}
                  >
                    イベントモーダル？？？
                  </Typography>
                  <Typography sx={{ mt: 2, color: "#FFF" }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor
                    ligula.
                  </Typography>
                  <ButtonPrimary
                    text="CLOSE"
                    onClickHandler={onEventListHandler}
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

export default ActionButtons;
