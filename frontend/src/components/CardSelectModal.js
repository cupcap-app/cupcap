import React, { useState } from "react";
import { Button, Box, TextField, Stack, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import Loading from "./Loading";
import ButtonPrimary from "./ButtonPrimary";
import hologram_front from "../public/hologram_card_front.png";
import hologram_back from "../public/hologram_card_back.png";
import classic_front from "../public/classic_card_front.png";
import classic_back from "../public/classic_card_back.png";

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
            {/* TODO コンポーネント化 */}
            <Box sx={{ m: 3, mb: 8 }}>
              <Slider dots infinite speed="500">
                <Box>
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
                </Box>
                <Box>
                  <Box
                    component="img"
                    sx={{
                      width: 300,
                      height: 180,
                      display: "block",
                      m: "auto",
                    }}
                    alt="classic_front"
                    src={classic_front}
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
                    alt="classic_back"
                    src={classic_back}
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
