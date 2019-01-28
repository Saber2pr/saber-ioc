import { Injectable, Singleton, SingletonLazy } from '../../core/saber-ioc'
import { IA } from './type'

@Singleton
@Injectable()
export class A implements IA {
  private constructor() {}
  static instance: A = new A()
  private name = 'A'
  getName() {
    return this.name
  }
  setName(v: string) {
    this.name = v
  }
}
