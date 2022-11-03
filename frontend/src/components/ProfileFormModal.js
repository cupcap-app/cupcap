import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Box, TextField, Stack } from "@mui/material";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import Loading from "./Loading";
import ButtonPrimary from "./ButtonPrimary";
import camera from "../public/camera.png";
import { useENS } from "../hooks/useENS";

/**
 * プロフィール入力モーダル
 */
const ProfileFormModal = ({ setDone }) => {
  // web3auth
  const { provider, walletAddress } = useWeb3Auth();
  const {
    domain,
    registerENSName,
    getPrimaryDomain,
    getProfile,
    registerProfile: registerProfileInENS,
  } = useENS();

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

  const onClickSaveToENS = useCallback(
    async (data) => {
      let primaryDomain = await getPrimaryDomain(walletAddress);
      if (!primaryDomain) {
        // TODO: ドメイン登録画面に繊維する
        // ドメイン登録を呼び出す
        // primaryDomain = await registerENSName("hogehogefugafugapiyo.eth");
      }

      const currentProfile = await getProfile(primaryDomain, ["email", "url"]);

      console.log("currentProfile", currentProfile);

      await registerProfileInENS(primaryDomain, {
        // ENSのレコードにマッピング
        avatar: data.avatar ?? "",
        displayName: data.displayName ?? "",
        "com.github": data.github ?? "",
        "com.twitter": data.twitter ?? "",
        "com.discord": data.discord ?? "",
        "org.telegram": data.telegram ?? "",
        email: data.email ?? "",
        url: data.url ?? "",
        description: data.description ?? "",
      });
    },
    [getPrimaryDomain, walletAddress]
  );

  const onClickSaveToWeaveDB = async (data) => {
    console.log("click SaveToWeaveDB", data);
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
                // onSubmit={handleSubmit(onSubmit)}
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
                      width: "45%",
                      maxWidth: 300,
                      borderRadius: 10,
                      display: "block",
                      margin: "auto",
                      my: 2,
                      boxShadow: 5,
                      textTransform: "none",
                      opacity: 0.7,
                    }}
                    onClick={handleSubmit(onClickSaveToENS)}
                  >
                    Save to ENS
                  </Button>
                  <Button
                    type="submit"
                    disabled={true}
                    sx={{
                      color: "#FFF",
                      backgroundColor: "#251E2F",
                      height: 40,
                      width: "45%",
                      maxWidth: 300,
                      borderRadius: 10,
                      display: "block",
                      margin: "auto",
                      my: 2,
                      boxShadow: 5,
                      textTransform: "none",
                      opacity: 0.7,
                    }}
                    onClick={handleSubmit(onClickSaveToWeaveDB)}
                  >
                    Save to WeaveDB
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

export default ProfileFormModal;
