import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Button, Box, Container } from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { use100vh } from "react-div-100vh";
import mapStyles from "../utils/mapStyles";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { useEvents, useEventInTimeRange } from "../hooks/useGraph";
import ConnectWalletModal from "../components/ConnectWalletModal";
import ProfileFormModal from "../components/ProfileFormModal";
import CardSelectModal from "../components/CardSelectModal";
import maker_self from "../public/marker_self.svg";
import EventMarker from "../components/EventMarker";
import ActionButtons from "../components/ActionButtons";
import MypageButton from "../components/MypageButton";
import CalendarTabs from "../components/CalendarTabs";
import hologram_front from "../public/hologram_card_front.png";
import hologram_back from "../public/hologram_card_back.png";
import email_icon from "../public/email_icon.png";
import discord_icon from "../public/discord_icon.png";
import github_icon from "../public/github_icon.png";
import url_icon from "../public/url_icon.png";
import telegram_icon from "../public/telegram_icon.png";
import twitter_icon from "../public/twitter_icon.png";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentDay = currentDate.getDate();

const STATUS_WALLET_CONNECT = "STATUS_WALLET_CONNECT";
const STATUS_PROFILE_SETTING = "STATUS_PROFILE_SETTING";
const STATUS_CARD_SETTING = "STATUS_CARD_SETTING";
const STATUS_DONE = "STATUS_DONE";

const InitialForm = (props) => {
  const { provider } = props;
  const [doneProfileSetting, setProfileSettingDone] = useState(true);
  const [doneCardSetting, setCardSettingDone] = useState(true);

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
  // プロフィール情報
  const [plofileInfo, setPlofileInfo] = useState({
    avater: null,
    displayName: null,
    discription: null,
    url: null,
    email: null,
    discord: null,
    telegram: null,
    github: null,
    twitter: null,
  });
  // 名刺デザイン画像
  const [cardImage, setCardImage] = useState({
    front: null,
    back: null,
    link: {
      url: null,
      email: null,
      discord: null,
      telegram: null,
      github: null,
      twitter: null,
    },
  });

  // イベント開催地List
  const [eventInfoList, setEventInfoList] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    year: 2022,
    month: currentMonth,
    day: currentDay,
  });
  const [isPinMode, setIsPinMode] = useState(false);

  const { login, isInitializing, provider } = useWeb3Auth();
  const { status: fetchEventsStatus, data: fetchEventsData } = useEvents();

  // イベント作成モーダル
  const onClickMapHandler = (event) => {
    if (!isPinMode) {
      return;
    }
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    console.log(lat, lng);
    console.log(fetchEventsStatus, fetchEventsData);
  };

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
  // 自分の名刺デザイン取得
  const getCardInfo = () => {
    //TODO 名刺デザイン取得
    setCardImage({
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
    });
    // TODO プロフィール情報取得
    setPlofileInfo({
      avater: "https://live---metadata-5covpqijaa-uc.a.run.app/images/6316",
      displayName: "yusaka.eth",
      discription:
        "crypto botter / full stack engineer / dydx grants / TicketMe engineer @ticketme_yeah",
      url: "https://www.pedro.tokyo/",
      email: "yusuke@ticketme.jp",
      discord: "yusaka#7114",
      telegram: null,
      github: "yusakapon",
      twitter: "yusaka_btc",
    });
  };
  // イベント取得
  const getEventPosition = async () => {
    // TODO イベント取得
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
    getCardInfo();
  }, []);

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyBJ2t7R-5UmUUKZtItzAh6wMG9A_Wb6mWE">
        <GoogleMap
          onClick={onClickMapHandler}
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
          <ActionButtons setIsPinMode={setIsPinMode} />
          {/* <CreateEventModal  /> */}
          <MypageButton cardImage={cardImage} plofileInfo={plofileInfo} />
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
