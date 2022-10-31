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

const DomainForm = () => {
  const { ensName, changeNetwork, registerEnsName } = useWeb3Auth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      domainName: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data.domainName);

    await registerEnsName(data.domainName + ".eth");
  };

  const validationRules = {
    domainName: {
      required: "ドメインを入力してください。",
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
                  name="domainName"
                  control={control}
                  rules={validationRules.domainName}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      label="domainName"
                      error={errors.domainName !== undefined}
                      helperText={errors.domainName?.message}
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
                    ドメインを取得する
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

export default DomainForm;
