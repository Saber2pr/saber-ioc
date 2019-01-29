/*
 * @Author: AK-12
 * @Date: 2019-01-24 07:11:58
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-01-29 21:08:45
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
  STATIC: 'saber_singleton'
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
      Reflect.defineMetadata(
        MetaKey(id || Reflect.get(target, 'name')),
        target,
        MetaStore
      )
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
 * @export
 * @param {*} target
 */
export function Singleton(target: any) {
  Reflect.defineMetadata(CLASSTYPE.STATIC, undefined, target)
}
/**
 * ## Static
 * `tag`:`Static`
 *
 * @export
 * @param {*} target
 */
export function Static(target: any) {
  Reflect.defineMetadata(CLASSTYPE.STATIC, undefined, target)
}
/**
 * # Class
 */
namespace Class {
  export const isStatic = (target: any) =>
    Reflect.hasMetadata(CLASSTYPE.STATIC, target)
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
    if (Class.isStatic(constructor)) {
      return <any>constructor
    }
    const depKeys = (<string[]>Reflect.getMetadataKeys(constructor))
      .filter(key => key.indexOf(META) !== -1)
      .reverse()
    const dependenciesMeta = depKeys.map(key => {
      if (Reflect.hasMetadata(key, MetaStore)) {
        return Reflect.getMetadata(key, MetaStore)
      } else {
        throw new Error(
          `cannot found ${key.replace(META, 'dependence')} in container.`
        )
      }
    })
    const paramTypes: [] =
      Reflect.getMetadata('design:paramtypes', constructor) || []
    paramTypes.forEach((value, index) => {
      if (Reflect.get(value, 'name') !== 'Object') {
        dependenciesMeta.splice(index, 0, value)
      }
    })
    const depInstances = dependenciesMeta.map(dependence =>
      create(<any>dependence)
    )
    return new constructor(...depInstances)
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
