import { createContext, useContext, useEffect, useState } from "react";
import { Button, Box, Container } from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import mapStyles from "../utils/mapStyles";
import ConnectWalletModal from "../components/ConnectWalletModal";
import PlofileFormModal from "../components/PlofileFormModal";
// import { Container } from "@mui/system";

const Map = () => {
  const [userPosition, setUserPosition] = useState({
    lat: 35.69575,
    lng: 139.77521,
  });

  const getPosition = () => {
    const posSuccess = (position) => {
      setUserPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };
    const posError = (err) => {
      console.log(err);
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(posSuccess, posError); // Passing in a success callback and an error callback fn
    } else {
      alert("Sorry, Geolocation is not supported by this browser."); // Alert is browser does not support geolocation
    }
  };

  useEffect(() => {
    getPosition();
  }, []);

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyBJ2t7R-5UmUUKZtItzAh6wMG9A_Wb6mWE">
        <GoogleMap
          mapContainerStyle={{
            height: "100vh",
            width: "100%",
          }}
          center={userPosition}
          zoom={15}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
          }}
          onClick={getPosition}
        >
          <ConnectWalletModal />
          <PlofileFormModal />
          <Marker title={"現在地"} position={userPosition} />
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default Map;
