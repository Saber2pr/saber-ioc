import 'reflect-metadata';
/**
 * ## Constructor
 * class type.
 * @exports
 */
export declare type Constructor<T = any> = {
    new (...args: Array<any>): T;
};
/**
 * # Injectable
 * register the target to metaStore by id.
 * @export
 * @param {string} [id]
 * @returns {ClassDecorator}
 */
export declare function Injectable(id?: string): ClassDecorator;
/**
 * # Inject
 * set a metadata tag needed to target.
 * @export
 * @param {string} id
 * @returns {ParameterDecorator}
 */
export declare function Inject(id: string): ParameterDecorator;
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
export declare function Bootstrap<T>(target: Constructor<T>): void;
/**
 * ## Singleton
 * `tag`:`Singleton`
 *
 * `provide`:`instance`
 *
 * @export
 * @param {*} target
 */
export declare function Singleton(target: any): void;
/**
 * ## SingletonLazy
 * `tag`:`SingletonLazy`
 *
 * `provide`:`getInstance()`
 *
 * @export
 * @param {*} target
 */
export declare function SingletonLazy(target: any): void;
/**
 * # SaFactory
 * ## A simple ioc container for classes
 * 1. ensure `tsconfig.json` : `"emitDecoratorMetadata": true`.
 * 2. ensure `tsconfig.json` : `"experimentalDecorators": true`.
 * @exports
 */
export declare namespace SaFactory {
    /**
     * # BootStrap
     * ### class should provide method - `main`
     *
     * @export
     * @template T
     * @param {Constructor<T>} constructor
     */
    function BootStrap<T>(constructor: Constructor<T>): void;
    function BootStrap<T>(constructor: Constructor<T>, mainMethod: string): void;
    /**
     * @export
     * @class Container
     */
    class Container {
        private main;
        /**
         * # Container
         * `create an ioc container.`
         * @param {...Constructor[]} Constructors
         * @memberof Container
         */
        constructor(...Constructors: any[]);
        /**
         * pull
         * `get the main class instance`
         *
         * @template T
         * @returns {T}
         * @memberof Container
         */
        pull<T = any>(): T;
        /**
         * run
         * `run the Container`
         *
         * @memberof Container
         */
        run(): void;
        /**
         * run
         * `run the Constructor of the Container`
         *
         * @memberof Container
         */
        run(Constructor: Constructor): void;
    }
}
