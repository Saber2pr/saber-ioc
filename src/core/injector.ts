/*
 * @Author: saber2pr
 * @Date: 2019-05-15 22:02:40
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-19 23:53:46
 */
import { Reflect } from '@saber2pr/reflect'
import { Constructor, ParamMeta, PropMeta } from './types'
import { DESIGN, CUSTOM } from './metadatakeys'
import { MetaStore } from './metastore'

export function Injector<T>(Target: Constructor<T>): T | Constructor<T> {
  if (Reflect.hasMetadata(CUSTOM.STATIC, Target)) return Target

  const deps = before(Target)

  const instances = deps.map(Injector)
  const target = new Target(...instances)

  after(target)

  return target
}

function before<T>(Target: Constructor<T>) {
  const deps =
    Reflect.getMetadata<Array<Constructor>>(DESIGN.PARAMTYPES, Target) || []

  const tags = Reflect.getMetadata<ParamMeta>(CUSTOM.META_PARAM, Target) || []
  tags.forEach(([id, index]) => {
    if (Reflect.hasMetadata(id, MetaStore)) {
      deps[index] = Reflect.getMetadata(id, MetaStore)
    } else {
      throw new Error(`injected dep:${String(id)} not found`)
    }
  })

  return deps
}

function after<T>(target: T) {
  const props = Reflect.getMetadata<PropMeta>(CUSTOM.META_PROP, target) || []

  props.forEach(([id, key]) => {
    if (Reflect.hasMetadata(id, MetaStore)) {
      const dep = Reflect.getMetadata<Constructor>(id, MetaStore)
      const instance = Injector(dep)

      Object.defineProperty(target, key, { value: instance })
    } else {
      throw new Error(`injected dep:${String(id)} not found`)
    }
  })
}
