---
name: 'docs'
root: './docs'
output: '**/*'
ignore: []
questions:
  filename: 'file name?'
  title: 'title name?'
---

# `{{ inputs.filename }}.md`

````markdown
---
title: "{{inputs.title}}"
date: "{{date}}"
---

## {{inputs.title}}

### 概要
<!-- 簡潔に -->

### 背景
<!-- 原因など -->

![]()

### 対応内容

```ts
```

### 結果

### 次やること

### 参考
<!-- - 関連 Issue / PR / Docs -->

````
