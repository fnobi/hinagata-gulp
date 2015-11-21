# hinagata-gulp

## install dependencies

```
npm install
bower install
```

## tasks

### ビルド

- `npm run build`
  - `gulp`でも可

- html・css・jsのビルドが走ります

### ファイルの監視・自動ビルド

- `npm run watch`
  - `gulp watch`でも可

- html・css・jsのそれぞれについてソースファイルを監視・変更があればそれぞれのビルドを実行します

### 開発用サーバーの起動

- `npm start`
  - `gulp server`でも可

- 開発用のサーバーを起動し、ブラウザを開きます
- livereload等の機能は付けていません

### 個別ビルド

#### html
- `gulp html`を実行してください

#### css
- `gulp css`を実行してください

#### js
- `gulp js`を実行してください
