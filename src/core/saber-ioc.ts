/*
 * @Author: AK-12
 * @Date: 2019-01-24 07:11:58
 * @Last Modified by: AK-12
 * @Last Modified time: 2019-01-27 22:10:41
 */
import 'reflect-metadata'
/**
 * # MetaStore
 * save metadata.
 */
const MetaStore = {}
/**
 * # META
 * `meta token`
 */
const META = 'saber_meta'
/**
 * # MAIN
 * `main class tag`
 */
const MAIN = 'saber_main'
/**
 * # CLASSTYPE
 */
const CLASSTYPE = {
  SINGLETON: 'saber_singleton',
  SINGLETON_LAZY: 'saber_singleton_lazy'
}
/**
 * ## Constructor
 * class type.
 * @exports
 */
export type Constructor<T = any> = { new (...args: Array<any>): T }
/**
 * # MetaKey
 * return a META key.
 * @param id
 */
const MetaKey = (id: string) => `${META}:${id}`
/**
 * # Injectable
 * register the target to metaStore by id.
 * @export
 * @param {string} [id]
 * @returns {ClassDecorator}
 */
export function Injectable(id?: string): ClassDecorator {
  return target => {
    if (Reflect.hasMetadata(MetaKey(id), MetaStore)) {
      throw new Error(`id:[${id}] is existed!`)
    } else {
      Reflect.defineMetadata(MetaKey(id || target.name), target, MetaStore)
    }
  }
}
/**
 * # Inject
 * set a metadata tag needed to target.
 * @export
 * @param {string} id
 * @returns {ParameterDecorator}
 */
export function Inject(id: string): ParameterDecorator {
  return target => Reflect.defineMetadata(MetaKey(id), undefined, target)
}
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
export function Bootstrap<T>(target: Constructor<T>) {
  Reflect.defineMetadata(MAIN, undefined, target)
}
/**
 * ## Singleton
 * `tag`:`Singleton`
 *
 * `provide`:`instance`
 *
 * @export
 * @param {*} target
 */
export function Singleton(target: any) {
  Reflect.defineMetadata(CLASSTYPE.SINGLETON, undefined, target)
}
/**
 * ## SingletonLazy
 * `tag`:`SingletonLazy`
 *
 * `provide`:`getInstance()`
 *
 * @export
 * @param {*} target
 */
export function SingletonLazy(target: any) {
  Reflect.defineMetadata(CLASSTYPE.SINGLETON_LAZY, undefined, target)
}
/**
 * # Class
 */
namespace Class {
  export interface Singleton {
    instance
  }
  export interface SingletonLazy {
    getInstance()
  }
  export const isSingleton = (target: any): target is Singleton =>
    Reflect.hasMetadata(CLASSTYPE.SINGLETON, target)
  export const isSingletonLazy = (target: any): target is SingletonLazy =>
    Reflect.hasMetadata(CLASSTYPE.SINGLETON_LAZY, target)
}
/**
 * # SaFactory
 * ## A simple ioc container for classes
 * 1. ensure `tsconfig.json` : `"emitDecoratorMetadata": true`.
 * 2. ensure `tsconfig.json` : `"experimentalDecorators": true`.
 * @exports
 */
export namespace SaFactory {
  /**
   * create
   *
   * @template T
   * @param {Constructor<T>} constructor
   * @returns {T}
   */
  function create<T>(constructor: Constructor<T>): T {
    if (Class.isSingleton(constructor)) {
      if (constructor.instance) {
        return constructor.instance
      } else {
        throw new Error('constructor should provide `instance`.')
      }
    } else if (Class.isSingletonLazy(constructor)) {
      if (constructor.getInstance) {
        return constructor.getInstance()
      } else {
        throw new Error('constructor should provide `getInstance`.')
      }
    }
    const depKeys = (<string[]>Reflect.getMetadataKeys(constructor)).filter(
      key => key.indexOf(META) !== -1
    )
    const dependencies = depKeys.map(key => Reflect.getMetadata(key, MetaStore))
    const depInstances = dependencies.map(dependence => create(<any>dependence))
    return new constructor(...depInstances.reverse())
  }
  /**
   * # BootStrap
   * ### class should provide method - `main`
   *
   * @export
   * @template T
   * @param {Constructor<T>} constructor
   */
  export function BootStrap<T>(constructor: Constructor<T>): void
  export function BootStrap<T>(
    constructor: Constructor<T>,
    mainMethod: string
  ): void
  export function BootStrap<T>(
    constructor: Constructor<T>,
    mainMethod?: string
  ): void {
    const props = Object.keys(constructor.prototype)
    const main = create(constructor)
    if (props.some(value => value === 'main')) {
      main['main']()
    } else {
      main[mainMethod || props[0]]()
    }
  }
  /**
   * @export
   * @class Container
   */
  export class Container {
    private main: Constructor
    /**
     * # Container
     * `create an ioc container.`
     * @param {...Constructor[]} Constructors
     * @memberof Container
     */
    constructor(...Constructors: any[]) {
      this.main =
        Constructors.find(constructor =>
          Reflect.hasMetadata(MAIN, constructor)
        ) || Constructors[0]
    }
    /**
     * pull
     * `get the main class instance`
     *
     * @template T
     * @returns {T}
     * @memberof Container
     */
    pull<T = any>(): T {
      return create(this.main)
    }
    /**
     * run
     * `run the Container`
     *
     * @memberof Container
     */
    run(): void
    /**
     * run
     * `run the Constructor of the Container`
     *
     * @memberof Container
     */
    run(Constructor: Constructor): void
    run(Constructor?: Constructor): void {
      SaFactory.BootStrap(Constructor || this.main)
    }
  }
}
