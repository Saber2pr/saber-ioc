"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var Test = /** @class */ (function () {
    function Test() {
    }
    Test.prototype.boot = function () {
        console.log('test');
    };
    Test.prototype.main = function () {
        console.log('sa');
    };
    Test = __decorate([
        saber_ioc_1.SaFactory.BootStrap
    ], Test);
    return Test;
}());
function test_saber_ioc() { }
exports.test_saber_ioc = test_saber_ioc;
