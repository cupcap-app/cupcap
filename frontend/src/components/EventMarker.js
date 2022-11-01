import { useState } from "react";
import { Marker } from "@react-google-maps/api";
import { Box, Modal, Typography } from "@mui/material";
import event_pin from "../public/event_pin.svg";

const modalStyle = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxWidth: "70%",
  maxHeight: "90%",
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
 * イベントマーカーコンポーネント
 */
const EventMarker = ({ eventInfo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.15)" } }}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ color: "#FFF" }}>
            {eventInfo.title}
          </Typography>
          <Typography sx={{ mt: 2, color: "#FFF" }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default EventMarker;
