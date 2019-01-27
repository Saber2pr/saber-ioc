import { Bootstrap, Inject, Injectable } from '../../core/saber-ioc'
import { IA, IB, IC } from './type'

@Bootstrap
@Injectable()
export class D {
  constructor(
    @Inject('A') public A: IA,
    @Inject('B') public B: IB,
    @Inject('C') public C: IC
  ) {}
  test() {
    console.log(this.A.getName())
    console.log(this.B.getName())
    console.log(this.C.getName())
  }
}
