/*
 * @Author: saber2pr
 * @Date: 2019-05-15 22:52:52
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-16 10:10:50
 */
import './service'
import './dispatcher'
import { Inject } from '../../core/decorators'
import { ControllerA, ControllerB } from './controller'
import { Injector } from '../../core/injector'

class Application {
  constructor(
    @Inject('ControllerA') private ControllerA: ControllerA,
    @Inject('ControllerB') private ControllerB: ControllerB
  ) {}
  main() {
    this.ControllerA.register()
    this.ControllerB.register()
    this.ControllerA.callControllerB()
    this.ControllerB.callControllerA()
  }
}

Injector(Application).main()
