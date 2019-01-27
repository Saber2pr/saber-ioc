"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var saber_ioc_1 = require("../../core/saber-ioc");
var D = /** @class */ (function () {
    function D(A, B, C) {
        this.A = A;
        this.B = B;
        this.C = C;
    }
    D.prototype.test = function () {
        console.log(this.A.getName());
        console.log(this.B.getName());
        console.log(this.C.getName());
    };
    D = __decorate([
        saber_ioc_1.Bootstrap,
        saber_ioc_1.Injectable(),
        __param(0, saber_ioc_1.Inject('A')),
        __param(1, saber_ioc_1.Inject('B')),
        __param(2, saber_ioc_1.Inject('C')),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], D);
    return D;
}());
exports.D = D;
