---
date: 2023.2.26
title: 八皇后问题
---

# 八皇后问题

::: info 问题描述

如何能够在 8×8 的国际象棋棋盘上放置八个皇后，使得任何一个皇后都无法直接吃掉其他的皇后？  
即要求任两个皇后都不能处于同一条横行、纵行或对角线上。

:::

## 摆法展示

<script lang="ts" setup>import Demo from "~/examples/n-queens.vue"</script>

<ClientOnly><Demo /></ClientOnly>

## 代码示例

<T title="💡基于回溯思路的解法">

<<< @/../src/examples/n-queens-solution.ts

</T>

## 参考链接

- [力扣](https://leetcode.cn/problems/n-queens/)
- [wiki](https://en.wikipedia.org/wiki/Eight_queens_puzzle)
