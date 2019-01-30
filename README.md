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

---

## start

```bash
# install the dependencies
npm install
```

```bash
npm start

npm run test

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
