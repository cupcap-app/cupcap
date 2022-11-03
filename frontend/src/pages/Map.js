import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Button, Box, Container } from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { use100vh } from "react-div-100vh";
import mapStyles from "../utils/mapStyles";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import ConnectWalletModal from "../components/ConnectWalletModal";
import ProfileFormModal from "../components/ProfileFormModal";
import CardSelectModal from "../components/CardSelectModal";
import maker_self from "../public/marker_self.svg";
import EventMarker from "../components/EventMarker";
import ActionButtons from "../components/ActionButtons";
import MypageButton from "../components/MypageButton";
import CalendarTabs from "../components/CalendarTabs";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentDay = currentDate.getDate();

const STATUS_WALLET_CONNECT = "STATUS_WALLET_CONNECT";
const STATUS_PROFILE_SETTING = "STATUS_PROFILE_SETTING";
const STATUS_CARD_SETTING = "STATUS_CARD_SETTING";
const STATUS_DONE = "STATUS_DONE";

const InitialForm = (props) => {
  const { provider } = props;
  const [doneProfileSetting, setProfileSettingDone] = useState(false);
  const [doneCardSetting, setCardSettingDone] = useState(false);

  const status = useMemo(() => {
    if (!provider) {
      return STATUS_WALLET_CONNECT;
    }

    if (!doneProfileSetting) {
      return STATUS_PROFILE_SETTING;
    }

    if (!doneCardSetting) {
      return STATUS_CARD_SETTING;
    }

    return STATUS_DONE;
  }, [provider, doneProfileSetting, doneCardSetting]);

  switch (status) {
    case STATUS_WALLET_CONNECT:
      return <ConnectWalletModal />;
    case STATUS_PROFILE_SETTING:
      return <ProfileFormModal setDone={setProfileSettingDone} />;
    case STATUS_CARD_SETTING:
      return <CardSelectModal setDone={setCardSettingDone} />;
    case STATUS_DONE:
      return null;
  }
};

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
          <InitialForm provider={provider} />

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

// ENSで登録

// ENSが登録されている場合
// => レコードだけ更新

// ENSが登録されていない場合
// => ENSドメインとyear入力
// => Loader
// => レコードを更新
