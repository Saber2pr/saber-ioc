/*
 * @Author: saber2pr
 * @Date: 2019-01-24 07:11:58
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-09 13:17:03
 */
import { Reflect } from '@saber2pr/reflect'
import { CUSTOM, DESIGN, METHODTYPE } from './common/metadatakeys'
import { MetaStore } from './common/metastore'
import { Constructor } from './types/types'
import { ParamCheck } from './common/validators'
/**
 * # SaIOC
 * ## A simple ioc container for classes
 * 1. ensure `tsconfig.json` : `"emitDecoratorMetadata": true`.
 * 2. ensure `tsconfig.json` : `"experimentalDecorators": true`.
 * @exports
 */
export namespace SaIOC {
  /**
   * # Factory
   */
  export class Factory {
    /**
     * create
     *
     * @template T
     * @param {Constructor<T>} constructor
     * @returns {T}
     */
    @ParamCheck
    static create<T>(constructor: Constructor<T>): T {
      const dependenciesMeta: Constructor<T>[] = []

      if (Reflect.hasMetadata(DESIGN.PARAMTYPES, constructor)) {
        const constructors: Constructor[] = Reflect.getMetadata(
          DESIGN.PARAMTYPES,
          constructor
        )
        constructors.forEach((value, index) => {
          if (Reflect.get(value, 'name') !== 'Object') {
            dependenciesMeta[index] = value
          }
        })
      }

      const depKeys = (<string[]>Reflect.getMetadataKeys(constructor)).filter(
        key => key.indexOf(CUSTOM.META) !== -1
      )
      depKeys.forEach(key => {
        if (Reflect.hasMetadata(key, MetaStore)) {
          const index = Reflect.getMetadata<number>(key, constructor)
          const meta: Constructor = Reflect.getMetadata(key, MetaStore)
          dependenciesMeta[index] = meta
        } else {
          throw new Error(
            `cannot found ${key.replace(
              CUSTOM.META,
              'dependence'
            )} in container.`
          )
        }
      })

      const depInstances = dependenciesMeta.map(dependence =>
        this.create(dependence)
      )
      return new constructor(...depInstances)
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
    const main = Factory.create(constructor)
    if (Reflect.has(constructor.prototype, METHODTYPE.BOOT)) {
      ;(<Function>Reflect.get(constructor.prototype, METHODTYPE.BOOT)).apply(
        main
      )
    } else {
      ;(<Function>(
        Reflect.get(
          constructor.prototype,
          mainMethod || Reflect.ownKeys(constructor.prototype)[1]
        )
      )).apply(main)
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
          Reflect.hasMetadata(CUSTOM.MAIN, constructor)
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
      return Factory.create(this.main)
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
      BootStrap(Constructor || this.main)
    }
  }
}
