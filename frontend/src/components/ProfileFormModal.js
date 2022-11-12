import React, { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Box, TextField, Stack, InputAdornment } from "@mui/material";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import Loading from "./Loading";
import camera from "../public/camera.png";
import {
  getOneYearInSeconds,
  STATUS_DOMAIN_READY,
  STATUS_SENDING_COMMITMENT,
  STATUS_SENDING_REGISTER,
  STATUS_SENDING_REVERSE_RESOLVING,
  STATUS_SETTING_PROFILE,
  STATUS_WAITING_PERIOD,
  useENS,
} from "../hooks/useENS";
import { useWeaveDB } from "../hooks/useWeaveDB";
import { useArweave } from "../hooks/useArweave";
import { ethers } from "ethers";
import { useToast } from "@chakra-ui/react";
import { ENS } from "@ensdomains/ensjs";

const MODE_PROFILE_INPUT = "MODE_PROFILE_INPUT";
const MODE_SELECT_ENS = "MODE_SELECT_ENS";
const MODE_BUYING_ENS = "MODE_BUYING_ENS";

const ENSRegistrationModal = (props) => {
  const { data, setDone } = props;
  const toast = useToast();

  const { walletAddress } = useWeb3Auth();
  const [inputDomain, setInputDomain] = useState("");
  const [year, setYear] = useState(1);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(null);
  const [inputDomainError, setInputDomainError] = useState("");
  const {
    status,
    registerENSName,
    registerProfile,
    available,
    valid,
    getPrice,
  } = useENS();

  useEffect(() => {
    (async () => {
      const duration = year * getOneYearInSeconds();
      const res = await getPrice(inputDomain, duration);

      setPrice(ethers.utils.formatEther(res));
    })();
  }, [year]);

  useEffect(() => {
    (async () => {
      if (inputDomain.length === 0) {
        setInputDomainError("");
        return;
      }

      const isValid = await valid(inputDomain + ".eth");
      if (!isValid) {
        setInputDomainError("ドメインの形式が不正です");
        return;
      }

      const isAvailable = await available(inputDomain + ".eth");
      if (!isAvailable) {
        setInputDomainError("ドメインはすでに使用されています");
        return;
      }

      setInputDomainError("");
    })();
  }, [inputDomain]);

  const registerRecord = useCallback(
    async (domain) => {
      await registerProfile(domain, {
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

      setDone(true);
    },
    [data, setDone]
  );

  const registerDomain = useCallback(async () => {
    console.log("registerDomain", inputDomain);
    if (!inputDomain) {
      return;
    }

    setLoading(true);
    await registerENSName(inputDomain, year * getOneYearInSeconds());
    await registerRecord(inputDomain + ".eth");
  }, [inputDomain, registerRecord]);

  if (loading) {
    return (
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
        <Box
          sx={{
            paddingTop: "70%",
          }}
        >
          <Loading />
          <p style={{ color: "white", textAlign: "center", marginTop: "8px" }}>
            {(() => {
              switch (status) {
                case STATUS_SENDING_COMMITMENT:
                  return "コミットメントを提出中です";
                case STATUS_WAITING_PERIOD:
                  return "登録前待機中です";
                case STATUS_SENDING_REGISTER:
                  return "登録中です";
                case STATUS_SENDING_REVERSE_RESOLVING:
                  return "逆引きの登録中です";
                case STATUS_SETTING_PROFILE:
                  return "プロフィールの登録中です";
                case STATUS_DOMAIN_READY:
                  return "ドメインの登録が完了しました";
              }
            })()}
          </p>
        </Box>
      </Box>
    );
  }

  return (
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
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "30%",
        }}
      >
        <img src="/ens.svg" />
      </Box>
      <Box
        sx={{
          marginTop: "10%",
          padding: "0% 10% 0%",
        }}
      >
        <TextField
          size="small"
          type="text"
          label="SEARCH DOMAIN"
          style={{ width: "100%" }}
          error={!!inputDomainError}
          helperText={inputDomainError}
          value={inputDomain}
          onChange={(e) => setInputDomain(e.target.value)}
        />
      </Box>

      <Box
        sx={{
          marginTop: "32px",
          padding: "0% 10% 0%",
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          size="small"
          type="text"
          readonly={true}
          style={{ width: "100%" }}
          value={walletAddress}
        />
      </Box>
      <Box
        sx={{
          marginTop: "32px",
          padding: "0% 10% 0%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          size="small"
          type="number"
          style={{ width: "100%" }}
          value={year}
          onChange={(e) => {
            const y = Number.parseInt(e.target.value);

            setYear(Number.isNaN(y) ? 1 : y);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <div style={{ paddingBottom: "4px" }}>
                  <img src="/time.svg" />
                </div>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box
        sx={{
          marginTop: "32px",
          padding: "0% 10% 0%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          size="small"
          type="text"
          style={{ width: "100%" }}
          value={price !== null ? price : ""}
          readonly={true}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <div style={{ paddingBottom: "4px", paddingLeft: "2px" }}>
                  <img src="/eth.svg" />
                </div>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box>
        <Button
          onClick={(e) => {
            e.preventDefault();

            registerDomain();
          }}
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
        >
          Register Domain
        </Button>
      </Box>
    </Box>
  );
};

/**
 * プロフィール入力モーダル
 */
const ProfileFormModal = ({ setDone }) => {
  // web3auth
  // TODO: fix
  const [mode, setMode] = useState(MODE_PROFILE_INPUT);

  const { provider, walletAddress } = useWeb3Auth();
  const {
    domain,
    registerENSName,
    getPrimaryDomain,
    getProfile,
    registerProfile: registerProfileInENS,
  } = useENS();
  const {
    getProfile: getProfileFromWeaveDB,
    getMyProfile: getMyProfileFromWeaveDB,
    putProfile: putProfileInWeaveDB,
  } = useWeaveDB();
  const { downloadImage, downloadJSON, uploadFile, uploadJSON } = useArweave();

  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImageHash, setUploadedImageHash] = useState();
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

  const selectImage = async (e) => {
    const res = await uploadFile(e.target.files[0]);
    console.log("file uploaded", res);
    setUploadedImageHash(res);
  };

  // TODO: ドメイン登録画面に繊維する
  // ドメイン登録を呼び出す
  // primaryDomain = await registerENSName("hogehogefugafugapiyo.eth");
  // await registerProfileInENS(primaryDomain, {
  //   // ENSのレコードにマッピング
  //   avatar: data.avatar ?? "",
  //   displayName: data.displayName ?? "",
  //   "com.github": data.github ?? "",
  //   "com.twitter": data.twitter ?? "",
  //   "com.discord": data.discord ?? "",
  //   "org.telegram": data.telegram ?? "",
  //   email: data.email ?? "",
  //   url: data.url ?? "",
  //   description: data.description ?? "",
  // });

  const [data, setData] = useState(null);

  const onClickSaveToENS = useCallback(
    async (data) => {
      // const primaryDomain = await getPrimaryDomain(walletAddress);
      // if (primaryDomain) {
      //   await registerProfileInENS(primaryDomain, {
      //     // ENSのレコードにマッピング
      //     avatar: data.avatar ?? "",
      //     displayName: data.displayName ?? "",
      //     "com.github": data.github ?? "",
      //     "com.twitter": data.twitter ?? "",
      //     "com.discord": data.discord ?? "",
      //     "org.telegram": data.telegram ?? "",
      //     email: data.email ?? "",
      //     url: data.url ?? "",
      //     description: data.description ?? "",
      //   });

      //   setDone();

      //   return;
      // }

      setData(data);
      setMode(MODE_SELECT_ENS);
    },
    [getPrimaryDomain, walletAddress]
  );

  const onClickSaveToWeaveDB = useCallback(
    async (data) => {
      // console.log("My Profile", await getMyProfileFromWeaveDB());
      // const res = await uploadJSON({
      //   hoge: "fuga",
      //   piyo: "hoge",
      // });
      // console.log("!!res", res);
      // await putProfileInWeaveDB({
      //   avatar: data.avatar ?? "",
      //   display_name: data.displayName,
      //   com_github: data.github ?? "",
      //   com_twitter: data.com_twitter ?? "",
      //   com_discord: data.twitter ?? "",
      //   org_telegram: data.telegram ?? "",
      //   email: data.email ?? "",
      //   url: data.url ?? "",
      //   description: data.description ?? "",
      // });
      setDone(true);
    },
    [walletAddress]
  );

  useEffect(() => {
    (async () => {
      // 画像
      {
        /* <ArweaveImage
              hash={"_h4lzHk0BVNE8rhn_f9eg_iaQOYlmPvXTy-ab7yWBRU"}
            /> */
      }

      // JSON
      const data = await downloadJSON(
        "6TxCk5h7IyuINMLmgQRBCpOON5Rff_mqix2Zm8WsMMs"
      );
      console.log("!!!!data", data);
    })();
  }, []);

  const validationRules = {
    displayName: {
      required: "表示名を入力してください。",
    },
  };

  if (!provider) {
    return null;
  }

  if (mode === MODE_PROFILE_INPUT) {
    return (
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
            {uploadedImageHash ? (
              <>
                <Box
                  component="img"
                  sx={{
                    width: 200,
                    display: "block",
                    m: "auto",
                  }}
                  alt="uploadedImage"
                  src={`https://arweave.net/${uploadedImageHash}`}
                />
                {/* <ArweaveImage hash={uploadedImageHash} className="w-24" /> */}
              </>
            ) : (
              <>
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
              </>
            )}
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
                  <TextField {...field} size="small" type="text" label="url" />
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
                  disabled={true}
                  onClick={handleSubmit(onClickSaveToWeaveDB)}
                >
                  Save to WeaveDB
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </>
    );
  }

  if (mode === MODE_SELECT_ENS) {
    return <ENSRegistrationModal data={data} setDone={setDone} />;
  }

  return null;
};

export default ProfileFormModal;
