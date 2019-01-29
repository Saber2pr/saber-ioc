# saber-ioc

[![npm](https://img.shields.io/npm/v/saber-ioc.svg?colorB=blue)](https://www.npmjs.com/package/saber-ioc)

> a simple ioc container for classes

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
  constructor(@Inject('A') public A: ISA) {}
  getName() {
    this.A.getInstance().setName('test')
    return this.A.getInstance().getName() + 'B'
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
  test() {
    console.log(this.B.getName())
    console.log(this.A.getInstance().getName())
    console.log(this.C.getName())
    console.log(this.E.getName())
  }
}
```

```ts
import { Injectable, Static } from '../../core/saber-ioc'

@Static
@Injectable()
export class E {
  static getName() {
    return 'E'
  }
}
```

```ts
import { SaFactory } from '../core/saber-ioc'
import { C } from './example/C'
import { A } from './example/A'
import { D } from './example/D'
import { B } from './example/B'

let container = new SaFactory.Container(C, A, D, B)
container.run()
// console
/**
 * A
 * AB
 * ABC
 */
let main: D = container.pull()

main.test()
// console
/**
 * A
 * AB
 * ABC
 */
```

---

## start

```bash
# install the typescript and webpack
npm install
```

```bash
npm start

npm run test

```

> Author: saber2pr

---

## develope and test

> you should write ts in /src

> you should make test in /src/test

---

# License

MIT
