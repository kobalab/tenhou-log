# tenhou-log

天鳳形式の牌譜を電脳麻将形式に変換する

## インストール
```sh
$ npm i -g @kobalab/tenhou-log
```
## 使用例
コマンドラインから
```sh
$ tenhou-log 2016031822gm-0009-10011-896da481
```
変換サーバとして起動
```sh
$ tenhou-log-server &
$ curl -s http://127.0.0.1:8001/tenhou-log/2016031822gm-0009-10011-896da481.json
```

## 環境変数

### PORT
変換サーバを起動するポート番号 (デフォルト値は 8001)

### DOCROOT
変換サーバに割り当てるコンテンツの場所 (デフォルトではコンテンツは割り当てない)

## ライセンス
[MIT](https://github.com/kobalab/tenhou-log/blob/master/LICENSE)

## 作者
[Satoshi Kobayashi](https://github.com/kobalab)
