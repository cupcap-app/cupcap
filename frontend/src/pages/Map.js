import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { use100vh } from "react-div-100vh";
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

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentDay = currentDate.getDate();

const Map = () => {
  const height100vh = use100vh();
  // 現在地
  const [userPosition, setUserPosition] = useState({
    lat: 35.69575,
    lng: 139.77521,
  });

  // イベント開催地List
  const [eventInfoList, setEventInfoList] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    year: 2022,
    month: currentMonth,
    day: currentDay,
  });
  const [mode, setMode] = useState();

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
          lat: userPosition.lat + 0.005 * Math.random() * 2,
          lng: userPosition.lng + 0.005 * Math.random() * 2,
        },
      },
      {
        title: "テストイベントB",
        position: {
          lat: userPosition.lat + 0.005 * Math.random() * 2,
          lng: userPosition.lng - 0.005 * Math.random() * 2,
        },
      },
      {
        title: "テストイベントC",
        position: {
          lat: userPosition.lat - 0.005 * Math.random() * 2,
          lng: userPosition.lng - 0.005 * Math.random() * 2,
        },
      },
      {
        title: "テストイベントD",
        position: {
          lat: userPosition.lat - 0.005 * Math.random() * 2,
          lng: userPosition.lng - 0.005 * Math.random() * 2,
        },
      },
      {
        title: "テストイベントE",
        position: {
          lat: userPosition.lat - 0.005 * Math.random() * 2,
          lng: userPosition.lng - 0.005 * Math.random() * 2,
        },
      },
    ]);
  };

  useEffect(() => {
    getEventPosition();
  }, [userPosition, selectedDate]);

  useEffect(() => {
    getPosition();
  }, []);

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyBJ2t7R-5UmUUKZtItzAh6wMG9A_Wb6mWE">
        <GoogleMap
          mapContainerStyle={{
            height: height100vh,
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
          <CalendarTabs setSelectedDate={setSelectedDate} />
          <ActionButtons setMode={setMode} />
          <MypageButton />
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
