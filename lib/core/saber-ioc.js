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
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: saber2pr
 * @Date: 2019-01-24 07:11:58
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-01-30 20:45:30
 */
require("reflect-metadata");
/**
 * # MetaStore
 * save metadata.
 */
var MetaStore = {};
/**
 * # BASETYPE
 */
var BASETYPES = [
    "Number" /* NUMBER */,
    "String" /* SRTING */,
    "Boolean" /* BOOLEAN */,
    "undefined" /* VOID */,
    "Array" /* ARRAY */
];
/**
 * # MetaKey
 * return a META key.
 * @param id
 */
var MetaKey = function (id) { return "saber_meta" /* META */ + ":" + id; };
/**
 * # Injectable
 *
 * `Decorator`
 *
 * register the target to metaStore by id.
 * @export
 * @param {string} [id]
 * @returns {ClassDecorator}
 */
function Injectable(id) {
    return function (target) {
        if (Reflect.hasMetadata(MetaKey(id), MetaStore)) {
            throw new Error("id:[" + id + "] is existed!");
        }
        else {
            Reflect.defineMetadata(MetaKey(id || Reflect.get(target, 'name')), target, MetaStore);
        }
    };
}
exports.Injectable = Injectable;
/**
 * # Inject
 *
 * `Decorator`
 *
 * set a metadata tag needed to target.
 * @export
 * @param {string} id
 * @returns {ParameterDecorator}
 */
function Inject(id) {
    return function (target, key, index) {
        return Reflect.defineMetadata(MetaKey(id), index, target);
    };
}
exports.Inject = Inject;
/**
 * ## Bootstrap
 *
 * `Decorator`
 *
 * `tag`:`main class`
 *
 * `provide`:`main()`
 *
 * @export
 * @template T
 * @param {Constructor<T>} target
 */
function Bootstrap(target) {
    Reflect.defineMetadata("saber_main" /* MAIN */, undefined, target);
}
exports.Bootstrap = Bootstrap;
/**
 * ## Singleton
 *
 * `Decorator`
 *
 * `tag`:`Singleton`
 *
 * @export
 * @param {*} target
 */
function Singleton(target) {
    Reflect.defineMetadata("saber_static" /* STATIC */, undefined, target);
}
exports.Singleton = Singleton;
/**
 * ## Static
 *
 * `Decorator`
 *
 * `tag`:`Static`
 *
 * @export
 * @param {*} target
 */
function Static(target) {
    Reflect.defineMetadata("saber_static" /* STATIC */, undefined, target);
}
exports.Static = Static;
/**
 * # Class
 */
var Class;
(function (Class) {
    Class.isStatic = function (target) {
        return Reflect.hasMetadata("saber_static" /* STATIC */, target);
    };
})(Class || (Class = {}));
/**
 * TypeCheck
 *
 * @param {Constructor} constructor$
 */
function TypeCheck(constructor$) {
    if (BASETYPES.some(function (TYPE) { return TYPE === Reflect.get(constructor$, 'name'); })) {
        throw new Error("the param of class[" + Reflect.getMetadata("saber_visited" /* VISITED */, MetaStore) + "]'s constructor has invalid type: " + constructor$.name);
    }
    else {
        Reflect.defineMetadata("saber_visited" /* VISITED */, constructor$.name, MetaStore);
    }
}
/**
 * ParamCheck
 *
 * `Decorator`
 *
 * @param {Constructor} constructor
 * @param {string} methodName
 * @returns
 */
function ParamCheck(constructor, methodName) {
    var origin = Reflect.get(constructor, methodName);
    Reflect.set(constructor, methodName, function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var constructor$ = params[0];
        if (Class.isStatic(constructor$)) {
            return constructor$;
        }
        TypeCheck(constructor$);
        return origin.apply(constructor, params);
    });
    return origin;
}
/**
 * # SaIOC
 * ## A simple ioc container for classes
 * 1. ensure `tsconfig.json` : `"emitDecoratorMetadata": true`.
 * 2. ensure `tsconfig.json` : `"experimentalDecorators": true`.
 * @exports
 */
var SaIOC;
(function (SaIOC) {
    /**
     * # Factory
     */
    var Factory = /** @class */ (function () {
        function Factory() {
        }
        /**
         * create
         *
         * @template T
         * @param {Constructor<T>} constructor
         * @returns {T}
         */
        Factory.create = function (constructor) {
            var _this = this;
            var dependenciesMeta = [];
            if (Reflect.hasMetadata("design:paramtypes" /* PARAMTYPES */, constructor)) {
                ;
                (Reflect.getMetadata("design:paramtypes" /* PARAMTYPES */, constructor)).forEach(function (value, index) {
                    if (Reflect.get(value, 'name') !== 'Object') {
                        dependenciesMeta[index] = value;
                    }
                });
            }
            var depKeys = Reflect.getMetadataKeys(constructor).filter(function (key) { return key.indexOf("saber_meta" /* META */) !== -1; });
            depKeys.forEach(function (key) {
                if (Reflect.hasMetadata(key, MetaStore)) {
                    var index = Reflect.getMetadata(key, constructor);
                    var meta = Reflect.getMetadata(key, MetaStore);
                    dependenciesMeta[index] = meta;
                }
                else {
                    throw new Error("cannot found " + key.replace("saber_meta" /* META */, 'dependence') + " in container.");
                }
            });
            var depInstances = dependenciesMeta.map(function (dependence) {
                return _this.create(dependence);
            });
            return new (constructor.bind.apply(constructor, [void 0].concat(depInstances)))();
        };
        var _a;
        __decorate([
            ParamCheck,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", typeof (_a = typeof T !== "undefined" && T) === "function" ? _a : Object)
        ], Factory, "create", null);
        return Factory;
    }());
    SaIOC.Factory = Factory;
    function BootStrap(constructor, mainMethod) {
        var main = Factory.create(constructor);
        if (Reflect.has(constructor.prototype, "main" /* BOOT */)) {
            ;
            Reflect.get(constructor.prototype, "main" /* BOOT */).apply(main);
        }
        else {
            ;
            (Reflect.get(constructor.prototype, mainMethod || Reflect.ownKeys(constructor.prototype)[1])).apply(main);
        }
    }
    SaIOC.BootStrap = BootStrap;
    /**
     * @export
     * @class Container
     */
    var Container = /** @class */ (function () {
        /**
         * # Container
         * `create an ioc container.`
         * @param {...Constructor[]} Constructors
         * @memberof Container
         */
        function Container() {
            var Constructors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Constructors[_i] = arguments[_i];
            }
            this.main =
                Constructors.find(function (constructor) {
                    return Reflect.hasMetadata("saber_main" /* MAIN */, constructor);
                }) || Constructors[0];
        }
        /**
         * pull
         * `get the main class instance`
         *
         * @template T
         * @returns {T}
         * @memberof Container
         */
        Container.prototype.pull = function () {
            return Factory.create(this.main);
        };
        Container.prototype.run = function (Constructor) {
            BootStrap(Constructor || this.main);
        };
        return Container;
    }());
    SaIOC.Container = Container;
})(SaIOC = exports.SaIOC || (exports.SaIOC = {}));
