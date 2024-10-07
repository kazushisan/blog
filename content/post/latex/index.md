---
title: 'LaTexを使う'
date: 2018-12-22T12:01:02+09:00
---

## はじめに

理系の大学生ならばよく使うLaTeXですが、私も例に漏れずレポートから簡単なメモの作成まで普段からよくLaTeXを良く使用します。しかし、LaTeXの使い方や機能、コマンドを検索しても引っかかるのは、どこかの大学の研究室の文字化けしたホームページ（文字エンコードが正しく指定されていない）や、大昔に作られたままアップデートされていないものばかりです。LaTeXの場合、Wordなどと比べて検索しながら利用することが多いので、自分が使う際のメモ・チートシートのつもりで、「LaTeXのガイド」としてまとめてみました。

## LaTeXとは

[Wikipediaの記事](https://ja.wikipedia.org/wiki/LaTeX)によると、LaTeXは

> レスリー・ランポートによって開発されたテキストベースの組版処理システムである。電子組版ソフトウェア TEX にマクロパッケージを組み込むことによって構築されており、単体の TEX に比べて、より手軽に組版を行うことができるようになっている。

と記述されています。

.texファイルに本文やコマンドで指定された`\section{見出し}`などを記述し、TeXの処理系を通すことによって最終的に綺麗にフォーマットされたPDFファイルが生成されます。[^1]HTMLに`<p>本文</p>`や`<h1>見出し</h1>`を記述したときのブラウザとCSSファイルの役割をLaTeXの組版処理システムが担うと考えるとイメージしやすいでしょうか。

## なぜWordよりLaTeXを使うのか

普段からLaTeXをよく使うのですが、なぜLaTeXのほうがいいか、自分の考える理由をまとめてみました。

- **セマンティックである。**
  Wordを使っていると多くの場合、見出しはフォントサイズやウェイトを変えることで表現します。すなわち、見出しが見出しであるのは、デザインによってのみ定義されます。しかし、LaTeXの場合は、見出しは`\section{見出し}`などの指定を行うことで指定します。デザインで文章構造を表すのではなく、文章構造はファイルで規定した上で、デザインは別のところで管理するというスタイルです。
- **再現性がある。**
  Wordを使っていて、リストをネストしたり、インデントを調整したりすると後から同じように再現するのはかなり面倒です。LaTeXの場合は、ソースコードで構造が指定されているので、あとから同様のファイルを作るのは簡単です。
- **デザインの自由度が低い。**
  LaTeXでは、デザインは別のスタイルファイルで指定されています。一見これはデメリットのようにも思えますが、LaTeXを使用することでフォントや見出しのデザインの指定ではなく、文章の執筆に集中することができます。
- **テキストベースである。**
  ターミナルからの操作も、他のスクリプトと連携させることも、LaTeXならばソースファイルはテキストベースなので簡単です。

デザインに凝った少ないページ数のファイルを作るなどはWordのほうが向いていると思いますが、主なコンテンツがテキストの場合で、ある程度の長さがある文書ではLaTeXのほうが便利だと思います。

## 種類

TeXファイルを実際にPDFファイルに変換する処理を担うTeXの処理系には、いくつかの種類・派生があります。詳しくは[こちらの記事](https://qiita.com/yyu/items/6404656f822ce14db935)がわかりやすいですが、upTeX、LuaTeXなど複数のバージョンがあります。そのなかで、私はPDFへの書き出しができかつ将来性がありそうなLuaTeXを使っています。今後の記事はLuaTeXの使用を前提に書きますが、多くの操作は他の種類にも共通すると思います。

## さっそく使う

このガイドは、UNIXライクな環境とターミナルの利用を想定しています。そのため、ディレクトリ間の移動など基本的なターミナルの操作には慣れている前提で進めますが、基本的に複雑な操作は行わないので、別途CLI環境について調べれば、問題なく理解できると思います。

前置きが長くなってしまいましたが、以降実際にLaTeXを使っていきます！

[^1]: TeXの処理システムによってはPDFを直接生成するのではなく、DVIファイルが一度生成されてからPDFに変換する必要のあるものもあります。

## はじめに

LaTeXを使い始めるのに必要なのは、

- TeXのソースファイル
- それを処理する任意のTeX処理系

多くのチュートリアルでは、LaTeXの統合環境をインストールすることをすすめますが、統合環境を入れることは必須ではなく、自分の好きなエディタと、TeX処理系だけで十分に対応できます。むしろ、このようにミニマルなセットアップのほうが、ディスク容量を不必要に消費することもなく、また、普段使い慣れたエディタで作業しやすいと思います。

## Linux

### 概要

Linuxでは、各ディストリビューションのパッケージマネージャ(ex. `yum`, `apt`)が提供しているLaTeXのパッケージを利用することもできますが、LaTeXの各種設定を変更できるパッケージを管理・利用する都合上、TeX Liveを使うことをおすすめします。TeX Liveを使うことによって、`tlmgr`でTeXのパッケージを管理することができます。

以降では、Arch Linuxを例に説明しますが、ほかのディストリビューションでも、概ね同じ方法でインストールが可能です。

### 下準備 – TeX関連のパッケージをpacmanの管理下からはず。

今回は、Linuxのパッケージ管理ツールではなく、TeX Liveを用いてLaTeXのインストールを行ます。その場合、パッケージマネージャとTeX Liveが干渉してしまうため、TeX関連のパッケージについてはOSのパッケージマネージャに管理されないようにする必要があります。[TeX Wiki](https://texwiki.texjp.org/?texlive-dummy#archlinux)によると、

> Linux で TeX Live 公式パッケージをインストールした場合は TeX Live に依存するパッケージによって各種 Linux ディストリビューションが提供している TeX Live がインストールされないように TeX Live の dummy パッケージをインストールします。

dummyパッケージというもの導入することによってTeX関連のパッケージがpacmanに管理されないようにするという方法が紹介されています。ですが、dummyパッケージについてはあまりきれいな解決方法ではないため、議論が起き現在はAURから削除されているようです。そこで、`pacman --assume-installed`を使ってを解決してみました。

[texlive-dummyのソースコード](https://github.com/zhou13/aur/blob/master/texlive-dummy/PKGBUILD)を見てみると、

```:PKGBUILD
conflicts=('texlive-bin' $(pacman -Sgq texlive-most texlive-lang))
provides=('texlive-bin' $(pacman -Sgq texlive-most texlive-lang))
```

この部分で調整しているようなので、texlive関連のパッケージが常にpacmanに無視されるように以下を`~/.bashrc`に追加しました。

```
alias pacman="pacman --assume-installed texlive-bin $(\pacman -Sgq texlive-most texlive-lang)"
```

読み込むために一度ターミナルで`$ source ~/.bashrc`を実行します。
この操作によってpacmanとコンフリクトしないようになりました。

### インストーラの実行

インストーラをダウンロードして実行します。

```bash
curl -OL http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz
tar xvf install-tl-unx.tar.gz
cd install-tl-20*
sudo ./install-tl -no-gui --repository http://ftp.jaist.ac.jp/pub/CTAN/systems/texlive/tlnet/
```

インストーラにしたがって、オプションを選択します。普段使っているMacのBasicTeXに準じている`small scheme`を選びました。他のオプションはそのままでインストールします。

インストーラの動作が終了したらしたら、パスを通して、日本語環境とghostscriptをインストールします。

```bash
sudo /usr/local/texlive/????/bin/*/tlmgr path add
sudo tlmgr update --self -all
sudo tlmgr install collection-langjapanese
sudo pacman -S ghostscript
```

以上でインストールは完了です！

## macOS

### 概要

`MacTeX`の使う例が多いですが、ここでは、Linuxの場合同様にTeX Liveを使ってインストールを進めます。

### インストーラの実行

Linuxと同様にインストールをダウンロードして、実行します。

```bash
curl -OL http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz
tar xvf install-tl-unx.tar.gz
cd install-tl-20*
sudo ./install-tl -no-gui --repository http://ftp.jaist.ac.jp/pub/CTAN/systems/texlive/tlnet/
```

インストーラにしたがって、オプションを選択します。MacのBasicTeXに準じている`small scheme`を選びました。他のオプションはそのままでインストールします。

![インストーラ画面](tex-installer.png)

インストーラの動作が終了したらしたら、パスを通して、日本語環境とインストールして完了です。

```bash
sudo /usr/local/texlive/????/bin/*/tlmgr path add
sudo tlmgr update --self -all
sudo tlmgr install collection-langjapanese
```

## TeX Live Manager `tlmgr`を使う

インストールが完了すると、TeXで使うパッケージの管理ツール`tlmgr`使えるようになります。これを使うことで、パッケージの追加やアップデートを行うことができます。

TeXのソースファイルでは、ヘッダーに

```latex
\usepackage{enumitem}
```

のように、パッケージを読み込む記述を追加する場合があります。これを行ったのちに、コマンドの実行時に次のようなエラーが発生した場合、

```
! LaTeX Error: File `enumitem.sty' not found.

Type X to quit or <RETURN> to proceed,
or enter new name. (Default extension: sty)
```

必要なパッケージがインストールされていないので、

```bash
sudo tlmgr install enumitem
```

のようにして、パッケージを追加することによって、エラーを回避できます。

---

### 参考

- [Linux - TeX Wiki](https://texwiki.texjp.org/?Linux#texliveinstall)
- [TeX Live/Mac - TeX Wiki](https://texwiki.texjp.org/?TeX%20Live%2FMac#texlive-install-official)
