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

// @SaIOC.BootStrap
// class Test {
//   constructor(private name = 'test') {}
//   boot() {
//     console.log('test')
//   }
//   main() {
//     console.log('main:', this.name)
//   }
// }
// // import 'reflect-metadata'
// class Test0 {
//   get() {
//     return '000'
//   }
// }

// @Boot
// class Test {
//   constructor(private test: string) {}
// }

// function Boot(target) {
//   console.log(create(target).test)
// }

// function create(constructor) {
//   const dependenciesParam: Function[] =
//     Reflect.getMetadata('design:paramtypes', constructor) || []

//   const depInstances = dependenciesParam.map(dependence =>
//     create(<any>dependence)
//   )

//   return new constructor(...depInstances.reverse())
// }

// console.log([1, 2].concat([2, 3]))

export function test_saber_ioc() {}
