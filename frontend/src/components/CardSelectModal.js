import React, { useState } from "react";
import { Button, Box, TextField, Stack, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import Loading from "./Loading";
import ButtonPrimary from "./ButtonPrimary";
import PlofileCardBack from "./PlofileCardBack";
import hologram_front from "../public/hologram_card_front.png";
import hologram_back from "../public/hologram_card_back.png";
import classic_front from "../public/classic_card_front.png";
import classic_back from "../public/classic_card_back.png";
import cupcat_front from "../public/cupcat_card_front.png";
import cupcat_back from "../public/cupcat_card_back.png";
import email_icon from "../public/email_icon.png";
import discord_icon from "../public/discord_icon.png";
import github_icon from "../public/github_icon.png";
import url_icon from "../public/url_icon.png";
import telegram_icon from "../public/telegram_icon.png";
import twitter_icon from "../public/twitter_icon.png";

/**
 * カード選択モーダル
 */
const CardSelectModal = ({ setDone }) => {
  // web3auth
  const { provider } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState(false);

  const settingDoneHandler = () => {
    // TODO weavedbに保存
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
              backdropFilter: "blur(20px)",
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
            {/* TODO コンポーネント化 */}
            <Box sx={{ m: 3, mb: 8 }}>
              <Slider dots infinite speed="500">
                <Box>
                  <Box
                    component="img"
                    sx={{
                      width: "100%",
                      display: "block",
                      m: "auto",
                    }}
                    alt="hologram_front"
                    src={hologram_front}
                  />
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
                    }}
                    plofileInfo={{
                      avater:
                        "https://live---metadata-5covpqijaa-uc.a.run.app/images/6316",
                      displayName: "yusaka.eth",
                      discription:
                        "crypto botter / full stack engineer / dydx grants / TicketMe engineer @ticketme_yeah",
                      url: "https://www.pedro.tokyo/",
                      email: "yusuke@ticketme.jp",
                      discord: "yusaka#7114",
                      telegram: null,
                      github: "yusakapon",
                      twitter: "yusaka_btc",
                    }}
                  />
                </Box>
                <Box>
                  <Box
                    component="img"
                    sx={{
                      width: "100%",
                      display: "block",
                      m: "auto",
                    }}
                    alt="classic_front"
                    src={classic_front}
                  />
                  <PlofileCardBack
                    cardImage={{
                      front: classic_front,
                      back: classic_back,
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
                </Box>
                <Box>
                  <Box
                    component="img"
                    sx={{
                      width: "100%",
                      display: "block",
                      m: "auto",
                    }}
                    alt="cupcat_front"
                    src={cupcat_front}
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
                </Box>
              </Slider>
            </Box>

            <ButtonPrimary text={"Done"} onClickHandler={settingDoneHandler} />
          </Box>
        </>
      )}
    </>
  );
};

export default CardSelectModal;
