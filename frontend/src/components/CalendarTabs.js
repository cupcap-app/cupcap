import React, { useState, useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";
import Slider from "react-slick";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentDay = currentDate.getDate();
const currentLastDate = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  0
).getDate();

const dayBoxStyle = {
  width: "80%",
  height: 50,
  backgroundColor: "rgba(217, 217, 217, 0.1)",
  border: 0,
  borderRadius: "10px",
  backdropFilter: "blur(3.83333px)",
  boxShadow:
    "inset 3.83333px -3.83333px 3.83333px rgba(194, 194, 194, 0.1), inset -3.83333px 3.83333px 3.83333px rgba(255, 255, 255, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(217, 217, 217, 0.1)",
    backdropFilter: "blur(3.83333px)",
    boxShadow:
      "inset 3.83333px -3.83333px 3.83333px rgba(194, 194, 194, 0.1), inset -3.83333px 3.83333px 3.83333px rgba(255, 255, 255, 0.1)",
  },
  margin: "auto",
};
const monthBoxStyle = {
  width: "80%",
  height: 50,
  backgroundColor: "rgba(217, 217, 217, 0.1)",
  border: 0,
  borderRadius: "10px",
  backdropFilter: "blur(3.83333px)",
  boxShadow:
    "inset 3.83333px -3.83333px 3.83333px rgba(194, 194, 194, 0.1), inset -3.83333px 3.83333px 3.83333px rgba(255, 255, 255, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(217, 217, 217, 0.1)",
    backdropFilter: "blur(3.83333px)",
    boxShadow:
      "inset 3.83333px -3.83333px 3.83333px rgba(194, 194, 194, 0.1), inset -3.83333px 3.83333px 3.83333px rgba(255, 255, 255, 0.1)",
  },
  margin: "auto",
};
const daySliderSettings = {
  className: "center",
  centerMode: true,
  infinite: true,
  centerPadding: "0px",
  slidesToShow: 7,
  speed: 100,
  swipeToSlid: true,
  focusOnSelect: true,
  initialSlide: currentDay - 1,
};
const monthSliderSettings = {
  className: "center",
  centerMode: true,
  infinite: true,
  centerPadding: "0px",
  slidesToShow: 1,
  speed: 100,
  swipeToSlid: true,
  focusOnSelect: true,
  initialSlide: currentMonth - 1,
};

const MONTH = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

/**
 * カレンダータブ
 */
const CalendarTabs = ({ setDone }) => {
  // web3auth
  const { provider, ensTextRecord, changeNetwork } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState(false);
  const [monthSlider, setMonthSlider] = useState();
  const [daySlider, setDaySlider] = useState();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedMonthLastDate, setSelectedMonthLastDate] =
    useState(currentLastDate);

  const afterChangeMonth = (event) => {
    const lastDate = new Date(
      currentDate.getFullYear(),
      event + 1,
      0
    ).getDate();
    setSelectedMonth(event + 1);
    setSelectedMonthLastDate(lastDate);
  };
  const afterChangeDay = (event) => {
    console.log(`${selectedMonth}/${event + 1}`);
    setSelectedDay(event + 1);
    // TODO イベント取得処理
  };

  useEffect(() => {
    if (!selectedMonth || !daySlider) {
      return;
    }
    daySlider.slickGoTo(0);
  }, [selectedMonth]);

  return (
    <>
      {provider && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: "7%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 200,
              maxWidth: "15%",
            }}
          >
            <Slider
              {...monthSliderSettings}
              ref={(slider) => setMonthSlider(slider)}
              afterChange={afterChangeMonth}
            >
              {[...Array(12).keys()].map((index) => (
                <Box key={`month-${index}`} sx={{ height: 50 }}>
                  <Box sx={monthBoxStyle}>
                    <Typography
                      align="center"
                      sx={{ lineHeight: "50px", color: "#FFF" }}
                    >
                      {MONTH[index]}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Slider>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "15%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 360,
              maxWidth: "80%",
              ".slick-slide": {
                opacity: 0.7,
                transform: "scale(0.8)",
              },
              ".slick-center": {
                opacity: 1,
                transform: "scale(1)",
              },
            }}
          >
            <Slider
              {...daySliderSettings}
              ref={(slider) => setDaySlider(slider)}
              afterChange={afterChangeDay}
            >
              {[...Array(selectedMonthLastDate).keys()].map((index) => (
                <Box
                  key={`${selectedMonth}-${index}`}
                  sx={{ px: 1, height: 50 }}
                >
                  <Box sx={dayBoxStyle}>
                    <Typography
                      align="center"
                      sx={{ lineHeight: "50px", color: "#FFF" }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Slider>
          </Box>
        </>
      )}
    </>
  );
};

export default CalendarTabs;
