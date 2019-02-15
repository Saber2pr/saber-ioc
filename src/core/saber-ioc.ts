/*
 * @Author: saber2pr
 * @Date: 2019-01-24 07:11:58
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-02-15 12:20:28
 */
import 'reflect-metadata'
/**
 * # MetaStore
 * save metadata.
 */
const MetaStore = {}
/**
 * # DESIGN
 */
const enum DESIGN {
  TYPE = 'design:type',
  PARAMTYPES = 'design:paramtypes',
  RETURNTYPE = 'design:returntype'
}
/**
 * # CUSTOM
 */
const enum CUSTOM {
  META = 'saber_meta',
  MAIN = 'saber_main',
  STATIC = 'saber_static',
  VISITED = 'saber_visited'
}
/**
 * # BASETYPE
 */
const enum BASETYPE {
  NUMBER = 'Number',
  SRTING = 'String',
  BOOLEAN = 'Boolean',
  VOID = 'undefined',
  ARRAY = 'Array'
}
/**
 * # BASETYPE
 */
const BASETYPES = [
  BASETYPE.NUMBER,
  BASETYPE.SRTING,
  BASETYPE.BOOLEAN,
  BASETYPE.VOID,
  BASETYPE.ARRAY
]
/**
 * # METHODTYPE
 */
const enum METHODTYPE {
  BOOT = 'main'
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
const MetaKey = (id: string) => `${CUSTOM.META}:${id}`
/**
 * # Injectable
 *
 * `Decorator`
 *
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
 *
 * `Decorator`
 *
 * set a metadata tag needed to target.
 * @export
 * @param {string} id
 * @returns {ParameterDecorator}
 */
export function Inject(id: string): ParameterDecorator {
  return (target, key, index) =>
    Reflect.defineMetadata(MetaKey(id), index, target)
}
/**
 * ## Bootstrap
 *
 * `Decorator`
 *
 * `tag`:`main class`
 *
 * `provide`:`main()`
 *
 * @export
 * @template T
 * @param {Constructor<T>} target
 */
export function Bootstrap<T>(target: Constructor<T>) {
  Reflect.defineMetadata(CUSTOM.MAIN, undefined, target)
}
/**
 * ## Singleton
 *
 * `Decorator`
 *
 * `tag`:`Singleton`
 *
 * @export
 * @param {*} target
 */
export function Singleton(target: any) {
  Reflect.defineMetadata(CUSTOM.STATIC, undefined, target)
}
/**
 * ## Static
 *
 * `Decorator`
 *
 * `tag`:`Static`
 *
 * @export
 * @param {*} target
 */
export function Static(target: any) {
  Reflect.defineMetadata(CUSTOM.STATIC, undefined, target)
}
/**
 * # Class
 */
namespace Class {
  export const isStatic = (target: any) =>
    Reflect.hasMetadata(CUSTOM.STATIC, target)
}
/**
 * TypeCheck
 *
 * @param {Constructor} constructor$
 */
function TypeCheck(constructor$: Constructor) {
  if (BASETYPES.includes(Reflect.get(constructor$, 'name'))) {
    throw new Error(
      `the param of class[${Reflect.getMetadata(
        CUSTOM.VISITED,
        MetaStore
      )}]'s constructor has invalid type: ${constructor$.name}`
    )
  } else {
    Reflect.defineMetadata(CUSTOM.VISITED, constructor$.name, MetaStore)
  }
}
/**
 * ParamCheck
 *
 * `Decorator`
 *
 * @param {Constructor} constructor
 * @param {string} methodName
 * @returns
 */
function ParamCheck(constructor: Constructor, methodName: string) {
  const origin = Reflect.get(constructor, methodName)
  Reflect.set(constructor, methodName, (...params: Constructor[]) => {
    const constructor$ = params[0]
    if (Class.isStatic(constructor$)) {
      return <any>constructor$
    }
    TypeCheck(constructor$)
    return (<Function>origin).apply(constructor, params)
  })
  return origin
}
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
        ;(<Constructor[]>(
          Reflect.getMetadata(DESIGN.PARAMTYPES, constructor)
        )).forEach((value, index) => {
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
          const index = Reflect.getMetadata(key, constructor)
          const meta = <Constructor>Reflect.getMetadata(key, MetaStore)
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
