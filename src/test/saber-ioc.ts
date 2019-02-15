import { SaIOC, Inject, Bootstrap } from '../core/saber-ioc'
import { ControllerA, ControllerB } from './example/controller'
import Dispatcher from './example/dispatcher'
import { ServiceA, ServiceB } from './example/service'

@Bootstrap
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

export function test_saber_ioc() {
  new SaIOC.Container(
    ControllerA,
    ControllerB,
    Dispatcher,
    ServiceA,
    ServiceB,
    Application
  ).run()
}
