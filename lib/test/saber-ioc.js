"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var saber_ioc_1 = require("../core/saber-ioc");
var C_1 = require("./example/C");
var A_1 = require("./example/A");
var D_1 = require("./example/D");
var B_1 = require("./example/B");
var E_1 = require("./example/E");
var container = new saber_ioc_1.SaFactory.Container(C_1.C, D_1.D, A_1.A, B_1.B, E_1.E);
container.run();
// let main = container.pull<D>()
// main.test()
// @SaFactory.BootStrap
// class Test {
//   boot() {
//     console.log('test')
//   }
//   main() {
//     console.log('sa')
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
function test_saber_ioc() { }
exports.test_saber_ioc = test_saber_ioc;
