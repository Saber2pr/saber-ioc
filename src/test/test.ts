// import './example/index'
import { Injectable, Inject } from '../core/decorators'
import { Injector } from '../core/injector'

@Injectable()
class Service {
  public getUser() {
    return 'saber!'
  }
}

class Controller {
  public constructor(@Inject('Service') private Service: Service) {}

  public test() {
    console.log(this.Service.getUser())
  }
}

const app = Injector(Controller)

app.test()
