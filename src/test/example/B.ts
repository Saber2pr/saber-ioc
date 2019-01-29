import { Inject, Injectable } from '../../core/saber-ioc'
import { IB, IA, ISA } from './type'

@Injectable()
export class B implements IB {
  constructor(@Inject('A') public A: ISA) {}
  getName() {
    this.A.getInstance().setName('test')
    return this.A.getInstance().getName() + 'B'
  }
}
