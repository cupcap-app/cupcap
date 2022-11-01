import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Box, TextField, Stack } from "@mui/material";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import Loading from "./Loading";
import ButtonPrimary from "./ButtonPrimary";
import camera from "../public/camera.png";

/**
 * プロフィール入力モーダル
 */
const PlofileFormModal = ({ setDone }) => {
  // web3auth
  const { provider, ensTextRecord, changeNetwork } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar: "",
      displayName: "",
      github: "",
      twitter: "",
      discord: "",
      telegram: "",
      email: "",
      url: "",
      description: "",
    },
  });

  const selectImage = () => {};
  const onSubmit = async (data) => {
    // TODO weavedb保存
    console.log(data);
    await changeNetwork("ethereum");
    setDone(true);
  };

  const validationRules = {
    displayName: {
      required: "表示名を入力してください。",
    },
  };

  return (
    <>
      {provider && (
        <>
          <Box
            sx={{
              width: "90%",
              height: "90%",
              backgroundColor: "rgba(217, 217, 217, 0.1)",
              border: 0,
              borderRadius: "15px",
              backdropFilter: "blur(20px)",
              boxShadow: 10,
              display: "block",
              m: "auto",
              my: 3,
              overflow: "auto",
            }}
          >
            <Box sx={{ p: 3 }}>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.1)!important",
                  borderRadius: "15px",
                  width: 200,
                  height: 200,
                  display: "block",
                  m: "auto",
                }}
              >
                <input type="file" hidden onChange={selectImage} />
                <Box
                  component="img"
                  sx={{
                    width: 50,
                    height: 50,
                    display: "block",
                    m: "auto",
                    mt: "65px",
                  }}
                  alt="camera"
                  src={camera}
                />
              </Button>
            </Box>
            <Box sx={{ m: 2 }}>
              <Stack
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                spacing={2}
              >
                <Controller
                  name="displayName"
                  control={control}
                  rules={validationRules.displayName}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      type="text"
                      label="display name"
                      error={errors.displayName !== undefined}
                      helperText={errors.displayName?.message}
                    />
                  )}
                />
                <Controller
                  name="github"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      type="text"
                      label="github"
                    />
                  )}
                />
                <Controller
                  name="twitter"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      type="text"
                      label="twitter"
                    />
                  )}
                />
                <Controller
                  name="discord"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      type="text"
                      label="discord"
                    />
                  )}
                />
                <Controller
                  name="telegram"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      type="text"
                      label="telegram"
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      type="text"
                      label="email"
                    />
                  )}
                />
                <Controller
                  name="url"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      type="text"
                      label="url"
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      type="text"
                      label="description"
                    />
                  )}
                />
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
                    sx={{
                      color: "#FFF",
                      backgroundColor: "#251E2F",
                      height: 40,
                      width: "70%",
                      maxWidth: 300,
                      borderRadius: 10,
                      display: "block",
                      margin: "auto",
                      my: 2,
                      boxShadow: 5,
                      textTransform: "none",
                      opacity: 0.7,
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default PlofileFormModal;
