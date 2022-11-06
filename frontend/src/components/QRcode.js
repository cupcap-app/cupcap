import { Button } from "@mui/material";
import { useQRCode } from "next-qrcode";

const QRcode = ({ text, width }) => {
  const { Canvas } = useQRCode();
  return (
    <Canvas
      text={text}
      options={{
        type: "image/jpeg",
        quality: 0.3,
        level: "M",
        margin: 3,
        scale: 4,
        width: width,
        color: {
          dark: "#000",
          light: "#FFF",
        },
      }}
    />
  );
};

export default QRcode;