import React, { useState } from "react";
import { Box, Button, Link, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import QRcode from "./QRcode";

const PlofileCard = ({ cardImage, plofileInfo }) => {
  const { provider, walletAddress } = useWeb3Auth();
  const [activeQRcodeModal, setActiveQRcodeModal] = useState(false);
  const onClickQRcode = () => {
    setActiveQRcodeModal(!activeQRcodeModal);
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          sx={{
            width: "100%",
          }}
          alt="backImage"
          src={cardImage.back}
        />

        {plofileInfo.avater && (
          <Box
            component="img"
            sx={{
              width: "10%",
              position: "absolute",
              left: "10%",
              top: "20%",
              borderRadius: "50%",
            }}
            alt="backImage"
            src={plofileInfo.avater}
          />
        )}
        {plofileInfo.displayName && (
          <Box
            sx={{
              width: "8%",
              position: "absolute",
              left: "22%",
              top: "23%",
            }}
          >
            <Typography
              sx={{ color: "#FFF", fontSize: "18px", fontWeight: "bold" }}
            >
              {plofileInfo.displayName}
            </Typography>
          </Box>
        )}
        {plofileInfo.discription && (
          <Box
            sx={{
              width: "50%",
              position: "absolute",
              left: "10%",
              top: "35%",
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {plofileInfo.discription}
            </Typography>
          </Box>
        )}
        {cardImage.link.url && (
          <Link href={plofileInfo.url ? plofileInfo.url : null} target="_blank">
            <Box
              component="img"
              sx={{
                width: "8%",
                position: "absolute",
                right: "20%",
                top: "20%",
              }}
              alt="backImage"
              src={cardImage.link.url}
            />
          </Link>
        )}
        {cardImage.link.discord && (
          <Link
            href={
              plofileInfo.discord
                ? `https://discordapp.com/users/${plofileInfo.discord}`
                : null
            }
            target="_blank"
          >
            <Box
              component="img"
              sx={{
                width: "8%",
                position: "absolute",
                right: "20%",
                top: "40%",
              }}
              alt="backImage"
              src={cardImage.link.discord}
            />
          </Link>
        )}
        {cardImage.link.telegram && (
          <Link
            href={
              plofileInfo.telegram
                ? `https://telegram.me/${plofileInfo.telegram}`
                : null
            }
            target="_blank"
          >
            <Box
              component="img"
              sx={{
                width: "8%",
                position: "absolute",
                right: "20%",
                top: "57%",
              }}
              alt="backImage"
              src={cardImage.link.telegram}
            />
          </Link>
        )}
        {cardImage.link.email && (
          <Link href={plofileInfo.email ? `mailto:${plofileInfo.email}` : null}>
            <Box
              component="img"
              sx={{
                width: "8%",
                position: "absolute",
                right: "8%",
                top: "21%",
              }}
              alt="backImage"
              src={cardImage.link.email}
            />
          </Link>
        )}

        {cardImage.link.github && (
          <Link
            href={
              plofileInfo.github
                ? `https://github.com/${plofileInfo.github}`
                : null
            }
            target="_blank"
          >
            <Box
              component="img"
              sx={{
                width: "8%",
                position: "absolute",
                right: "8%",
                top: "38%",
              }}
              alt="backImage"
              src={cardImage.link.github}
            />
          </Link>
        )}
        {cardImage.link.twitter && (
          <Link
            href={
              plofileInfo.twitter
                ? `https://twitter.com/${plofileInfo.twitter}`
                : null
            }
            target="_blank"
          >
            <Box
              component="img"
              sx={{
                width: "8%",
                position: "absolute",
                right: "8%",
                top: "58%",
              }}
              alt="backImage"
              src={cardImage.link.twitter}
            />
          </Link>
        )}
        {activeQRcodeModal ? (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, 0%)",
              zIndex: 100,
            }}
          >
            <Button onClick={onClickQRcode}>
              <QRcode width={300} text={`${walletAddress}`} />
            </Button>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                width: "10%",
                position: "absolute",
                left: "8%",
                top: "52%",
              }}
            >
              <Button onClick={onClickQRcode}>
                <QRcode width={50} text={`${walletAddress}`} />
              </Button>
            </Box>
          </>
        )}
        <AnimatePresence>
          <Box
            key="frontcard"
            component={motion.div}
            animate={{
              opacity: 0,
              transitionEnd: {
                display: "none",
              },
            }}
            initial={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Box
              component="img"
              sx={{
                position: "absolute",
                width: "100%",
                left: 0,
                top: 0,
              }}
              alt="frontImage"
              src={cardImage.front}
            />
          </Box>
        </AnimatePresence>
      </Box>
    </>
  );
};

export default PlofileCard;