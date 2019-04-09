/*
 * @Author: saber2pr
 * @Date: 2019-04-09 22:23:08
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-04-09 22:23:49
 */
/**
 * # DESIGN
 */
export const enum DESIGN {
  TYPE = 'design:type',
  PARAMTYPES = 'design:paramtypes',
  RETURNTYPE = 'design:returntype'
}
/**
 * # CUSTOM
 */
export const enum CUSTOM {
  META = 'saber_meta',
  MAIN = 'saber_main',
  STATIC = 'saber_static',
  VISITED = 'saber_visited'
}
/**
 * # BASETYPE
 */
export const enum BASETYPE {
  NUMBER = 'Number',
  SRTING = 'String',
  BOOLEAN = 'Boolean',
  VOID = 'undefined',
  ARRAY = 'Array'
}
/**
 * # BASETYPE
 */
export const BASETYPES = [
  BASETYPE.NUMBER,
  BASETYPE.SRTING,
  BASETYPE.BOOLEAN,
  BASETYPE.VOID,
  BASETYPE.ARRAY
]
/**
 * # METHODTYPE
 */
export const enum METHODTYPE {
  BOOT = 'main'
}
/**
 * # MetaKey
 * return a META key.
 * @param id
 */
export const MetaKey = (id: string) => `${CUSTOM.META}:${id}`
