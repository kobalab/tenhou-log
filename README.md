# tenhou-log

天鳳形式の牌譜を[電脳麻将](https://github.com/kobalab/Majiang)形式に変換する

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
ライブラリとして使用
```javascript
const convlog = require('@kobalab/tenhou-log');

let paipu = convlog(xml, '2016031822gm-0009-10011-896da481')
```
## 使用方法

### tenhou-log [--title=*title*] [--xml] *logid*[:*title*] ...
<dl>
<dt>--title, -t</dt>
    <dd>牌譜タイトルを指定する<dd>

<dt>--xml, -x</dt>
    <dd>無変換の天鳳の牌譜(XML形式)を取得する</dd>
</dl>

### tenhou-log-server
<dl>
<dt>--port, -p</dt>
    <dd>変換サーバを起動するポート番号 (デフォルト値は 8001)</dd>

<dt>--baseurl, -b</dt>
    <dd>変換サーバに割り当てるURL(デフォルト値は /tenhou-log/)</dd>

<dt>--docroot, -d</dt>
    <dd>変換サーバに割り当てるコンテンツの場所 (デフォルトではコンテンツは割り当てない)</dd>
</dl>

#### URL
<dl>
<dt>/tenhou-log/<em>logid</em>.json[:<em>title</em>]</dt>
    <dd><em>牌譜ID</em>で指定した牌譜を電脳麻将形式で取得する</dd>
<dt>/tenhou-log/<em>logid</em>.xml</dt>
    <dd><em>牌譜ID</em>で指定した牌譜を天鳳の形式で取得する</dd>
</dl>

### convlog(xml, log_id)
  - **xml** - string
  - **log_id** - string
  - _返り値_ - object

**xml** で指定した天鳳のXML形式の牌譜を電脳麻将形式に変換し、返す。
**log_id** を指定した場合は牌譜タイトルの最後に **log_id** を追加する。

## ライセンス
[MIT](https://github.com/kobalab/tenhou-log/blob/master/LICENSE)

## 作者
[Satoshi Kobayashi](https://github.com/kobalab)
