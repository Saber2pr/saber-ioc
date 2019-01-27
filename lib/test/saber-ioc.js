"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var saber_ioc_1 = require("../core/saber-ioc");
var C_1 = require("./example/C");
var A_1 = require("./example/A");
var D_1 = require("./example/D");
var B_1 = require("./example/B");
var container = new saber_ioc_1.SaFactory.Container(C_1.C, A_1.A, D_1.D, B_1.B);
container.run();
var main = container.pull();
main.test();
function test_saber_ioc() { }
exports.test_saber_ioc = test_saber_ioc;
