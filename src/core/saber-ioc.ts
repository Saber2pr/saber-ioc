/*
 * @Author: saber2pr
 * @Date: 2019-01-24 07:11:58
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-11 23:13:43
 */
import { Reflect } from '@saber2pr/reflect'
import { CUSTOM } from './metadatakeys'
import { Constructor } from './types'
import { Factory } from './factory'

export namespace SaIOC {
  export function BootStrap<T>(target: Constructor): T
  export function BootStrap<T>(target: Constructor, mainMethod: string): T
  export function BootStrap<T>(
    target: Constructor,
    mainMethodName?: string | number | symbol
  ): T {
    const app = Factory.create(target)

    const methodName = mainMethodName || Reflect.ownKeys(target.prototype)[1]

    const mainMethod: Function =
      target.prototype[CUSTOM.MAINMETHOD] || target.prototype[methodName]

    return mainMethod.apply(app)
  }

  export class Container {
    private main: Constructor

    constructor(...Constructors: any[]) {
      const target =
        Constructors.find(constructor =>
          Reflect.hasMetadata(CUSTOM.MAINCLASS, constructor)
        ) || Constructors[0]

      this.main = target
    }

    pull<T>(): T {
      return Factory.create(this.main)
    }

    run(): void
    run(target: Constructor): void
    run(target: Constructor = this.main): void {
      BootStrap(target)
    }
  }
}
