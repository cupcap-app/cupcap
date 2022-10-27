import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = ({ text, sx }) => {
  return (
    <>
      <Box sx={sx}>
        <CircularProgress
          sx={{
            display: "block",
            margin: "auto",
            my: 2,
          }}
        />
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </Typography>
      </Box>
    </>
  );
};

export default Loading;
