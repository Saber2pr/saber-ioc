"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var saber_ioc_1 = require("../core/saber-ioc");
var D_1 = require("./example/D");
var C_1 = require("./example/C");
var A_1 = require("./example/A");
var B_1 = require("./example/B");
var result = new saber_ioc_1.SaFactory.Container(C_1.C, A_1.A, D_1.D, B_1.B).pull();
result.test();
function test_saber_ioc() { }
exports.test_saber_ioc = test_saber_ioc;
