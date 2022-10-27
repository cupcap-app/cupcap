import { Button } from "@mui/material";

const ButtonPrimary = ({ text, onClickHandler }) => {
  return (
    <Button
      variant="contained"
      onClick={onClickHandler}
      sx={{
        height: 40,
        width: "70%",
        maxWidth: 300,
        borderRadius: 10,
        display: "block",
        margin: "auto",
        my: 2,
        boxShadow: 5,
        textTransform: "none",
      }}
    >
      {text}
    </Button>
  );
};

export default ButtonPrimary;
