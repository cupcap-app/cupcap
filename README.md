# cupcap
<img width="810" alt="cupcap" src="https://user-images.githubusercontent.com/57611745/200159638-6180f1b1-938e-4168-8661-91b4ccef2e76.png">

cupcapは偶然の出会いを拡張するサービスです。  
複数のイベントを位置情報ベースで探すことが出来ます。日時を変更することで未来のイベントに予約する事も可能です。  
またユーザのプロフィールがENSと紐づいた名刺の形になっています。  
結果、使い道のなかったオンチェーンの情報を活用できるだけでなく、ユーザーが相互に信用を確かめながら参加イベントを選択することができます。  
また、cupcapではウォレットを持っていなくてもログイン可能で、またアプリ上でENSを簡単に購入することも出来るため、WEB3.0に詳しくない人でも快適に利用することができます。  
さらに、特定のPOAPとNFTの保有を条件にしたクローズドのイベントを開催することもできます。  
将来的には、職歴やオンチェーン履歴等も見れるようになりビジネスの現場など様々な場面で、アイデンティティを保存交換できるプラットフォームになっていきます。  

# Blockchain & TechStacks
* Polygon
   * Solidityでコントラクトを作成
      * イベント管理コントラクト
      * イベントNFTコントラクト
      * POAPコントラクト
      * 名刺NFTコントラクト
      * 名刺デザインコントラクト   
* ENS
   * プロフィールの保存先としてENSを選択できる
* WeaveDB
   * arweave上の分散型NoSQLデータベース
   * ENSにプロフィールを保存しない場合はWeaveDBに保存する
* arweave
   * メタデータの保存はarweaveを利用
* The Graph
   * 各種コントラクトから情報取得するためのクエリを構築
* Web3Auth
   * Walletを持っていない人でも利用できるようにするために導入
   * SocialSignInでノンカストディアルな秘密鍵管理が可能
* React
   * フロントエンドアプリはReactで構築

![architecture](https://user-images.githubusercontent.com/57611745/200159878-2942ba29-502b-425c-b107-49672fc9cc94.png)


# Repository Map
開発ドキュメントはルート直下の各種マークダウンを参照ください

setup.md: インフラ周りのセットアップなど  
deploy.md: コントラクトや Graph のデプロイなど  
tips.md: FE の詰まった所の対策など

### Contracts
* `/contracts`
### FrontEnd
* `/frontend`
### BackEnd
* arweave uploader
   * `/amplify`
## WeaveDB
* Schema
  * `/schemas`
* Setup scripts
  * `/scripts`

# Links
### Contract
Polygon testnet (mumbai)へデプロイ

|  Name  |  Contract Address  |  Explorer  |
| ---- | ---- | ---- |
|  cupcap Contract (Event Manager)  |  `0x5037c3D69017A3Ba78288250bEE3a26c50d0f3eB`  |  https://mumbai.polygonscan.com/address/0x5037c3D69017A3Ba78288250bEE3a26c50d0f3eB  |
|  Event NFT Contract  |  `0x057E10E1cDe0668C81887bD06C42e3168429Fe19`  |  https://mumbai.polygonscan.com/address/0x057E10E1cDe0668C81887bD06C42e3168429Fe19  |
|  POAP Contract  |  `0x10FFB3efA577e5CFB83FA11592984919106CC770`  |　　https://mumbai.polygonscan.com/address/0x10FFB3efA577e5CFB83FA11592984919106CC770  |
|  Business Card Contract | `0xaA1c272925aF5D807595A91470eD9535055355E1` |　　https://mumbai.polygonscan.com/address/0xaA1c272925aF5D807595A91470eD9535055355E1  |
|  Business Card Design Contract | `0x49DeB896a39607904B3Db4E8Ae3c6d78DA8FbF30` |　　https://mumbai.polygonscan.com/address/0x49DeB896a39607904B3Db4E8Ae3c6d78DA8FbF30  |

### Demo App
* https://main.d3bsh0x62cfwgj.amplifyapp.com/

