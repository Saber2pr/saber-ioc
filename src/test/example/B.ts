import { Inject, Injectable } from '../../core/saber-ioc'
import { IB, IA } from './type'

@Injectable()
export class B implements IB {
  constructor(@Inject('A') public A: IA) {}
  getName() {
    return this.A.getName() + 'B'
  }
}
