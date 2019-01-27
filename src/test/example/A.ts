import { Injectable } from '../../core/saber-ioc'
import { IA } from './type'

@Injectable()
export class A implements IA {
  getName() {
    return 'A'
  }
}
