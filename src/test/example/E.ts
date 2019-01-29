import { Injectable, Static } from '../../core/saber-ioc'

@Static
@Injectable()
export class E {
  static getName() {
    return 'E'
  }
}
