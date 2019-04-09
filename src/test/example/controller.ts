import { Inject, Injectable } from '../../index'
import {
  IServiceA,
  IServiceB,
  ISDispatcher,
  IControllerA,
  IControllerB
} from './type'

@Injectable()
export class ControllerA implements IControllerA {
  constructor(
    @Inject('ServiceA') private ServiceA: IServiceA,
    @Inject('Dispatcher') private Dispatcher: ISDispatcher
  ) {}
  register() {
    this.Dispatcher.getInstance().subscribe('A', this)
  }
  callControllerB() {
    this.Dispatcher.getInstance().emit(
      'A',
      'B',
      `Hello B! I am A. Infor: ${this.ServiceA.getInforA()}`
    )
  }
  resolveMessage(message: string) {
    console.log(message)
  }
}

@Injectable()
export class ControllerB implements IControllerB {
  constructor(
    @Inject('ServiceB') private ServiceB: IServiceB,
    @Inject('Dispatcher') private Dispatcher: ISDispatcher
  ) {}
  register() {
    this.Dispatcher.getInstance().subscribe('B', this)
  }
  callControllerA() {
    this.Dispatcher.getInstance().emit(
      'B',
      'A',
      `Hello A! I am B. Infor: ${this.ServiceB.getInforB()}`
    )
  }
  resolveMessage(message: string) {
    console.log(message)
  }
}
