"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: AK-12
 * @Date: 2019-01-24 07:11:58
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-01-29 21:08:45
 */
require("reflect-metadata");
/**
 * # MetaStore
 * save metadata.
 */
var MetaStore = {};
/**
 * # META
 * `meta token`
 */
var META = 'saber_meta';
/**
 * # MAIN
 * `main class tag`
 */
var MAIN = 'saber_main';
/**
 * # CLASSTYPE
 */
var CLASSTYPE = {
    STATIC: 'saber_singleton'
};
/**
 * # MetaKey
 * return a META key.
 * @param id
 */
var MetaKey = function (id) { return META + ":" + id; };
/**
 * # Injectable
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
 * set a metadata tag needed to target.
 * @export
 * @param {string} id
 * @returns {ParameterDecorator}
 */
function Inject(id) {
    return function (target) { return Reflect.defineMetadata(MetaKey(id), undefined, target); };
}
exports.Inject = Inject;
/**
 * ## Bootstrap
 * `tag`:`main class`
 *
 * `provide`:`main()`
 *
 * @export
 * @template T
 * @param {Constructor<T>} target
 */
function Bootstrap(target) {
    Reflect.defineMetadata(MAIN, undefined, target);
}
exports.Bootstrap = Bootstrap;
/**
 * ## Singleton
 * `tag`:`Singleton`
 *
 * @export
 * @param {*} target
 */
function Singleton(target) {
    Reflect.defineMetadata(CLASSTYPE.STATIC, undefined, target);
}
exports.Singleton = Singleton;
/**
 * ## Static
 * `tag`:`Static`
 *
 * @export
 * @param {*} target
 */
function Static(target) {
    Reflect.defineMetadata(CLASSTYPE.STATIC, undefined, target);
}
exports.Static = Static;
/**
 * # Class
 */
var Class;
(function (Class) {
    Class.isStatic = function (target) {
        return Reflect.hasMetadata(CLASSTYPE.STATIC, target);
    };
})(Class || (Class = {}));
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
     * create
     *
     * @template T
     * @param {Constructor<T>} constructor
     * @returns {T}
     */
    function create(constructor) {
        if (Class.isStatic(constructor)) {
            return constructor;
        }
        var depKeys = Reflect.getMetadataKeys(constructor)
            .filter(function (key) { return key.indexOf(META) !== -1; })
            .reverse();
        var dependenciesMeta = depKeys.map(function (key) {
            if (Reflect.hasMetadata(key, MetaStore)) {
                return Reflect.getMetadata(key, MetaStore);
            }
            else {
                throw new Error("cannot found " + key.replace(META, 'dependence') + " in container.");
            }
        });
        var paramTypes = Reflect.getMetadata('design:paramtypes', constructor);
        paramTypes.forEach(function (value, index) {
            if (Reflect.get(value, 'name') !== 'Object') {
                dependenciesMeta.splice(index, 0, value);
            }
        });
        var depInstances = dependenciesMeta.map(function (dependence) {
            return create(dependence);
        });
        return new (constructor.bind.apply(constructor, [void 0].concat(depInstances)))();
    }
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
                    return Reflect.hasMetadata(MAIN, constructor);
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
            return create(this.main);
        };
        Container.prototype.run = function (Constructor) {
            SaFactory.BootStrap(Constructor || this.main);
        };
        return Container;
    }());
    SaFactory.Container = Container;
})(SaFactory = exports.SaFactory || (exports.SaFactory = {}));
