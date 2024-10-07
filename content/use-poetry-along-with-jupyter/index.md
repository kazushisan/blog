---
title: "JupyterからPoetryでインストールしたライブラリを呼び出してみた"
date: 2020-04-12T22:28:31+09:00
---

Jupyter Notebook内で実行したコードに，Poetryでインストールしたモジュールをインポートする記述があると，`ModuleNotFoundError` というエラーが発生します．

原因は，システムにインストールされているJupyterが使っているPythonカーネルからはPoetryプロジェクトのvenvが参照できないことです．

これを解決するために，JupyterにPoetryが生成したvenvのカーネルを追加します．はじめに `ipykernel` モジュールをプロジェクトに追加します．

```bash
poetry add --dev ipykernel
```

`poetry shell` などで仮想環境に入ったのちに，次のコマンドを実行することでvenvのカーネルをJupyterに追加することができます．

```bash
ipython kernel install --user --name=your-project-name
```

Jupyter上でさきほど追加したカーネルを指定して実行することで，問題なくインポートを含むコードを実行することができます．

## おまけ

Jupyterで使えるカーネルの一覧の確認

```bash
jupyter kernelspec list
```

追加したカーネルの削除

```bash
jupyter kernelspec remove your-kernel-name
```

