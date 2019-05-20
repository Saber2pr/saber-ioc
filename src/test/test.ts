import './example/index'
import { Injectable, Inject, InjectProp, Injector } from '..'

@Injectable()
class Test {
  public name = 'test'
}

@Injectable()
class Service {
  @InjectProp()
  private Test: Test

  public getUser() {
    return this.Test.name
  }
}

class Controller {
  // public constructor(@Inject('Service') private Service: Service) {}
  @InjectProp() private Service: Service

  public test() {
    console.log(this.Service.getUser())
  }
}

const app = Injector(Controller)

app.test()
