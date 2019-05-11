/*
 * @Author: saber2pr
 * @Date: 2019-05-11 22:32:05
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-11 23:14:50
 */
import { ParamCheck } from './validators'
import { Constructor } from './types'
import { Reflect } from '@saber2pr/reflect'
import { DESIGN, CUSTOM } from './metadatakeys'
import { MetaStore } from './metastore'

export class Factory {
  @ParamCheck
  public static create<T>(target: Constructor<T>): T {
    const depConstructors: Constructor<T>[] = []

    if (Reflect.hasMetadata(DESIGN.PARAMTYPES, target)) {
      const constructors: Constructor[] = Reflect.getMetadata(
        DESIGN.PARAMTYPES,
        target
      )

      constructors.forEach((value, index) => {
        if (Reflect.get(value, 'name') !== 'Object')
          depConstructors[index] = value
      })
    }

    const depKeys = (<string[]>Reflect.getMetadataKeys(target)).filter(
      key => key.indexOf(CUSTOM.META) !== -1
    )

    depKeys.forEach(key => {
      if (Reflect.hasMetadata(key, MetaStore)) {
        const index = Reflect.getMetadata<number>(key, target)
        const meta = Reflect.getMetadata<Constructor>(key, MetaStore)

        depConstructors[index] = meta
      } else {
        throw new Error(
          `cannot found ${key.replace(CUSTOM.META, 'dependence')} in container.`
        )
      }
    })

    const depInstances = depConstructors.map(dependence =>
      this.create(dependence)
    )
    return new target(...depInstances)
  }
}
