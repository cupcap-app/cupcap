import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import mapStyles from "../utils/mapStyles";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import ConnectWalletModal from "../components/ConnectWalletModal";
import PlofileFormModal from "../components/PlofileFormModal";
import CardSelectModal from "../components/CardSelectModal";
import maker_self from "../public/marker_self.svg";
import EventMarker from "../components/EventMarker";
import ActionButtons from "../components/ActionButtons";
import MypageButton from "../components/MypageButton";
import CalendarTabs from "../components/CalendarTabs";

const Map = () => {
  // 現在地
  const [userPosition, setUserPosition] = useState({
    lat: 35.69575,
    lng: 139.77521,
  });

  // イベント開催地List
  const [eventInfoList, setEventInfoList] = useState([]);

  const { login, isInitializing, provider } = useWeb3Auth();
  const [donePlofileSetting, setDonePlofileSetting] = useState(false);
  const [doneCardSetting, setDoneCardSetting] = useState(false);

  // 自分の現在地取得
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
  // イベント取得
  const getEventPosition = () => {
    // TODO テスト用　現在地を基準に3ヶ所設定
    setEventInfoList([
      {
        title: "テストイベントA",
        position: {
          lat: userPosition.lat + 0.008,
          lng: userPosition.lng + 0.008,
        },
      },
      {
        title: "テストイベントB",
        position: {
          lat: userPosition.lat + 0.02,
          lng: userPosition.lng - 0.02,
        },
      },
      {
        title: "テストイベントC",
        position: {
          lat: userPosition.lat - 0.01,
          lng: userPosition.lng - 0.002,
        },
      },
    ]);
  };

  useEffect(() => {
    getEventPosition();
  }, [userPosition]);

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
            keyboardShortcuts: false,
          }}
        >
          <ActionButtons />
          <MypageButton />
          <CalendarTabs />
          {!provider ? (
            <>
              <ConnectWalletModal />
            </>
          ) : (
            <>
              {donePlofileSetting === false ? (
                <>
                  <PlofileFormModal setDone={setDonePlofileSetting} />
                </>
              ) : (
                <>
                  {doneCardSetting === false && (
                    <>
                      <CardSelectModal setDone={setDoneCardSetting} />
                    </>
                  )}
                </>
              )}
            </>
          )}

          <Marker
            title={"現在地"}
            position={userPosition}
            icon={{
              url: maker_self,
            }}
            visible={!!window.google}
            animation={window.google && window.google.maps.Animation.BOUNCE}
            clickable={false}
          />
          {eventInfoList.map((eventInfo) => {
            return (
              <>
                <EventMarker
                  key={`${eventInfo.title}-${eventInfo.position.lat}-${eventInfo.position.lng}`}
                  eventInfo={eventInfo}
                />
              </>
            );
          })}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default Map;
