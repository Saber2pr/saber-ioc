# saber-ioc

[![npm](https://img.shields.io/npm/v/saber-ioc.svg)](https://www.npmjs.com/package/saber-ioc)

> an simple ioc container for classes

```bash
# from npm
npm install saber-ioc

# from github
git clone https://github.com/Saber2pr/saber-ioc.git
```

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
import { Bootstrap, Inject } from '../../core/saber-ioc'
import { IA, IB, IC } from './type'

@Bootstrap
export class D {
  constructor(
    @Inject('A') public A: IA,
    @Inject('B') public B: IB,
    @Inject('C') public C: IC
  ) {}
  main() {
    console.log(this.A.getName())
    console.log(this.B.getName())
    console.log(this.C.getName())
  }
}
```

```ts
// dependencies
import './example/A'
import './example/B'
import './example/C'
import './example/D'

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
# auto compile to commonjs
npm start

# auto compile to es5
npm run dev

```

> Author: saber2pr

---

## develope and test

> you should write ts in /src

> ts -(tsc)-> commonjs -(webpack)-> es5

> you should make test in /src/test

> export your core in /src/index.ts!

---
