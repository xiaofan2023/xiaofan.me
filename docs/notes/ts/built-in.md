---
date: 2023.2.21
title: TS类型挑战の内置类型
---

# 内置类型

## Pick

[GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.md) | [playground](https://tsch.js.org/4/play)

示例

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>
// should be { title: string, completed: string }
```

<T>

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

</T>

## Exclude

[GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00043-easy-exclude/README.md) | [playground](https://tsch.js.org/43/play)

示例

```ts
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

<T>

```ts
type MyExclude<T, U> = T extends U ? never : T
```

</T>

## Parameters

[GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/03312-easy-parameters/README.md) | [playground](https://tsch.js.org/3312/play)

示例

```ts
const foo = (arg1: string, arg2: number): void => {}
type FunctionParamsType = MyParameters<typeof foo>
// [arg1: string, arg2: number]
```

<T>

```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never
```

</T>

## Get Return type

[GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00002-medium-return-type/README.md) | [playground](https://tsch.js.org/2/play)

示例

```ts
const fn = (v: boolean) => {
  if (v) return 1
  else return 2
}
type a = MyReturnType<typeof fn> // should be "1 | 2"
```

<T>

```ts
type MyReturnType<T extends (...args: any) => unknown> = T extends (
  ...args: any
) => infer R
  ? R
  : any
```

</T>

## Omit

[GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00003-medium-omit/README.md) | [playground](https://tsch.js.org/3/play)

示例

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>
// { completed: boolean }
```

<T>

```ts
// resolve$1
type MyOmit<T, K extends string | number | symbol> = {
  [P in Exclude<keyof T, K>]: T[P]
}

// resolve$2
type MyOmit$2<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```

</T>

## Awaited

[GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00189-easy-awaited/README.md) | [playground](https://tsch.js.org/189/play)

示例

```ts
type ExampleType = Promise<string>
type Result = MyAwaited<ExampleType> // string
```

<T>

```ts
type MyAwaited<T> = T extends PromiseLike<infer F> ? MyAwaited<F> : T

type Awaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any }
    ? F extends (value: infer V, ...args: infer _) => any
      ? Awaited<V>
      : never
    : T
```

</T>

> [官方实现](https://github.com/microsoft/TypeScript/blob/7d1cc88a8cbdf8aa847a7f2a7d4bfeb89c8dde15/lib/lib.es5.d.ts#L1553)

## Promise.all

[GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/00020-medium-promise-all/README.md) | [playground](https://tsch.js.org/20/play)

示例

```ts
const promise1 = Promise.resolve(3)
const promise2 = 42
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo')
})

const p = PromiseAll([promise1, promise2, promise3] as const)
// Promise<[number, 42, string]>
```

<T>

```ts

```

</T>
