import { Inject, Injectable, Bootstrap } from '../../core/saber-ioc'
import { IB, IC, ISA, IE } from './type'

@Bootstrap
@Injectable()
export class D {
  constructor(
    @Inject('A') public A: ISA,
    @Inject('B') public B: IB,
    @Inject('C') public C: IC,
    @Inject('E') public E: IE
  ) {}
  test() {
    console.log(this.B.getName())
    console.log(this.A.getInstance().getName())
    console.log(this.C.getName())
    console.log(this.E.getName())
  }
}
