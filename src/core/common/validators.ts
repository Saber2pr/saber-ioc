/*
 * @Author: saber2pr
 * @Date: 2019-04-09 22:28:03
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-04-09 22:28:34
 */
import { CUSTOM, BASETYPES } from './metadatakeys'
import { Constructor } from '../types/types'
import { MetaStore } from './metastore'
/**
 * # Class
 */
export namespace Class {
  export const isStatic = (target: any) =>
    Reflect.hasMetadata(CUSTOM.STATIC, target)
}
/**
 * TypeCheck
 *
 * @param {Constructor} constructor$
 */
export function TypeCheck(constructor$: Constructor) {
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
export function ParamCheck(constructor: Constructor, methodName: string) {
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
