import React, { useState } from "react";
import { Button, Box, Grid, Modal, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import ButtonPrimary from "./ButtonPrimary";
import PlofileCardBack from "./PlofileCardBack";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import card_list_icon from "../public/card_list_icon.svg";
import pin_mode_icon from "../public/pin_mode_icon.svg";
import event_list_icon from "../public/event_list_icon.svg";
import classic_front from "../public/classic_card_front.png";
import classic_back from "../public/classic_card_back.png";
import cupcat_front from "../public/cupcat_card_front.png";
import cupcat_back from "../public/cupcat_card_back.png";
import hologram_front from "../public/hologram_card_front.png";
import hologram_back from "../public/hologram_card_back.png";
import email_icon from "../public/email_icon.png";
import discord_icon from "../public/discord_icon.png";
import github_icon from "../public/github_icon.png";
import url_icon from "../public/url_icon.png";
import telegram_icon from "../public/telegram_icon.png";
import twitter_icon from "../public/twitter_icon.png";

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
                    Card List
                  </Typography>
                  <Box>
                    <PlofileCardBack
                      cardImage={{
                        front: hologram_front,
                        back: hologram_back,
                        link: {
                          url: url_icon,
                          email: email_icon,
                          discord: discord_icon,
                          telegram: telegram_icon,
                          github: github_icon,
                          twitter: twitter_icon,
                        },
                        color: "#FFF",
                      }}
                      plofileInfo={{
                        avater:
                          "https://live---metadata-5covpqijaa-uc.a.run.app/images/6316",
                        displayName: "cupcap.eth",
                        discription: "cupcap is ...",
                        url: "https://www.pedro.tokyo/",
                        email: "cupcap.crypto@gmail.com",
                        discord: "yusaka#7114",
                        telegram: null,
                        github: "yusakapon",
                        twitter: "yusaka_btc",
                      }}
                    />
                    <PlofileCardBack
                      cardImage={{
                        front: cupcat_front,
                        back: cupcat_back,
                        link: {
                          url: url_icon,
                          email: email_icon,
                          discord: discord_icon,
                          telegram: telegram_icon,
                          github: github_icon,
                          twitter: twitter_icon,
                        },
                        color: "#000",
                      }}
                      plofileInfo={{
                        avater:
                          "https://live---metadata-5covpqijaa-uc.a.run.app/images/5316",
                        displayName: "xxx.eth",
                        discription: "xxx is ...",
                        url: "https://www.pedro.tokyo/",
                        email: "cupcap.crypto@gmail.com",
                        discord: "yusaka#7114",
                        telegram: null,
                        github: "yusakapon",
                        twitter: "yusaka_btc",
                      }}
                    />
                  </Box>
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
                    EventList
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
