"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var saber_ioc_1 = require("../core/saber-ioc");
var A_1 = require("./example/A");
var B_1 = require("./example/B");
var C_1 = require("./example/C");
var D_1 = require("./example/D");
new saber_ioc_1.SaFactory.Container(C_1.C, D_1.D, A_1.A, B_1.B);
function test_saber_ioc() { }
exports.test_saber_ioc = test_saber_ioc;
