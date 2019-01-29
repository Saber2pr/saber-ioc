import { Injectable, Static } from '../../core/saber-ioc'

@Injectable()
export class E {
  constructor(private name = 'E') {}
  getName() {
    return this.name
  }
}
