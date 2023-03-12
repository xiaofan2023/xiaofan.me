---
date: 2023.1.29
title: TypeScript handbook 阅读笔记
---

# TypeScript handbook 阅读笔记
<br />
<T title='目录' defaultOpen=true>

- [常用类型](#常用类型)
  - [string, number, boolean](#string-number-boolean)
  - [null, undefined](#null-undefined)
  - [类型断言](#类型断言)
  - [字面量类型](#字面量类型)
  - [数组和元组](#数组和元组)
- [类型缩窄](#类型缩窄)
  - [typeof](#typeof)
  - [真值判断](#真值判断)
  - [相等判断](#相等判断)
  - [类型谓词](#类型谓词)
  - [never 类型](#never-类型)
- [函数类型](#函数类型)
  - [类型签名](#类型签名)
  - [可选参数](#可选参数)
  - [泛型](#泛型)
  - [重载](#重载)
- [对象类型](#对象类型)
- [类类型](#类类型)
  - [构造函数](#构造函数)
  - [类成员](#类成员)
  - [类继承](#类继承)
  - [this](#this)
- [参考链接](#参考链接)

</T>

## 常用类型

### string, number, boolean

- 声明变量时如果能给定初始值，通常省略显性的类型注解（交由编译器推断）

- 🤔 不要与 **String**, **Number**, **Boolean** 类型混淆

```ts
// String类型相当于包装了字符串的对象类型
let A = new String('A')
let a = 'a'
//🤔 以下赋值是否报错
A = a
a = A
```

### null, undefined

- 在 **tsconfig.json** 中开启编译选项 [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks)，能严格区分 `null` 和 `undefined` 类型，有助于提前检测到运行时的可能错误

  > `Uncaught TypeError: Cannot read properties of undefined`

- 在开发者确保非空的情况下，可以使用非空断言符 `!`，减少额外的类型判断

```ts
function liveDangerously(x?: number | null) {
  console.log(x!.toFixed())
}
```

### 类型断言

- 使用此特性可以自由指定变量的类型，但需要开发者自行确保类型安全

```ts
/**
 * 编译器默认document.getElementById 返回类型是 HTMLElement | null
 * 但开发者自己知道id为input的元素一定是一个<input />元素，可以使用类型断言
 * 从而“帮助”编译器推断myInput的类型
 */
const myInput = document.getElementById('input') as HTMLInputElement
```

- 避免无意义的断言（编译器限定断言前后的两个类型得有交集）

```ts
// 报错 类型string和类型number没有交集
const x = 'hello' as number
// 不过可以利用any或者unknown搭桥
const y = 'world' as any as number
```

### 字面量类型

- 与 **string** 类型的区别

```ts
function printText(s: string, alignment: 'left' | 'right' | 'center') {
  // ...
}
printText('Hello, world', 'left')
printText("G'day, mate", 'centre') // error

// 返回值类型被推断成字面量类型 -1 | 0 | 1
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1
}
```

- 使用 `as const`

```ts
/*
 * 如果我们意图使obj对象中counter字段是一个字面量类型
 * 但使用const声明obj并不能满足要求
 */
const obj = { counter: 0 }
obj.counter = 1
// 对counter字段使用as const断言
const obj$2 = { counter: 0 as const }
// 也可以对obj整体使用as const断言
const obj$3 = { counter: 0 } as const
// oops: 现在obj.counter不接受除了0以外的其他赋值
obj$2.counter = 1
```

```ts
// 举个例子：已声明只接受GET或者POST请求方法
function handleRequest(url: string, method: 'GET' | 'POST') {
  // ...
}

//🤔 如何避免报错
const req = { url: 'https://example.com', method: 'GET' }
handleRequest(req.url, req.method) // [!codeㅤ error]
```

### 数组和元组

- 数组：可注解其中元素的类型  
  比如, 注解一个字符串类型的数组 `Array<string>` 或者 `string[]`

- 元组：限定了长度的数组，相比数组，可以更方便地为其中每个元素指定类型

```ts
type SortOptions = [number, number, number]
// 假定sort方法入参仅接受三个元素的数组
function sort(args: SortOptions) {
  // ...
}

let arg1 = [1, 2, 3]
// oops arg1类型是number[]，无法代入到更严格的Tuple类型
sort(arg1) // [!code error]
// 我们可以使用类型断言
let arg$2 = [1, 2, 3] as SortOptions
// 或者展开一个字面量数组
let arg$3 = [1, 2, 3] as const
sort([...arg$3])
```

## 类型缩窄

:::info 个人观点

TypeScript 是追求类型安全的语言  
使用时需要开发者”协助”编译器推断类型来保证类型安全  
类型缩窄语句就是常见的“协助”手段

:::

### typeof

- 🤔 `typeof null === 'object'`

### 真值判断
  
- **JavaScript** 中的假值（对假值进行 `if` 判断 或者 `!!` 运算，均返回 `false`）

     - `false`, `0`, `NaN`, `""`, `null`, `undefined`, `0n`
     - > [参考MDN](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)

``` ts
type NonFalsy<T> = T extends false | 0 | NaN | '' | null | undefined | 0n
  ? never
  : T
```

```ts
// 一段有隐患的代码示例 🤔
function printAll(strs: string | string[] | null) {
  if (strs) {
    if (typeof strs === 'object') {
      for (const s of strs) {
        console.log(s)
      }
    } else if (typeof strs === 'string' /* 冗余的判断 */) {
      console.log(strs)
    }
  }
  // 没有讨论strs是空字符串的情形，可能会埋下隐患
}
```

### 相等判断

  - `===` 和 `!==`
  - `==` 和 `!=`

### 类型谓词

- 使用关键字 `is`

使用动机：参考示例

```ts

/**
 * 我们知道当 isString 返回 true 时，foo 就是 string 类型
 * 但编译器并不知道这个信息，使用类型谓词可以帮助编译器获取这个信息
 */
function isString(foo: unknown): foo is string {
  return typeof foo === 'string'
}

function example(foo: unknown){
  if(isString(foo)){
    // 由于使用了类型谓词，编译器会推断 foo 是 string 类型
    console.log('it is a string ' + foo)
    console.log(string.toLowerCase())
  }
  // foo 现在又被视为 unknown 类型了
}
```

### never 类型

1. 从字面意义看，never 表示一个不可能得到的类型（与空集概念类似）  
   比如 `type N = string & number`，  
   由于 `string` 和 `number` 没有交集，没有值可以赋给该类型，`N` 会被推断为 **never** 类型

2. 使用动机 ①：在分支判断中，保证列举了所有可能选项

```ts
interface Circle {
  kind: 'circle'
  radius: number
}
interface Square {
  kind: 'square'
  sideLength: number
}
type Shape = Circle | Square

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.sideLength ** 2
    default:
      const _exhaustiveCheck: never = shape
      return _exhaustiveCheck
  }
}

// 如果后续有人为Shape添加了一个新的可能选项
// 编译器将在上面的switch语句中提示错误
interface Triangle {
  kind: 'triangle'
  sideLength: number
}
type Shape = Circle | Square | Triangle
```

3. 使用动机 ②：表示后续不会执行的代码

```ts
function throwError() {
  throw new Error()
}
function firstChar(msg: string | undefined) {
  if (msg === undefined) {
    throwError()
  }
  let ch = msg.charAt(1) // [!codeㅤerror] msg可能是undefined类型
}

// 我们可以在firstChar函数中使用类型缩窄来消错
function firstChar(msg: string | undefined) {
  if (msg === undefined) {
    throwError()
  } else {
    let ch = msg.charAt(1)
  }
}
// 更方便的做法是将throwError返回值类型注解为never
```

## 函数类型

### 类型签名

- 类型注解：为函数的输入参数和返回值两部分提供类型注解

- 可调用签名：如果想表示某个对象类型既支持函数调用，也有特定字段时

```ts
type DescribableFunction = {
  description: string // 有属性字段description
  (someArg: number): boolean // 添加1个调用签名，也可以添加多个
}
function doSomething(fn: DescribableFunction) {
  // fn有description字段
  // 也支持函数调用(入参类型number 返回值类型boolean)
  console.log(fn.description + ' returned ' + fn(6))
}
```

- 构造签名：需要为构造函数添加类型注解时，在可调用签名的基础上添加关键字 `new`

```ts
interface CallOrConstruct {
  new (s: string): Date
  (n?: number): number
}

// 如果我们想为类似Date的一类对象编写类型文件，这个签名很有用
Date(1667447141572)
new Date()
```

### 可选参数

- 在形参上使用可选参数符 `?`，意味着该位置上的实参可以省略

- 使用 `?` 在调用时能带来便利，但可能需要在函数体中添加类型缩窄语句来处理空值，这时预先给定一个默认值或许会更有用

```ts
function f1(x?: number) {
  console.log(typeof x)
}
function f2(x = 10) {
  console.log(typeof x)
}

f1() // print "undefined"
f2() // print "number"
```

### 泛型

- 使用动机：当需要在输入参数和返回值之间建立类型关联时

```ts
// 返回值类型被推断成any
function firstElement(arr: any[]) {
  return arr[0]
}
// 返回值类型被推断成T
function firstElement$2<T>(arr: T[]) {
  return arr[0]
}
```

- 为泛型参数添加约束条件：使用关键字 `extends`

```ts
function longest<T extends { length: number }>(a: T, b: T) {
  if (a.length >= b.length) {
    return a
  } else {
    return b
  }
}

// 返回值类型是 'number[]'
longest([1, 2], [1, 2, 3])
// 返回值类型是 'alice' | 'bob'
longest('alice', 'bob')
// 🤔
longest(10, 100) // [!codeㅤ error]
```

- 使用误区：将约束条件和类型本身混淆

```ts
function minimumLength<T extends { length: number }>(
  obj: T,
  minimum: number
): T {
  if (obj.length >= minimum) {
    return obj
  } else {
    return { length: minimum }
  }
}

// oops! arr是{ length: number }类型 不能完整包含类型T中的结构
const arr = minimumLength([1, 2, 3], 6)
console.log(arr.slice(0))
```

- 一份如何写好泛型函数的指南(😀 让调用者使用愉快)

>- Push Type Parameters Down
>- Use Fewer Type Parameters
>- Type Parameters Should Appear Twice

### 重载

- 使用动机：当一个函数调用时允许传入不同的输入参数（包括参数个数、参数类型）

- 语法形式：重载签名在前，具体实现在尾(实现中的输入参数需要兼容签名所有签名)

```ts
function fn(x: string): string
function fn(x: number): boolean
function fn(x: string | number): string | boolean {
  return 'hello, typescript'
}
```

- 当多个重载签名具有相同个数的入参和返回值类型时，优先使用联合类型或许是更优解（重载往往会在函数实现中引入大量的类型缩窄判断）

```ts
function len(s: string): number
function len(arr: any[]): number
function len(x: any) {
  return x.length
}

len('')
len([0])
// 🤔
len(Math.random() > 0.5 ? 'hello' : [0]) // [!code error]
```

## 对象类型

TODO:

## 类类型

### 构造函数

- 区别之前函数签名的点

  1. 不支持类型参数
  2. 不需要注解返回值类型

- [`super`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super) 关键字的使用

```ts
class Base {
  k = 4
}

class Derived extends Base {
  constructor() {
    console.log(this.k) // [!code error]  // 🤔
    super()
  }
}
```

### 类成员

- 成员字段的类型注解

```ts
class Point {
  // 声明时注解类型
  x: number
  // 也可以给定一个初始值，编译器会自动推断类型
  y = 0 // 相当于 y: number = 0

  constructor() {
    // 在构造函数中初始化成员字段
    this.x = 0
    this.z = 0 // [!code error]  // 字段z未声明
  }
}
```

- 只读修饰符

```ts
// 以下两种方式均可表示类成员字段只读
class Greeter {
  // 方式一 使用readonly修饰符
  readonly name: string = 'world'
  _length = 0
  // 方式二 仅实现getter存取器
  get length() {
    return this._length
  }

  foo() {
    this.name = 'world2' // error
    this.length = 1 // error
  }
}
```

- 可见修饰符

| 修饰符      | 类自身 | 子类 | 类实例 |
| :---------- | :----- | :--- | :----- |
| `public`    | ✔️      | ✔️    | ✔️      |
| `protected` | ✔️      | ✔️    | ❌      |
| `private`   | ✔️      | ❌    | ❌      |

> 📝 以上修饰符在发出到 JavaScript 时都会丢失，有需要可参考 Javascript 原生支持的私有字段修饰符[`#`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)

- `static` 关键字

  > [Static Members | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)

  🤔 以下案例报错原因

```ts
class Box<T> {
  static defaultValue: T
}
```

### 类继承

- 使用 `implements` 关键字简单限定类的字段结构(JavaScript 不支持)

```ts
interface Base {
  foo(arg: string): void
  x: number
  y?: number
}

// 需要实现给定的字段
class Derived implements Base {
  // x 限定 number类型
  x = 0
  // foo 要求匹配入参类型和返回类型
  foo(arg2: string) {}
  // y是可选字段 可以忽略
}
```

- 使用 `extends` 关键字来严格实现继承关系

  > 参考[Javascript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends)

- 📝 在实例化类时，成员的声明顺序

```ts
class Base {
  name = 'base'
  constructor() {
    console.log('My name is ' + this.name)
  }
}
class Derived extends Base {
  name = 'derived'
}
//🤔 prints "base" or "derived"
const d = new Derived()
```

### this

TODO:


## 参考链接

- [handbook 原文](https://www.typescriptlang.org/docs/handbook/intro.html)
