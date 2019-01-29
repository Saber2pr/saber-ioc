import { Inject, Injectable } from '../../core/saber-ioc'
import { IB, IA, ISA } from './type'

@Injectable()
export class B implements IB {
  constructor(@Inject('A') public A: ISA, private name = 233) {}
  getName() {
    this.A.getInstance().setName('test')
    return this.A.getInstance().getName() + this.name
  }
}
