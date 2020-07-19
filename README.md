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

## オプション

### tenhou-log

#### --xml, -x
無変換の天鳳の牌譜(XML形式)を取得する

### tenhou-log-server

#### --port, -p
変換サーバを起動するポート番号 (デフォルト値は 8001)

#### --baseurl, -b
変換サーバに割り当てるURL(デフォルト値は /tenhou-log/)

#### --docroot, -d
変換サーバに割り当てるコンテンツの場所 (デフォルトではコンテンツは割り当てない)

## ライセンス
[MIT](https://github.com/kobalab/tenhou-log/blob/master/LICENSE)

## 作者
[Satoshi Kobayashi](https://github.com/kobalab)
