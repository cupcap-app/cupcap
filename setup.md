# セットアップ方法

## Arweave アップロードプロキシ

Lambda に任意のデータを Arweave にアップロードするプロキシがある。この Lambda は S3 に保存されている Arweave のウォレットキーをコール時に読み取る。
現在、S3 にアップロードし Lambda の環境変数に設定されている、S3 のパラメータは以下の通り

```
BUCKET_NAME=cupcap-keys
ARWEAVE_KEY_FILE_NAME=arweave-key.json
```

コードは`amplify/backend/function/cupcapresourceuploader`以下にある。コードのアップデートをするには`amplify push`をする。

## WeaveDB セットアップ

### DB のセットアップ

WeaveDB のレポジトリをクローンしてデプロイする。

```bash
git clone https://github.com/weavedb/weavedb.git
cd weavedb
yarn
node scripts/generate-wallet.js mainnet
yarn deploy
```

コントラクト ID と TxID が取得できる、コントラクト ID は今後使用する。

```bash
{
  contractTxId: 'iujhrXKWfegkPzCXX8Cxmf1LCOadZoigSOmM_FgvoyQ',
  srcTxId: '8h8kO41WpUvc4bW1bzJmi70w3URulmCxoQl42Z7tSsc'
}
```

`node scripts/generate-wallet.js mainnet`で作成したウォレットは`scripts/.wallets`以下に入っている。  
これを以下の 2 つの場所にコピーする

- WeaveDB の`node/net/grpc/gateway/weavedb/node-server/weavedb.config.js`の`wallet`部分 (gRPC サーバ用)
- Cupcap の`scripts/.wallets/wallet-manifest.json`にコピーする。(push はしない)

`scripts`に移動して、スキーマを設定する。この際、ウォレットのパスとコントラクト TxID を指定する。

```bash
$ cd scripts
$ npm i
$ npm run setup-weavedb-schema ../.wallets/wallet-mainnet.json iujhrXKWfegkPzCXX8Cxmf1LCOadZoigSOmM_FgvoyQ
```

React アプリの環境変数に gRPC サーバの URL とコントラクト TxID がセットされているのを確認する。

### gRPC ノードのセットアップ

AWS で ubuntu のインスタンスを立ち上げる。`docker`と`docker-compose`をインストールする。

https://medium.com/devops-and-sre-learning/installation-guide-for-latest-docker-and-docker-compose-version-on-ubuntu-linux-f7a40d2a95cd

WeaveDB をクローンして、設定ファイルを保存する。

```bash
$ git clone https://github.com/weavedb/weavedb.git
$ vi weavedb/node/net/grpc/gateway/weavedb/node-server/weavedb.config.js
```

`wallet`と`contractTxId`が正しい値がセットされているかを確認する。

```js
module.exports = {
  name: "weavedb",
  version: "1",
  contractTxId: "iujhrXKWfegkPzCXX8Cxmf1LCOadZoigSOmM_FgvoyQ",
  arweave: {
    host: "arweave.net",
    port: 443,
    protocol: "https",
  },
  wallet: ...
};
```

コンテナを立ち上げる。

```bash
$ cd weavedb/node
$ sudo docker-compose pull prereqs node-server envoy
$ sudo docker-compose up --build -d node-server envoy
```
