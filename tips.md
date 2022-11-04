# tips

## WeaveDB のフロントエンドで扱う

`create-react-app`を使った React アプリで WeaveDB のフロントエンドを動かそうとすると以下のようなエラーが表示されて動かない。

```
Can't resolve 'assert'...
```

これを修正するには以下のようにする。

プロジェクト直下に`config-overrides.js`を作成して以下を記述する。

```
/* config-overrides.js */
const webpack = require('webpack');
module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.resolve.fallback = {
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
        'process/browser': require.resolve('process/browser')
    };

    config.plugins.push(
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        }),
    );

    return config;
}
```

`react-app-rewired`をインストールする

```bash
$ npm i --save react-app-rewired
```

`package.json`の nom スクリプトを以下のように更新する。

```json
{
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject"
  }
}
```

以下をインストールする

```bash
$ npm i --save url assert crypto-browserify stream-http https-browserify buffer stream-browserify process
```

`@metamask/eth-sig-util`, `ethereumjs-abi`, `ethereumjs-util`, `weavedb-sdk`などはインストールしないこと

それでも治らない場合は、ソースマップの生成を止める方法がある

```json
{
  "start": "GENERATE_SOURCEMAP=false react-app-rewired start",
  "build": "GENERATE_SOURCEMAP=false react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-app-rewired eject"
}
```
