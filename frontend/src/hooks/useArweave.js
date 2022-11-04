import React, { useCallback } from "react";

const REACT_APP_ARWEAVE_UPLOADER_URL =
  process.env.REACT_APP_ARWEAVE_UPLOADER_URL;
const ARWEAVE_SERVER_URL = "https://arweave.net";

export const useArweave = () => {
  // ファイルオブジェクトをArweaveのアップロードする
  // 返り値はhash値
  const uploadFile = useCallback(async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(REACT_APP_ARWEAVE_UPLOADER_URL, {
      method: "POST",
      body: formData,
    });
    const { ids, type } = await res.json();

    console.log("uploadFile", type);

    return ids[0];
  }, []);

  // JSONデータをarweaveにアップロードする
  // 返り値はhash値
  const uploadJSON = useCallback(async (data) => {
    const res = await fetch(REACT_APP_ARWEAVE_UPLOADER_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { ids, type } = await res.json();

    console.log("uploadJSON", type);

    return ids[0];
  }, []);

  // TxIDからダウンロード用のURLを取得する
  const getDownloadURL = useCallback((txIDOrURL) => {
    let txID = txIDOrURL;
    if (txID.startsWith("ar://")) {
      txID = txID.substring("ar://".length);
    }

    return `${ARWEAVE_SERVER_URL}/${txID}`;
  }, []);

  // 画像をダウンロードしてURLを作る
  // もしくはreact-arweave-imageを使って表示する
  const downloadImage = useCallback(async (txId) => {
    const url = getDownloadURL(txId) + "/data";

    const res = await fetch(url);
    const blob = await res.blob();

    return URL.createObjectURL(blob);
  }, []);

  // JSONデータをダウンロードしてオブジェクトとして返す
  const downloadJSON = useCallback(async (txId) => {
    const url = getDownloadURL(txId);
    const res = await fetch(url);
    const data = await res.json();

    return data;
  }, []);

  return {
    uploadFile,
    uploadJSON,
    getDownloadURL,
    downloadImage,
    downloadJSON,
  };
};
