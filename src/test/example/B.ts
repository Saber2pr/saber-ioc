import { Inject, Injectable } from '../../core/saber-ioc'
import { IB, IA } from './type'

@Injectable()
export class B implements IB {
  constructor(@Inject('A') public A: IA) {}
  getName() {
    this.A.setName('test')
    return this.A.getName() + 'B'
  }
}
