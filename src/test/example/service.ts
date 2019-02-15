import { Injectable } from '../../core/saber-ioc'
import { IServiceA, IServiceB } from './type'

@Injectable()
export class ServiceA implements IServiceA {
  getInforA() {
    return 'my name is A, age 222'
  }
}

@Injectable()
export class ServiceB implements IServiceB {
  getInforB() {
    return 'my name is B, age 333'
  }
}
