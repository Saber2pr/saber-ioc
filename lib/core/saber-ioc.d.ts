import 'reflect-metadata';
/**
 * ## Constructor
 * class type.
 * @exports
 */
declare type Constructor<T> = {
    new (...args: Array<any>): T;
};
/**
 * # Injectable
 * register the target to metaStore.
 * @export
 * @param {string} [id]
 * @returns {ClassDecorator}
 */
export declare function Injectable(id?: string): ClassDecorator;
/**
 * # Inject
 * inject the metadata needed to target.
 * @export
 * @param {string} id
 * @returns {ParameterDecorator}
 */
export declare function Inject(id: string): ParameterDecorator;
/**
 * ## Bootstrap
 * `tag`:`main class`
 *
 * @export
 * @template T
 * @param {Constructor<T>} target
 */
export declare function Bootstrap<T>(target: Constructor<T>): void;
/**
 * # SaFactory
 * ## A simple ioc container for classes
 * 1. ensure `tsconfig.json` : `"emitDecoratorMetadata": true`.
 * 2. ensure `tsconfig.json` : `"experimentalDecorators": true`.
 * @exports
 */
export declare namespace SaFactory {
    /**
     * Factory
     *
     * @export
     * @template T
     * @param {Constructor<T>} constructor
     * @returns {T}
     */
    function create<T>(constructor: Constructor<T>): T;
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
     * # Container
     * `create an ioc container.`
     * @export
     * @class Container
     */
    class Container {
        private main;
        private ERROR;
        constructor(...Constructor: Constructor<any>[]);
        /**
         * pull
         * `get the main class instance`
         *
         * @returns
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
    }
}
export {};
