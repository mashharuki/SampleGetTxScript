# SampleGetTxScript
ブロックチェーン上のトランザクションのデータを取得するためのスクリプトです。

### 注意事項

指定する範囲によっては莫大な数のリクエスト数を投げることになるのでAPIの利用制限に注意すること

### 動かし方

1. [infura](https://app.infura.io)でアカウントの登録とAPI キーの設定をする。

2. `.env`ファイルを作成しAPIキーの値を埋める。

```txt
API_KEY=<ここに貼り付ける>
```

3. パッケージのインストール

```bash
yarn
```

4. スクリプトを実行する。

```bash
yarn start
```

しばらく時間がかかるがコンソールログにトランザクションハッシュ値が出力されていれば正常に動いている。

```bash
.
.
.
txHash: 0xa5629a4a05c91a67cc0968f9bfebf37363a526aad206a335ee3f11d6cb0b9c03
txHash: 0xa3dfc19dfae9970f97e818553a76abe214f027eafddb8afda8df6d151adfa46d
txHash: 0x5c60f3d7b2d036396fc289ff36dbd7e59253c6097ceab5db8f380df8d1a626c2
txHash: 0xbdf89f64f60b70a66e54b6f34bd42bbf1485ac7e5f304c5dc32ec9a6a728abdd
txHash: 0xf8fdccd33bad80d80ff8d6fd2a5ced8c5d9a1bc59f9b3a0c62a436fdfad316b4
.
.
.
 =================================== [Convert : Start] =================================== 
 =================================== [Convert : End] =================================== 
 =================================== [End] =================================== 
```

うまくいけば`data/output.csv`に取得した内容が格納されている。