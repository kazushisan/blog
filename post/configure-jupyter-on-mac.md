---
title: "MacにJupter Notebookの環境を構築する"
date: 2019-10-24T11:25:13+09:00
---

## Dockerを使う場合

### Prerequisites

- Docker

### セットアップ

```bash
alias docker-jupyter='docker run -p 8888:8888 -v "$PWD":/home/jovyan/work/ jupyter/datascience-notebook'
```

コマンドをそのまま実行してもいいですが、aliasをシェルの設定ファイル `~/.bash_profile` や `~/.zprofile` に追加することによって簡単にdockerを使ったJupyter Notebookを立ち上げることができます。

Docker Imageがない場合は勝手にイメージがダウンロードされます。

```
-v "$PWD":/home/jovyan/
```

このオプションの指定によって、コマンドを実行したカレントディレクトリとJupyter Notebookの作業ディレクトリが紐づけらます。


### 起動

適宜`source ~/.bash_profile`や`source ~/.zprofile`などでaliasの設定を反映させた上で、

```bash
docker-jupyter
```

シェル上にjupyterに接続できるローkルホスト上のサーバのアドレスが表示されます。ここに接続することでJupyterを利用できます。

ただしこのDockerを使った環境だと日本語を含むPDFを正しくエクスポートできません。

## ローカルにインストールする場合

### Prerequisites

- pyenv
- R (Rを使えるようにする場合)

### セットアップ

```bash
pyenv install 3.8.2 # 適当なPythonのバージョンをインストールする（なければ）
pyenv global 3.8.2 # Pythonのバージョンを切り替える
pip install notebook # Jupyter　Notebook をpipでインストールする
```

### 起動

```bash
jupyter notebook
```

### JupyterでRを使えるようにする

ローカル環境でRを使えるには、[こちらのカーネル](https://github.com/IRkernel/IRkernel)を追加します。

Rのインタプリタを起動した上で次のコマンドを実行します。

```R
install.packages('IRkernel')
IRkernel::installspec()
```

Jupyterを起動し直すとRが使えるようになります。


