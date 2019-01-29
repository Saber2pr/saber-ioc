import { Inject, Injectable, Bootstrap } from '../../core/saber-ioc'
import { IB,  ISA, IE } from './type'
import { C } from './C'

@Bootstrap
@Injectable()
export class D {
  constructor(
    @Inject('A') public A: ISA,
    public C: C,
    @Inject('B') public B: IB,
    @Inject('E') public E: IE
  ) {}
  test() {
    console.log(this.B.getName())
    console.log(this.A.getInstance().getName())
    console.log(this.C.getName())
    console.log(this.E.getName())
  }
}
