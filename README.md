<h1 align="center">saber-ioc</h1>
  <p align="center">
    <a href="https://www.npmjs.com/package/saber-ioc">
      <img src="https://img.shields.io/npm/v/saber-ioc.svg?colorB=blue" />
    </a>
  </p>
<h3 align="center">a simple Injector for ioc --- 快速的依赖注入IOC容器</h3>
<h3 align="center">兼容 Typescript，es6、es5</h3>

```bash
# from npm
npm install @saber2pr/ioc

# from github
git clone https://github.com/Saber2pr/saber-ioc.git

```

> 关于反射的实现 [@saber2pr/reflect](https://github.com/Saber2pr/-saber2pr-reflect)

# Feature

```ts
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

app.test() // 'saber!'
```

# API

1. @Injectable(id?) 注解一个类作为元数据依赖，若没有提供 id 参数，则默认注册 id 为类名

   `注意：`请确保 id 是全局唯一的！

2. @Inject(id) 注解一个依赖到目标类中

   如果依赖类型是 Interface，请务必提供 Inject 注解。

3. @Singleton 注册一个类为单例

4. @Static 注册一个类为静态类

   `你可能已经发现这和@Singleton可能是一样的，你是对的`

5. Injector 执行依赖树 build，自动注入实例

   `注意保证依赖在注入之前已经声明`

---

## start

```bash
npm install
```

```bash
npm start

npm run build

npm test

```

---

## develope and test

> you should write ts in /src

> you should make test in /src/test

---

# Author

saber2pr

---

# License

MIT
