/*
 * @Author: saber2pr
 * @Date: 2019-05-11 22:17:58
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-11 23:13:51
 */
export interface Constructor<T = any> {
  new (...args: Array<any>): T
  [key: string]: any
  [key: number]: any
}

export type ParamMeta = Array<[PropertyKey, number]>

export type PropMeta = Array<[PropertyKey, PropertyKey]>
