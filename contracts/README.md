# cupcap-contracts

CupCap のスマートコントラクト実装と The Graph 用のスクリプト

## 環境構築

### ローカル環境 (Hardhat localnode)

### コントラクトのデプロイ

```
$ npm i
$ npx hardhat node
```

node は立ち上げたままにしておく、以下のコマンドを異なるシェルで実行する

```
$ npx hardhat run scripts/deploy --network localhost
```

出力の末尾にあるコントラクトのアドレスを`.env`にセットする。

### The Graph のセットアップ

```
$ cd graph
$ docker-compose up
```

docker コンテナは立ち上げたままにしておく、以下のコマンドを異なるシェルで実行する

```
$ cd graph
$ npm i
$ npm run init-local
```

完了後、`http://127.0.0.1:8000/subgraphs/name/cupca`などへアクセスすることで、ブラウザ上からアクセスできるクライアントが起動する。

## コントラクトへのアクセス

ローカル環境にデプロイされたコントラクトにトランザクションを発行することを仮定する。その他に関しては、`hardhat.config.ts`にネットワーク設定を追加した後に`--network`引数を変えて実行する。トランザクションの投げ方については呼び出すスクリプトを参照してください。

イベントやデザインの ID は 1 から始まることに注意

### イベントを作成する

主催者アドレス、イベントの詳細が書かれたリソースの URI、イベント開始時間、イベント終了時間、イベント参加可能最大人数などを設定しイベントを作成する。

```bash
$ npx hardhat run scripts/create-event.ts --network localhost
```

### イベントに参加登録をする

イベントに参加登録をする。`.env`に書かれた`EVENT_ID`の値に対応するイベントに参加する。イベントがすでに開始している場合は同時に参加も行う。

```bash
$ npx hardhat run scripts/participate-event.ts --network localhost
```

### イベントに参加する

事前に参加登録していたイベントに、開催中に実際に参加する。同様に`.env`に設定された`EVENT_ID`からイベントを指定する。

```bash
$ npx hardhat run scripts/attend-event.ts --network localhost
```

### 名刺デザインを作成する

新しい名刺デザインを追加する。名刺デザインが書かれたリソースの URI を指定する。この操作は admin アカウント(コントラクトをデプロイしたアカウント)からしか実行できない。

```bash
$ npx hardhat run scripts/create-business-card-design.ts
```

### 名刺デザイントークンを発行する

名刺デザインの利用券を示す、デザイントークンを新規に発行する。デザイン ID は`.env`の`DESIGN_ID`から指定する。

```bash
$ npx hardhat run scripts/mint-business-card-design-token.ts
```

### 名刺を送る

名刺トークンを新たに作って、送信する。1 アカウントにつき同じ名刺は 1 つしか持てないのに注意

```bash
$ npx hardhat run scripts/send-business-card.ts
```

## Graph のエンティティ

コントラクトのイベントを元に、The Graph でエンティティが作成・更新される。以下各エンティティの説明

```graphql
// イベントエンティティ
type Event @entity {
  id: String!

  // 作成者
  createdBy: Bytes!

  // イベント開始時刻
  startedAt: BigInt!

  // イベント終了時刻
  endedAt: BigInt

  // 最大可能参加者数
  limitOfParticipants: BigInt!

  // 現在の参加登録して、参加していない数
  numberOfParticipants: BigInt!

  // 現在の参加済みアカウントの数
  numberOfAttendance: BigInt!
}

// 参加者
type Participant @entity {
  id: String!

  // イベントID
  eventID: BigInt!

  // 参加者アドレス
  account: Bytes!

  // 参加者のステータス participated/attended
  status: String!

  // POAPがある場合はPOAPのID
  poapID: BigInt
}

// POAP
type POAP @entity {
  id: String!

  // イベントID
  eventID: BigInt!

  // 同一イベントで何番目に作成されたか
  index: BigInt!

  // 保有者アドレス
  holder: Bytes!
}

// 名刺デザイン
type BusinessCardDesign @entity(immutable: true) {
  id: String!

  // デザインのURI
  uri: String!
}

// デザイントークンの保有情報
type BusinessCardDesignBalance @entity {
  id: String!

  // デザインのID
  token: BigInt!

  // 保有者アドレス
  holder: Bytes!

  // 保有量
  amount: BigInt!
}

// 名刺
type BusinessCard @entity(immutable: true) {
  id: String!

  // 名刺作成者
  from: Bytes!

  // 名刺受取者
  to: Bytes!

  // 名刺のトークンID
  tokenID: BigInt!
}

```
