/*
 * @Author: saber2pr
 * @Date: 2019-04-09 22:23:08
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-11 22:54:18
 */

export const enum DESIGN {
  TYPE = 'design:type',
  PARAMTYPES = 'design:paramtypes',
  RETURNTYPE = 'design:returntype'
}

export const enum CUSTOM {
  META = '@@meta',
  MAINCLASS = '@@main:class',
  MAINMETHOD = '@@main:method',
  STATIC = '@@static',
  VISITED = '@@visited'
}

export const BASETYPES = ['Number', 'String', 'Boolean', 'undefined', 'Array']

export const MetaKey = (id: string) => `${CUSTOM.META}:${id}`
