---
title: 类型挑战
date: 2023.2.25
---

# TypeScript 类型挑战

### First of Array

[GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00014-easy-first/README.md) | [playground](https://tsch.js.org/14/play)

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]
type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

<T>

```ts
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never
```

</T>
