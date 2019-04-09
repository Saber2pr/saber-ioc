/*
 * @Author: saber2pr
 * @Date: 2019-04-09 22:26:49
 * @Last Modified by:   saber2pr
 * @Last Modified time: 2019-04-09 22:26:49
 */
import { MetaKey, CUSTOM } from './metadatakeys'
import { MetaStore } from './metastore'
import { Constructor } from '../types/types'
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
