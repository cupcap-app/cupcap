# profilens

## Arweaveアップロードプロキシ

Lambdaに任意のデータをArweaveにアップロードするプロキシがある。このLambdaはS3に保存されているArweaveのウォレットキーをコール時に読み取る。
現在、S3にアップロードしLambdaの環境変数に設定されている、S3のパラメータは以下の通り

```
BUCKET_NAME=cupcap-keys
ARWEAVE_KEY_FILE_NAME=arweave-key.json
```

コードは`amplify/backend/function/cupcapresourceuploader`以下にある。コードのアップデートをするには`amplify push`をする。
