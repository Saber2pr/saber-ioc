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
import { Injectable } from '../../core/saber-ioc'
import { IA } from './type'

@Injectable()
export class A implements IA {
  constructor() {}
  getName() {
    return 'A'
  }
}
```

```ts
import { Inject, Injectable } from '../../core/saber-ioc'
import { IB, IA } from './type'

@Injectable()
export class B implements IB {
  constructor(@Inject('A') public A: IA) {}
  getName() {
    return this.A.getName() + 'B'
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
    return this.B.getName() + 'C'
  }
}
```

```ts
import { Bootstrap, Inject, Injectable } from '../../core/saber-ioc'
import { IA, IB, IC } from './type'

@Bootstrap
@Injectable()
export class D {
  constructor(
    @Inject('A') public A: IA,
    @Inject('B') public B: IB,
    @Inject('C') public C: IC
  ) {}
  test() {
    console.log(this.A.getName())
    console.log(this.B.getName())
    console.log(this.C.getName())
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
