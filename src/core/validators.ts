/*
 * @Author: saber2pr
 * @Date: 2019-04-09 22:28:03
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-11 23:13:18
 */
import { Reflect } from '@saber2pr/reflect'
import { CUSTOM, BASETYPES } from './metadatakeys'
import { Constructor } from './types'
import { MetaStore } from './metastore'

export function TypeCheck(target: Constructor) {
  if (BASETYPES.includes(target.name)) {
    const visited = Reflect.getMetadata(CUSTOM.VISITED, MetaStore)

    throw new Error(
      `the param of class[${visited}]'s constructor has invalid type: ${
        target.name
      }`
    )
  } else {
    Reflect.defineMetadata(CUSTOM.VISITED, target.name, MetaStore)
  }
}

export function ParamCheck(target: Constructor, key: string) {
  const origin = Reflect.get(target, key)

  Reflect.set(target, key, (...params: Constructor[]) => {
    const param = params[0]
    if (Reflect.hasMetadata(CUSTOM.STATIC, param)) return param

    TypeCheck(param)
    return (<Function>origin).apply(target, params)
  })
  return origin
}
