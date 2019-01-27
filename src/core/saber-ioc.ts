/*
 * @Author: AK-12
 * @Date: 2019-01-24 07:11:58
 * @Last Modified by: AK-12
 * @Last Modified time: 2019-01-27 13:22:17
 */
import 'reflect-metadata'
/**
 * # MetaStore
 * save metadata.
 */
const MetaStore = {}
/**
 * # META
 */
const META = 'saber_meta'
/**
 * # DEP
 */
const DEP = 'saber_dep'
/**
 *# MAIN
 */
const MAIN = 'saber_main'
/**
 * # MetaKey
 * return a META key.
 * @param id
 */
const MetaKey = (id: string) => `${META}:${id}`
/**
 * # DepKey
 * return a DEP key.
 * @param id
 */
const DepKey = (id: string) => `${DEP}:${id}`
/**
 * ## Constructor
 * class type.
 * @exports
 */
type Constructor<T> = { new (...args: Array<any>): T }
/**
 * # Injectable
 * register the target to metaStore.
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
 * inject the metadata needed to target.
 * @export
 * @param {string} id
 * @returns {ParameterDecorator}
 */
export function Inject(id: string): ParameterDecorator {
  return target => Reflect.defineMetadata(DepKey(id), MetaKey(id), target)
}
/**
 * ## Bootstrap
 * `tag`:`main class`
 *
 * @export
 * @template T
 * @param {Constructor<T>} target
 */
export function Bootstrap<T>(target: Constructor<T>) {
  Reflect.defineMetadata(MAIN, '', target)
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
   * Factory
   *
   * @export
   * @template T
   * @param {Constructor<T>} constructor
   * @returns {T}
   */
  export function create<T>(constructor: Constructor<T>): T {
    const depKeys = Reflect.getMetadataKeys(constructor)
      .filter(key => (<string>key).indexOf(DEP) !== -1)
      .map(key => key.replace(DEP, META))
    const dependencies: Array<Function> = depKeys.map(key =>
      Reflect.getMetadata(key, MetaStore)
    )
    const depInstances = dependencies.map(dependence => {
      if (dependence.length) {
        return create(<any>dependence)
      } else {
        return new (<any>dependence)()
      }
    })
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
   * # Container
   * `create an ioc container.`
   * @export
   * @class Container
   */
  export class Container {
    private main: any
    constructor(...Constructor: Constructor<any>[]) {
      Constructor.forEach(constructor => {
        if (Reflect.hasMetadata(MAIN, constructor)) {
          this.main = constructor
        } else {
          create(constructor)
        }
      })
    }
    /**
     * pull
     * `get the main class instance`
     *
     * @returns
     * @memberof Container
     */
    pull<T = any>() {
      return create(this.main) as T
    }
    /**
     * run
     * `run the Container`
     *
     * @memberof Container
     */
    run() {
      SaFactory.BootStrap(this.main)
    }
  }
}
