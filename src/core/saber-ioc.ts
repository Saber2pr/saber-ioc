/*
 * @Author: AK-12
 * @Date: 2019-01-24 07:11:58
 * @Last Modified by: AK-12
 * @Last Modified time: 2019-01-25 10:36:30
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
  return target =>
    Reflect.defineMetadata(
      DepKey(id),
      Reflect.getMetadata(MetaKey(id), MetaStore),
      target
    )
}
/**
 * # SaFactory
 * ## An simple ioc container for classes
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
    const depKeys = Reflect.getOwnMetadataKeys(constructor).filter(
      key => (<string>key).indexOf(DEP) !== -1
    )
    const dependencies: Array<Function> = depKeys.map(key =>
      Reflect.getMetadata(key, constructor)
    )
    if (dependencies) {
      const depInstances = dependencies.map(deps => {
        if (deps.length) {
          return create(<any>deps)
        } else {
          return new (<any>deps)()
        }
      })
      return new constructor(...depInstances.reverse())
    } else {
      return new constructor()
    }
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
    if (props.some(value => value === 'main')) {
      create(constructor)[mainMethod || 'main']()
    } else {
      create(constructor)[props[0]]()
    }
  }
}
/**
 * ## Bootstrap
 * `main class`
 *
 * @export
 * @template T
 * @param {Constructor<T>} target
 */
export function Bootstrap<T>(target: Constructor<T>) {
  SaFactory.BootStrap(target)
}
