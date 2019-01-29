import { Injectable, Singleton } from '../../core/saber-ioc'
import { IA } from './type'

@Singleton
@Injectable()
export class A implements IA {
  private constructor() {}
  static instance: A
  static getInstance() {
    this.instance = this.instance || new A()
    return this.instance
  }
  private name = 'A'
  getName() {
    return this.name
  }
  setName(v: string) {
    this.name = v
  }
}
