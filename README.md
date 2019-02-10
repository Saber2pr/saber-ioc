<h1 align="center">saber-ioc</h1>
  <p align="center">
    <a href="https://www.npmjs.com/package/saber-ioc">
      <img src="https://img.shields.io/npm/v/saber-ioc.svg?colorB=blue" />
    </a>
  </p>
<h3 align="center">a simple ioc container for classes</h3>

```bash
# from npm
npm install saber-ioc

# from github
git clone https://github.com/Saber2pr/saber-ioc.git
```

## examples

```ts
import { Injectable, Singleton } from '../../core/saber-ioc'
import { IA } from './type'

@Singleton
@Injectable()
export class A implements IA {
  private constructor() {}
  static instance: A
  static getInstance() {
    this.instance = this.instance || new A()
    return this.instance
  }
  private name = 'A'
  getName() {
    return this.name
  }
  setName(v: string) {
    this.name = v
  }
}
```

```ts
import { Inject, Injectable } from '../../core/saber-ioc'
import { IB, IA, ISA } from './type'

@Injectable()
export class B implements IB {
  constructor(@Inject('A') public A: ISA, private name = 233) {}
  getName() {
    this.A.getInstance().setName('test')
    return this.A.getInstance().getName() + this.name
  }
}
```

```ts
import { IB, IC } from './type'
import { Injectable, Inject } from '../../core/saber-ioc'

@Injectable()
export class C implements IC {
  constructor(@Inject('B') public B: IB) {}
  getName() {
    console.log(this.B.getName())
    return this.B.getName() + 'C'
  }
}
```

```ts
import { Inject, Injectable, Bootstrap } from '../../core/saber-ioc'
import { IB, ISA, IE } from './type'
import { C } from './C'

@Bootstrap
@Injectable()
export class D {
  constructor(
    @Inject('A') public A: ISA,
    public C: C,
    @Inject('B') public B: IB,
    @Inject('E') public E: IE
  ) {}
  private value = 'test'
  test() {
    console.log(this.value)
  }
  main() {
    console.log(this.B.getName())
    console.log(this.A.getInstance().getName())
    console.log(this.C.getName())
    console.log(this.E.getName())
  }
}
```

```ts
import { Injectable, Static } from '../../core/saber-ioc'

@Injectable()
export class E {
  constructor(private name = 'E') {}
  getName() {
    return this.name
  }
}
```

```ts
import { Inject, Bootstrap, Injectable, SaIOC } from '../core/saber-ioc'
import { C } from './example/C'
import { A } from './example/A'
import { D } from './example/D'
import { B } from './example/B'
import { E } from './example/E'
let container = new SaIOC.Container(C, D, A, B, E)
container.run()

let main = container.pull<D>()

main.test()
/**
 * console:
 *
 * test233
 * test
 * test233
 * test233C
 * E
 * test
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
# install the dependencies
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
