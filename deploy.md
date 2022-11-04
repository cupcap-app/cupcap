# デプロイ手順

1. コントラクトをデプロイ
2. Graph のセットアップ & デプロイ
3. Arweave のキー生成
4. Arweave のキーを S3 に保存
5. WeaveDB のコントラクトデプロイ
6. WeaveDB の gRPC サーバのコントラクト TxID とキーのアップデート
7. Frontend の.env 確認

## 1. コントラクトのデプロイ

```bash
$ cd contracts
```

`hardhat.config.ts`にデプロイ先のチェーンの設定があるか確認する。  
`.env`の`JSONRPC_URL`と`PRIVATE_KEYS`が保存されているか確認する。

```bash
$ npx hardhat run scripts/deploy.ts --network <NETWORK_NAME>
```

## 2. Graph のセットアップ

`contracts/graph`に移動。

`subgraph.yaml`の各コントラクトアドレスとチェーン名が適切かチェック。`networks.json`の各コントラクトアドレスが適切かチェック

ブラウザから Graph の Hosted Service に移動し、プロジェクトを構築して`auth`と deploy を実行する。
