import { Injectable, Static } from '../../core/saber-ioc'

@Injectable()
export class E {
  constructor(private name: string = 'E') {
    this.name = 'E'
  }
  getName() {
    return this.name
  }
}
