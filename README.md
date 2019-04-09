<h1 align="center">saber-ioc</h1>
  <p align="center">
    <a href="https://www.npmjs.com/package/saber-ioc">
      <img src="https://img.shields.io/npm/v/saber-ioc.svg?colorB=blue" />
    </a>
  </p>
<h3 align="center">a simple ioc container for classes --- 快速的依赖注入IOC容器</h3>
<h3 align="center">基于 Reflect-metadata 反射的控制反转容器，兼容 Typescript，es6、es5</h3>

# Start 开始使用

```bash
# from npm
npm install saber-ioc

# from github
git clone https://github.com/Saber2pr/saber-ioc.git

```

# API

1. @Bootstrap 注册一个类为 Bootstrap 类型

   `注意：`saber-ioc 会查找容器中拥有 Bootstrap 注解的类作为入口，默认执行该类的 main 方法，若没有 main 方法则执行第一个成员函数

   若容器中没有 Bootstrap 类型，则选容器中第一个类作为 Bootstrap

2. @Injectable(id?) 注解一个类作为元数据依赖，若没有提供 id 参数，则默认注册 id 为类名

   `注意：`请确保 id 是全局唯一的！

3. @Inject(id) 注解一个依赖到目标类中

   如果依赖类型是 Interface，请务必提供 Inject 注解。

4. @Singleton 注册一个类为单例

5. @Static 注册一个类为静态类

   `你可能已经发现这和@Singleton可能是一样的，你是对的`

## SaIOC 主命名空间

1. SaIOC.Container IOC 容器

   ```ts
   new Container(...Constructors: any[])
   ```

   你需要把所有依赖的类都放入到容器中

   实例方法：

   container.pull 这将返回创建好的类

   container.run 这将运行 Bootstrap

2. SaIOC.Factory
   这是一个静态类，它只有一个 create 方法

   ```ts
   SaIOC.Factory.create(constructor)
   ```

   这将开始自动构建 constructor 的实例并返回

## 一些示例 examples

```ts
import { Injectable } from '../../core/saber-ioc'
import { IServiceA, IServiceB } from './type'

@Injectable()
export class ServiceA implements IServiceA {
  getInforA() {
    return 'my name is A, age 222'
  }
}

@Injectable()
export class ServiceB implements IServiceB {
  getInforB() {
    return 'my name is B, age 333'
  }
}
```

```ts
import { Inject, Injectable } from '../../core/saber-ioc'
import {
  IServiceA,
  IServiceB,
  ISDispatcher,
  IControllerA,
  IControllerB
} from './type'

@Injectable()
export class ControllerA implements IControllerA {
  constructor(
    @Inject('ServiceA') private ServiceA: IServiceA,
    @Inject('Dispatcher') private Dispatcher: ISDispatcher
  ) {}
  register() {
    this.Dispatcher.getInstance().subscribe('A', this)
  }
  callControllerB() {
    this.Dispatcher.getInstance().emit(
      'A',
      'B',
      `Hello B! I am A. Infor: ${this.ServiceA.getInforA()}`
    )
  }
  resolveMessage(message: string) {
    console.log(message)
  }
}

@Injectable()
export class ControllerB implements IControllerB {
  constructor(
    @Inject('ServiceB') private ServiceB: IServiceB,
    @Inject('Dispatcher') private Dispatcher: ISDispatcher
  ) {}
  register() {
    this.Dispatcher.getInstance().subscribe('B', this)
  }
  callControllerA() {
    this.Dispatcher.getInstance().emit(
      'B',
      'A',
      `Hello A! I am B. Infor: ${this.ServiceB.getInforB()}`
    )
  }
  resolveMessage(message: string) {
    console.log(message)
  }
}
```

```ts
import { Injectable, Singleton } from '../../core/saber-ioc'
import { IDispatcher, Listener } from './type'

@Singleton
@Injectable()
export default class Dispatcher implements IDispatcher {
  private constructor() {
    this.listeners = new Map()
  }
  private static instance: Dispatcher = null
  public static getInstance(): Dispatcher {
    this.instance = this.instance || new Dispatcher()
    return this.instance
  }
  private listeners: Map<string, Listener>
  subscribe(id: string, listener: Listener) {
    this.listeners.set(id, listener)
    return this
  }
  unsubscribe(id: string) {
    this.listeners.delete(id)
    return this
  }
  emit(from: string, to: string, message: string) {
    if (this.listeners.has(from)) {
      if (this.listeners.has(to)) {
        this.listeners.get(to).resolveMessage(message)
      } else {
        console.log(`the id[${to}] called is not existed!`)
      }
    } else {
      console.log(`please subscribe our first!`)
    }
    return this
  }
}
```

```ts
import { SaIOC, Inject, Bootstrap } from '../core/saber-ioc'
import { ControllerA, ControllerB } from './example/controller'
import Dispatcher from './example/dispatcher'
import { ServiceA, ServiceB } from './example/service'

@Bootstrap
class Application {
  constructor(
    @Inject('ControllerA') private ControllerA: ControllerA,
    @Inject('ControllerB') private ControllerB: ControllerB
  ) {}
  main() {
    this.ControllerA.register()
    this.ControllerB.register()
    this.ControllerA.callControllerB()
    this.ControllerB.callControllerA()
  }
}

new SaIOC.Container(
  ControllerA,
  ControllerB,
  Dispatcher,
  ServiceA,
  ServiceB,
  Application
).run()
/**
 * Hello B! I am A. Infor: my name is A, age 222
 * Hello A! I am B. Infor: my name is B, age 333
 */
```

## browser(es6)

```js
class Service {
  constructor() {
    this.value = 'hello'
  }
}
// register to store by default id.
sioc.Injectable()(Service)
```

```js
class App {
  constructor(Service) {
    this.Service = Service
  }
  main() {
    console.log(this.Service.value)
  }
}
// set the main class
sioc.Bootstrap(App)
// inject the dependence
// params[0] is target, params[2] is constructor-param-index.
sioc.Inject('Service')(App, undefined, 0)

new sioc.SaIOC.Container(App, Service).run()
```

## browser(es5)

```js
function Service() {
  this.value = 'hello'
}

sioc.Injectable()(Service)
```

```js
function App(Service) {
  this.Service = Service
}
App.prototype.main = function() {
  console.log(this.Service.value)
}

sioc.Bootstrap(App)
sioc.Inject('Service')(App, undefined, 0)

new sioc.SaIOC.Container(App, Service).run()
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>saber-ioc in browser</title>
    <script src="./saber-ioc.min.js"></script>
    <script src="./src/injectable.js"></script>
  </head>

  <body></body>
  <script src="./src/index.js"></script>
</html>
```

---

## start

```bash
npm install
```

```bash
npm start

npm test

```

---

## develope and test

> you should write ts in /src

> you should make test in /src/test

---

# Author

saber2pr

---

# License

MIT
