/*
 * @Author: saber2pr
 * @Date: 2019-04-09 22:26:49
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-19 23:51:53
 */
import { Reflect } from '@saber2pr/reflect'
import { CUSTOM } from './metadatakeys'
import { MetaStore } from './metastore'
import { ParamMeta, PropMeta } from './types'

export function Injectable(id?: PropertyKey): ClassDecorator {
  return target => {
    const token = id || target.name

    if (Reflect.hasMetadata(token, MetaStore)) {
      throw new Error(`id:[${String(token)}] is existed!`)
    } else {
      Reflect.defineMetadata(token, target, MetaStore)
    }
  }
}

export function Inject(id: PropertyKey): ParameterDecorator {
  return (target, _, index) => {
    const depMeta =
      Reflect.getMetadata<ParamMeta>(CUSTOM.META_PARAM, target) || []
    depMeta.push([id, index])

    Reflect.defineMetadata(CUSTOM.META_PARAM, depMeta, target)
  }
}

export function InjectProp(id?: PropertyKey): PropertyDecorator {
  return (target, key) => {
    const token = id || key

    const depMeta =
      Reflect.getMetadata<PropMeta>(CUSTOM.META_PROP, target) || []
    depMeta.push([token, key])

    Reflect.defineMetadata(CUSTOM.META_PROP, depMeta, target)
  }
}

export function Singleton(target: any) {
  Reflect.defineMetadata(CUSTOM.STATIC, undefined, target)
}

export function Static(target: any) {
  Reflect.defineMetadata(CUSTOM.STATIC, undefined, target)
}
