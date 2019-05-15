/*
 * @Author: saber2pr 
 * @Date: 2019-05-15 22:52:52 
 * @Last Modified by:   saber2pr 
 * @Last Modified time: 2019-05-15 22:52:52 
 */
import { Inject } from '..'
import { ControllerA, ControllerB } from './example/controller'
import { Injector } from '..'

import './example/service'
import './example/dispatcher'

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
