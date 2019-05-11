/*
 * @Author: saber2pr
 * @Date: 2019-04-09 22:26:49
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-11 22:46:35
 */
import { Reflect } from '@saber2pr/reflect'
import { MetaKey, CUSTOM } from './metadatakeys'
import { MetaStore } from './metastore'
import { Constructor } from './types'

export function Injectable(id?: string): ClassDecorator {
  return target => {
    const token = id || target.name

    if (Reflect.hasMetadata(MetaKey(token), MetaStore)) {
      throw new Error(`id:[${token}] is existed!`)
    } else {
      Reflect.defineMetadata(MetaKey(token), target, MetaStore)
    }
  }
}

export function Inject(id: string): ParameterDecorator {
  return (target, _, index) =>
    Reflect.defineMetadata(MetaKey(id), index, target)
}

export function Bootstrap<T>(target: Constructor<T>) {
  Reflect.defineMetadata(CUSTOM.MAINCLASS, undefined, target)
}

export function Singleton(target: any) {
  Reflect.defineMetadata(CUSTOM.STATIC, undefined, target)
}

export function Static(target: any) {
  Reflect.defineMetadata(CUSTOM.STATIC, undefined, target)
}
