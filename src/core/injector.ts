/*
 * @Author: saber2pr
 * @Date: 2019-05-15 22:02:40
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-16 10:06:05
 */
import { Reflect } from '@saber2pr/reflect'
import { Constructor, DepMeta } from './types'
import { DESIGN, CUSTOM } from './metadatakeys'
import { MetaStore } from './metastore'

export function Injector<T>(Target: Constructor<T>): T | Constructor<T> {
  if (Reflect.hasMetadata(CUSTOM.STATIC, Target)) return Target

  const deps =
    Reflect.getMetadata<Array<Constructor>>(DESIGN.PARAMTYPES, Target) || []

  const tags = Reflect.getMetadata<DepMeta[]>(CUSTOM.META, Target) || []

  tags.forEach(tag => {
    if (Reflect.hasMetadata(tag.id, MetaStore)) {
      deps[tag.index] = Reflect.getMetadata(tag.id, MetaStore)
    } else {
      throw new Error(`injected dep:${String(tag.id)} not found`)
    }
  })

  const instances = deps.map(Injector)

  return new Target(...instances)
}
