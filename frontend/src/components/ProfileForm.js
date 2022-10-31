import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  TextField,
  Stack,
} from "@mui/material";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

const ProfileForm = () => {
  const { ensName, ensTextRecord, changeNetwork } = useWeb3Auth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar: "",
      displayName: "",
      github: "",
      twitter: ensTextRecord.twitter,
      discord: "",
      telegram: "",
      email: "",
      url: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    await changeNetwork("ethereum");
  };

  const validationRules = {
    displayName: {
      required: "表示名を入力してください。",
    },
  };
  return (
    <>
      {ensName !== null && (
        <>
          <Box sx={{ m: 5 }}>
            <Box sx={{ m: 5 }}>
              <Stack
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                spacing={2}
              >
                <Controller
                  name="avatar"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="text" label="avatar" />
                  )}
                />
                <Controller
                  name="displayName"
                  control={control}
                  rules={validationRules.displayName}
                  render={({ field }) => (
                    <TextField
                      {...field}
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
                    <TextField {...field} type="text" label="github" />
                  )}
                />
                <Controller
                  name="twitter"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="text" label="twitter" />
                  )}
                />
                <Controller
                  name="discord"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="text" label="discord" />
                  )}
                />
                <Controller
                  name="telegram"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="text" label="telegram" />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="text" label="email" />
                  )}
                />
                <Controller
                  name="url"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="text" label="url" />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      label="description"
                      multiline
                      maxRows={10}
                      minRows={3}
                    />
                  )}
                />
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
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
                    保存する
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

export default ProfileForm;
