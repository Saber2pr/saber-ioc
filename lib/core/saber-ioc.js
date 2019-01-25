"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: AK-12
 * @Date: 2019-01-24 07:11:58
 * @Last Modified by: AK-12
 * @Last Modified time: 2019-01-25 10:36:30
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
    return function (target) {
        return Reflect.defineMetadata(DepKey(id), Reflect.getMetadata(MetaKey(id), MetaStore), target);
    };
}
exports.Inject = Inject;
/**
 * # SaFactory
 * ## An simple ioc container for classes
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
        var depKeys = Reflect.getOwnMetadataKeys(constructor).filter(function (key) { return key.indexOf(DEP) !== -1; });
        var dependencies = depKeys.map(function (key) {
            return Reflect.getMetadata(key, constructor);
        });
        if (dependencies) {
            var depInstances = dependencies.map(function (deps) {
                if (deps.length) {
                    return create(deps);
                }
                else {
                    return new deps();
                }
            });
            return new (constructor.bind.apply(constructor, [void 0].concat(depInstances.reverse())))();
        }
        else {
            return new constructor();
        }
    }
    SaFactory.create = create;
    function BootStrap(constructor, mainMethod) {
        var props = Object.keys(constructor.prototype);
        if (props.some(function (value) { return value === 'main'; })) {
            create(constructor)[mainMethod || 'main']();
        }
        else {
            create(constructor)[props[0]]();
        }
    }
    SaFactory.BootStrap = BootStrap;
})(SaFactory = exports.SaFactory || (exports.SaFactory = {}));
/**
 * ## Bootstrap
 * `main class`
 *
 * @export
 * @template T
 * @param {Constructor<T>} target
 */
function Bootstrap(target) {
    SaFactory.BootStrap(target);
}
exports.Bootstrap = Bootstrap;
