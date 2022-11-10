import { useState } from "react";
import { Marker } from "@react-google-maps/api";
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { AnimatePresence, motion } from "framer-motion";
import { participateEvent } from "../clients/cupcap";
import { useArweave } from "../hooks/useArweave";
import ButtonPrimary from "./ButtonPrimary";
import Loading from "./Loading";
import event_pin from "../public/event_pin.svg";
import close_button from "../public/close_button.svg";
import camera from "../public/camera.png";

const modalStyle = {
  width: "75%",
  height: "80%",
  backgroundColor: "rgba(217, 217, 217, 0.1)",
  border: 0,
  borderRadius: "15px",
  backdropFilter: "blur(10px)",
  boxShadow: 10,
  p: 4,
  ".MuiBackdrop-root": {
    backgroundColor: "#FFF",
  },
  m: "auto",
  overflow: "auto",
  mt: "10%",
};

/**
 * イベントマーカーコンポーネント
 */
const EventMarker = ({ eventInfo }) => {
  const { provider, walletAddress } = useWeb3Auth();
  const { downloadImage, downloadJSON, uploadFile, uploadJSON } = useArweave();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParticipateLoading, setIsParticipateLoading] = useState(false);

  // TODO 参加者取得
  const participantImages = [
    "https://live---metadata-5covpqijaa-uc.a.run.app/images/1316",
    "https://live---metadata-5covpqijaa-uc.a.run.app/images/1516",
    "https://live---metadata-5covpqijaa-uc.a.run.app/images/2316",
    "https://live---metadata-5covpqijaa-uc.a.run.app/images/1326",
  ];

  const selectImage = async (e) => {
    const res = await uploadFile(e.target.files[0]);
    console.log("file uploaded", res);
  };

  const onClickReserveHandler = async () => {
    setIsParticipateLoading(true);
    await participateEvent(provider, eventInfo.id);
    setIsModalOpen(false);
    setIsParticipateLoading(false);
  };

  return (
    <>
      <Marker
        title={eventInfo.title}
        position={eventInfo.position}
        icon={{
          url: event_pin,
        }}
        animation={window.google && window.google.maps.Animation.DROP}
        clickable
        onClick={() => setIsModalOpen(true)}
      />

      <AnimatePresence>
        {isModalOpen && (
          <>
            <Box
              key="mypageModal"
              sx={modalStyle}
              component={motion.div}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "150%" }}
            >
              <Button onClick={() => setIsModalOpen(false)}>
                <Box
                  component="img"
                  sx={{
                    width: 20,
                  }}
                  alt="close_button"
                  src={close_button}
                />
              </Button>
              <Box sx={{ p: 3 }}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.1)!important",
                    borderRadius: "15px",
                    width: 250,
                    height: 150,
                    maxWidth: "90%",
                    display: "block",
                    m: "auto",
                  }}
                >
                  <input type="file" hidden onChange={selectImage} />
                  <Box
                    component="img"
                    sx={{
                      width: 40,
                      display: "block",
                      m: "auto",
                      mt: "25%",
                    }}
                    alt="camera"
                    src={camera}
                  />
                </Button>
              </Box>
              <Typography variant="h6" component="h2" sx={{ color: "#FFF" }}>
                {eventInfo.title}-{eventInfo.id}
              </Typography>
              <Typography sx={{ mt: 2, color: "#FFF" }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
              <Typography sx={{ mt: 2, color: "#FFF" }}>
                2022/11/06 13:00 ~ 2022/11/06 15:00
              </Typography>
              <Typography sx={{ mt: 2, color: "#FFF" }}>Participant</Typography>
              <ImageList
                sx={{
                  width: "100%",
                  maxHeight: "10%",
                  margin: "auto",
                }}
                cols={9}
                gap={3}
              >
                {participantImages.map((image, index) => (
                  <ImageListItem
                    sx={{
                      ".MuiImageListItem-img": {
                        borderRadius: "50%",
                      },
                    }}
                    key={image + index}
                  >
                    <img src={image} />
                  </ImageListItem>
                ))}
              </ImageList>
              <Typography sx={{ mt: 2, color: "#FFF" }}>Location</Typography>
              <Typography sx={{ color: "#FFF" }}>
                {eventInfo.position.lat}
              </Typography>
              <Typography sx={{ color: "#FFF" }}>
                {eventInfo.position.lng}
              </Typography>
              {isParticipateLoading ? (
                <Loading text="処理中です" />
              ) : (
                <>
                  <ButtonPrimary
                    text="Reserve"
                    onClickHandler={onClickReserveHandler}
                  />
                </>
              )}
            </Box>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default EventMarker;
