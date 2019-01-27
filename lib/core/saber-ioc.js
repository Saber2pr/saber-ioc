"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: AK-12
 * @Date: 2019-01-24 07:11:58
 * @Last Modified by: AK-12
 * @Last Modified time: 2019-01-27 22:10:41
 */
require("reflect-metadata");
/**
 * # MetaStore
 * save metadata.
 */
var MetaStore = {};
/**
 * # META
 */
var META = 'saber_meta';
/**
 * # DEP
 */
var DEP = 'saber_dep';
/**
 *# MAIN
 */
var MAIN = 'saber_main';
/**
 * # MetaKey
 * return a META key.
 * @param id
 */
var MetaKey = function (id) { return META + ":" + id; };
/**
 * # DepKey
 * return a DEP key.
 * @param id
 */
var DepKey = function (id) { return DEP + ":" + id; };
/**
 * # Injectable
 * register the target to metaStore.
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
            Reflect.defineMetadata(MetaKey(id || target.name), target, MetaStore);
        }
    };
}
exports.Injectable = Injectable;
/**
 * # Inject
 * inject the metadata needed to target.
 * @export
 * @param {string} id
 * @returns {ParameterDecorator}
 */
function Inject(id) {
    return function (target) { return Reflect.defineMetadata(DepKey(id), MetaKey(id), target); };
}
exports.Inject = Inject;
/**
 * ## Bootstrap
 * `tag`:`main class`
 *
 * @export
 * @template T
 * @param {Constructor<T>} target
 */
function Bootstrap(target) {
    Reflect.defineMetadata(MAIN, '', target);
}
exports.Bootstrap = Bootstrap;
/**
 * # SaFactory
 * ## A simple ioc container for classes
 * 1. ensure `tsconfig.json` : `"emitDecoratorMetadata": true`.
 * 2. ensure `tsconfig.json` : `"experimentalDecorators": true`.
 * @exports
 */
var SaFactory;
(function (SaFactory) {
    /**
     * Factory
     *
     * @export
     * @template T
     * @param {Constructor<T>} constructor
     * @returns {T}
     */
    function create(constructor) {
        var depKeys = Reflect.getMetadataKeys(constructor)
            .filter(function (key) { return key.indexOf(DEP) !== -1; })
            .map(function (key) { return key.replace(DEP, META); });
        var dependencies = depKeys.map(function (key) {
            return Reflect.getMetadata(key, MetaStore);
        });
        var depInstances = dependencies.map(function (dependence) {
            if (dependence.length) {
                return create(dependence);
            }
            else {
                return new dependence();
            }
        });
        return new (constructor.bind.apply(constructor, [void 0].concat(depInstances.reverse())))();
    }
    SaFactory.create = create;
    function BootStrap(constructor, mainMethod) {
        var props = Object.keys(constructor.prototype);
        var main = create(constructor);
        if (props.some(function (value) { return value === 'main'; })) {
            main['main']();
        }
        else {
            main[mainMethod || props[0]]();
        }
    }
    SaFactory.BootStrap = BootStrap;
    /**
     * # Container
     * `create an ioc container.`
     * @export
     * @class Container
     */
    var Container = /** @class */ (function () {
        function Container() {
            var Constructor = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Constructor[_i] = arguments[_i];
            }
            var _this = this;
            this.ERROR = {
                NOTFOUND_MAINCLASS: 'main class not found. try to set a `Bootstrap` decorator to a class.'
            };
            Constructor.forEach(function (constructor) {
                if (Reflect.hasMetadata(MAIN, constructor)) {
                    _this.main = constructor;
                }
                else {
                    create(constructor);
                }
            });
        }
        /**
         * pull
         * `get the main class instance`
         *
         * @returns
         * @memberof Container
         */
        Container.prototype.pull = function () {
            if (this.main) {
                return create(this.main);
            }
            else {
                throw new Error(this.ERROR.NOTFOUND_MAINCLASS);
            }
        };
        /**
         * run
         * `run the Container`
         *
         * @memberof Container
         */
        Container.prototype.run = function () {
            if (this.main) {
                SaFactory.BootStrap(this.main);
            }
            else {
                throw new Error(this.ERROR.NOTFOUND_MAINCLASS);
            }
        };
        return Container;
    }());
    SaFactory.Container = Container;
})(SaFactory = exports.SaFactory || (exports.SaFactory = {}));
