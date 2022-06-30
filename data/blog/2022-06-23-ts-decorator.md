---

slug: ts-decorator

title: Typescript装饰器详解

authors: pincman

tags: [typescript, mariadb,linux]

rf_summary: 在编写Nestjs或Angular这类框架的应用时经常会用到装饰器,写篇文章详细讲解一下,弄明白后就可以对Typescript的类反射灵活应用了

---
 
:::tip

 在看本文前最好先看一下[《阮一峰-es6中的装饰器》](http://es6.ruanyifeng.com/#docs/decorator)

:::


装饰器用于给类,方法,属性以及方法参数等增加一些附属功能而不影响其原有特性。其在Typescript应用中的主要作用类似于Java中的注解,在AOP(面向切面编程)使用场景下非常有用。

> **面向切面编程（AOP）** 是一种编程范式，它允许我们分离[横切关注点](https://zh.wikipedia.org/wiki/横切关注点)，藉此达到增加模块化程度的目标。它可以在不修改代码自身的前提下，给已有代码增加额外的行为（通知）

**装饰器一般用于处理一些与类以及类属性本身无关的逻辑**,例如: 一个类方法的执行耗时统计或者记录日志,可以单独拿出来写成装饰器。

看一下官方的解释更加清晰明了

> 装饰器是一种特殊类型的声明，它能够被附加到类声明，方法， 访问符，属性或参数上。 装饰器使用 `@expression`这种形式，`expression`求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。

如果有使用过spring boot或者php的symfony框架的话,就基本知道装饰器的作用分别类似于以上两者注解和annotation，而node中装饰器用的比较好的框架是nest.js。不过不了解也没关系,接下来我就按我的理解讲解一下装饰器的使用。

不过目前装饰器还不属于标准，还在建议征集的第二阶段，但这并不妨碍我们在ts中的使用。只要在 `tsconfig.json`中开启 `experimentalDecorators`编译器选项就可以愉快地使用啦^^

```json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

## 基本原理

可能有些时候，我们会对传入参数的类型判断、对返回值的排序、过滤，对函数添加节流、防抖或其他的功能性代码，基于多个类的继承，各种各样的与函数逻辑本身无关的、重复性的代码。

比如,我们要在用户登录的时候记录一下登录时间

```typescript

const logger = (now: number) => console.log(`lasted logged in ${now}`);

class User {
  async login() {
    await setTimeout(() => console.log('login success'), 100);
    logger(new Date().valueOf());
  }
}

```

以上代码把记录日志的代码强行写入登录的逻辑处理,这样代码量越高则代码越冗余。我们需要把日志逻辑单独拿出来，使login方法更专注于处理登录的逻辑,接下去我们用**高阶函数**模拟一下装饰器的原理,以便于后面更好的理解装饰器。

```typescript
type decoratorFunc = (
  target: any,
  key: string,
  descriptor: PropertyDescriptor,
) => void;

// 模拟的装饰器工厂函数
const createDecorator = (decorator: decoratorFunc) => {
  return (Model: any, key: string) => {
    // 获取即将使用装饰器的类原型
    const target = Model.prototype;
    // 获取这个原型上某个方法的描述
    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    // 更改描述,生成新的方法
    decorator(target, key, descriptor);
  };
};

const logger: decoratorFunc = (target, key, descriptor) => {
  // 将修改后的函数重新定义到原型链上
  Object.defineProperty(target, key, {
    ...descriptor,
    value: async (...arg) => {
      try {
        return await descriptor.value.apply(this, arg); // 调用之前的函数
      } finally {
        const now = new Date().valueOf();
        console.log(`lasted logged in ${now}`);
      }
    },
  });
};

class User {
  async login() {
    console.log('login success');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

const loggerDecorator = createDecorator(logger);
loggerDecorator(User, 'login');
const user = new User();
user.login();

// 控制台输出
// login success
// 停顿100ms
// lasted logged in 1571771681793

```

了解了以上概念,接下去让我们学习真正的装饰器。

## 装饰器类型

TS中的装饰器有几种类型，如下：

- 参数装饰器
- 方法装饰器
- 访问符装饰器
- 属性装饰器
- 类装饰器

以上每中装饰器分别可以作用于类原型(*prototype*属性)和类本身

### 类装饰器

[TS官方文档](https://www.typescriptlang.org/docs/handbook/decorators.html)中举了一个类装饰器的例子,也可以看一下。类装饰器其实就是把我们本身的类传入装饰器注解中,并对这个类或类的原型进行一些处理，仅此而已。例如：

```typescript
const UserDerorator = <T extends new (...args: any[]) => {}>(
  constructor: T,
) => {
  return class extends constructor {
    newProperty = 'new property';
    hello = 'override';
    sayHello() {
      return this.hello;
    }
  };
};

@HelloDerorator
export class UserService {
  [key: string]: any; //此处用于防止eslint提示sayHello方法不存在
  hello: string;
  constructor() {
    this.hello = 'test';
  }
}

const user = new UserService()
console.log(user.sayHello())

// 控制台打印 override
```

#### 装饰器工厂

上面的方法我们为`UserService`添加了一个`HelloDerorator`装饰器，这个装饰器的属性将覆盖`UserService`的默认属性。为了方便给装饰器添加其它参数，我们把`HelloDerorator`改造成为一个装饰器工厂,如下：

```typescript
const WhoAmIDerorator = (firstname: string, lastname: string) => {
  const name = `${firstname}.${lastname}`;
  return <T extends new (...args: any[]) => {}>(target: T) => {
    return class extends target {
      _name: string = name;
      getMyName() {
        return this._name;
      }
    };
  };
};

@WhoAmI('gkr', 'lichnow')
export class UserService {...}

const user = new UserService()
console.log(user.getMyName())

// 控制台打印 gkr.lichnow
```

#### 其它用法

我们还可以对类原型链`property`上的属性/方法和类本身的静态属性/方法进行赋值或重载操作，还可以重载构造函数，如下：

```typescript
interface UserProfile {
  phone?: number;
  address?: string;
}

const ProfileDerorator = (profile: UserProfile) => {
  return (target: any) => {
    const original = target;
    let userinfo: string = '';
    Object.keys(profile).forEach(key => {
      userinfo = `${userinfo}.${profile[key].toString()}`;
    });
    // 添加一个原型属性
    original.prototype.userinfo = userinfo;
    // 使用函数创建一个新的类(类构造器),返回值为传入类的对象,这样就重载了构造函数
    function constructor(...args: any[]) {
      console.log('contruct has been changed');
      return new original(...args);
    }
    // 赋值原型链
    constructor.prototype = original.prototype;
    // 添加一个静态属性
    constructor.myinfo = `myinfo ${userinfo}`;
    return constructor as typeof original;
  };
};

// 因为静态属性是无法通过[key: string]: any;获取类型提示的,所以这里添加一个接口用于动态各类添加静态属性
interface StaticUser {
  new (): UserService;
  myinfo: string;
}

@ProfileDerorator({ phone: 133, address: 'zhejiang' })
class UserService {...}

console.log(((UserService as unknown) as StaticUser).myinfo);
// 控制台输出 myinfo .133.zhejiang
// 控制台输出 contruct has been changed

const user = new UserService()
console.log(user.userinfo)
// 控制台输出 .133.zhejiang
```

### 属性装饰器

属性装饰器一般不单独使用，主要用于配合类或方法装饰器进行组合装饰

#### 参数

属性装饰器函数有两个参数：

**target**

对于普通属性，target就是当前对象的原型，也就是说，假设 Employee 是对象，那么 target 就是 `Employee.prototype`

对于静态属性，target就是当前对象的类

**propertyKey**

属性的名称

#### 使用示例

```typescript
const userRoles = [];

// 通过属性装饰器把角色赋值给userRoles
const RoleDerorator = (roles: string[]) => {
  return (target: any, propertyName: string) => {
    roles.forEach(role => userRoles.push(role));
  };
};

// 根据userRoles生成Roles对象并赋值给类原型的roles属性
const SetRoleDerorator = <
  T extends new (...args: any[]) => {
    [key: string]: any;
  }
>(
  constructor: T,
) => {
  const roles = [
    { name: 'super-admin', desc: '超级管理员' },
    { name: 'admin', desc: '管理员' },
    { name: 'user', desc: '普通用户' },
  ];
  return class extends constructor {
    constructor(...args) {
      super(...args);
      this.roles = roles.filter(role => userRoles.includes(role.name));
    }
  };
};

@SetRoleDerorator
export class UserService {
  @RoleDerorator(['admin', 'user'])
  roles: string[] = [];
}

// 控制台输出 [ { name: 'admin', desc: '管理员' }, { name: 'user', desc: '普通用户' } ]
```

### 方法装饰器

在一开始我们介绍了装饰器的原理,其实这就是方法装饰器的原始实现。与属性装饰器不同的是,方法装饰器接受三个参数

> 方法装饰器重载的时候需要注意的一点是定义value务必使用function，而不是箭头函数，因为我们在调用原始的旧方法使用会使用到this，如：method.apply(this, args)，这里的this指向需要function来定义，具体原因可参考我的另一篇文章[apply,bind,call使用](https://test.pincman.com)

#### 参数

**target**

对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。

**key**

方法名称

**descriptor: PropertyDescriptor**

方法的属性描述符(最重要的参数)

#### 属性描述符

属性描述包含以下几个属性

- configurable?: boolean; // 能否使用delete、能否修改方法特性或修改访问器属性
- enumerable?: boolean;  是否在遍历对象的时候存在
- value?: any;  用于定义新的方法代替旧方法
- writable?: boolean; 是否可写
- get?(): any; // 访问器
- set?(v: any): void; // 访问器

接下来我们使用方法装饰器修改一开始的[装饰器原理中的登录日志记录器](#基本原理)

```typescript
const loggerDecorator = () => {
  return function logMethod(
    target: Object,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const method = propertyDescriptor.value;

    // 重载方法
    propertyDescriptor.value = function async (...args: any[]) {
      try {
        return await method.apply(this, args); // 调用之前的函数
      } finally {
        const now = new Date().valueOf();
        console.log(`lasted logged in ${now}`);
      }
    };
    return propertyDescriptor;
  };
};

class UserService {
  ...
  @loggerDecorator()
  async login() {
    console.log('login success');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

const user = new UserService();
user.login();
// 控制台输出结果与前面的例子相同
```

### 参数装饰器

一个类中每个方法的参数也可以有自己的装饰器。

> 与属性装饰器类似，参数装饰器一般不单独使用，而是配合类或方法装饰器组合使用

#### 参数

1. **target**: 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. **key**:方法名称
3. **index**: 参数数组中的位置

比如我们需要格式化一个方法的参数,那么可以创建一个转么用于格式化的装饰器

```typescript
// 参数格式化配置
const parseConf: Function[] = [];

const parse = (parseTo: Function) => {
  return (target: any, propertyName: string, index: number) => {
    parseConf[index] = parseTo;
  };
};

// 在函数调用前执行格式化操作
const parseFunc = (
  target: Object,
  propertyName: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor => {
  return {
    ...descriptor,
    value(...args: any[]) {
      // 获取格式化后的参数列表
      const newArgs = parseConf.map((toParse, index) => toParse(args[index]));

      return descriptor.value.apply(this, newArgs);
    },
  };
};

interface UserEntity {
  id: number;
  username: string;
}

class User {
  private users: UserEntity[] = [
    { id: 1, username: 'admin' },
    { id: 2, username: 'lichnow' },
  ];
  
  getUsers() {
    return this.users;
  }

  @parseDecorator
  delete(@parse((arg: any) => Number(arg)) id): UserService {
    this.users = this.users.filter(userObj => userObj.id !== id);
    return this;
  }
}


const user = new User();
user.delete('1');
console.log(user.getUsers());

// 控制台输出: [ { id: 2, username: 'lichnow' } ]
```

### 访问器装饰器

访问器其实只是那些添加了`get`,`set`前缀的方法，用于使用调用属性的方式获取和设置一些属性的方法，类似于PHP中的魔术方法`__get`,`__set`。其装饰器使用方法与普通方法并无差异，只是在获取值的时候是调用描述符的`get`和`set`来替代`value`而已。

例如，我们添加一个*nickname*字段，给设置*nickname*添加一个自定义前缀，并禁止在遍历*user*对象时出现*nickname*的值，添加一个*fullname*字段，在设置*nickname*时添加一个字符串后缀生成。

```typescript
export const HiddenDecorator = () => {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) => {
    descriptor.enumerable = false;
  };
};

export const PrefixDecorator = (prefix: string) => {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) => {
    return {
      ...descriptor,
      set(value: string) {
        descriptor.set.apply(this, [`${prefix}_${value}`]);
      },
    };
  };
};

export class UserService {
  ...
  private _nickname: string;
  private fullname: string;
  @HiddenDecorator()
  @PrefixDecorator('gkr_')
  get nickname() {
    return this._nickname;
  }

  set nickname(value: string) {
    this._nickname = value;
    this.fullname = `${value}_fullname`;
  }
}

const user = new UserService();
user.password = '123456';
user.nickname = 'lichnow';
console.log(user);
console.log(user.nickname);

// 第一个console.log控制台输出,可以看到遍历对象后并没有nickname字段的值
// UserService {
//  users: [ { id: 1, username: 'admin' }, { id: 2, username: 'lichnow' } ],
//  roles: [],
//  hello: 'test',
//  password: '123456',
//  _nickname: 'gkr__lichnow',
//  fullname: 'gkr__lichnow_fullname'
//}
// 第二个console.log控制台输出
// gkr__lichnow
```

## 装饰器写法

通过装饰器重载方法有许多写法，可以根据自己的喜好来，以下举例几种

### 继承法

一般用于类装饰器中添加属性或方法，例如：

```typescript
 return <T extends new (...args: any[]) => {}>(target: T) => {
    return class extends target {
      getMyName() {
        return this._name;
      }
    };
  };
```

### 原型法

一般用于类装饰器上重载构造函数以及添加属性或方法，例如：

```typescript
const ProfileDerorator = (profile: UserProfile) => {
  return (target: any) => {
    const original = target;
    function constructor(...args: any[]) {
      console.log('contruct has been changed');
      return new original(...args);
    }
    // 赋值原型链
    constructor.prototype = original.prototype;
    // 添加一个静态属性
    constructor.myinfo = `myinfo ${userinfo}`;
    return constructor as typeof original;
  };
};

```

### 赋值法

一般用于方法装饰器上修改某个描述符，例如

```typescript
const loggerDecorator = () => {
  return function logMethod(
    target: Object,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const method = propertyDescriptor.value;
    // 重载方法
    propertyDescriptor.value = function async (...args: any[]) {...};
    return propertyDescriptor;
  };
};
```

### 展开法

与赋值法类似，只不过使用ES6+的展开语法，更容易理解和使用，例如

```typescript
const parseFunc = (
  target: Object,
  propertyName: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor => {
  return {
    ...descriptor,
    value(...args: any[]) {
      // 获取格式化后的参数列表
      const newArgs = parseConf.map((toParse, index) => toParse(args[index]));

      return descriptor.value.apply(this, newArgs);
    },
  };
};
```

## 元信息反射 API

元信息反射 API （例如 `Reflect`）能够用来以标准方式组织元信息。而装饰器中的*元信息反射*使用非常简单，外观上仅仅可以看做在类的某个方法上附加一些随时可以获取的信息而已。

使用之前我们必须先安装`reflect-metadata`这个库

```typescript
npm i reflect-metadata --save
```

并且在`tsconfig.json`中启用原信息配置

```json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

### 基本使用

我们看一下TS官方的[示例](https://https://www.typescriptlang.org/docs/handbook/decorators.html#metadata)是如何通过反射API获取属性设计阶段的类型信息的。

**需要注意的是目前预定义的元信息只有三种**

- **类型元信息**:  `design:type`。
- **参数类型元信息**:  `design:paramtypes`。
- **返回类型元信息**:  `design:returntype`。

```typescript
import "reflect-metadata";

class Point {
  x: number;
  y: number;
}

class Line {
  private _p0: Point;
  private _p1: Point;

  @validate
  // 这句可以省略,因为design:type是预订属性
  // @Reflect.metadata('design:type', Point)
  set p0(value: Point) {
    this._p0 = value;
  }
  get p0() {
    return this._p0;
  }

  @validate
  // @Reflect.metadata("design:type", Point)
  set p1(value: Point) {
    this._p1 = value;
  }
  get p1() {
    return this._p1;
  }
}

function validate<T>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>,
) {
  const set = descriptor.set;
  descriptor.set = function(value: T) {
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    if (!(value instanceof type)) {
      throw new TypeError('Invalid type.');
    }
    set.apply(this, [value]);
  };
  return descriptor;
}

const line = new Line();
const p0 = new Point();
p0.x = 1;
p0.y = 2;
line.p1 = p0;
console.log(line);

// 控制台输出: Line { _p1: Point { x: 1, y: 2 } }
```

### 自定义元信息

除了使用类似`design:type`这种预定义的原信息外，我们也可以自定义信息，因为一般我们都是用`reflect-metadata`来自定义原信息的。比如我们可以在**删除用户**的方法上添加一个**角色判断**，只有拥有我们设定角色的用户才能删除用户，比如**管理员角色**，具体可参考以下代码：

```typescript
// 角色守卫
export const RoleGuardDecorator = (roles: string[]) => {
  return function roleGuard(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // 根据传入的参数定义守卫所需的角色
    Reflect.defineMetadata('roles', roles, target, propertyKey);
    const method = descriptor.value;
    descriptor.value = function(...args: any[]) {
      // 获取当前用户的角色
      const currentRoles = target.getRoles();
      // 获取我们定义的操作此方法所需的角色
      const needRoles = Reflect.getMetadata('roles', target, propertyKey);
      // 判断当前用户是否拥有所需的角色,没有则抛出异常
      for (const role of needRoles) {
        if (!currentRoles.includes(role)) {
          throw new Error(`you have not permission to run ${propertyKey}`);
        }
      }
      return method.apply(this, args);
    };
    return descriptor;
  };
};

class UserService {
  ...
  // 设定当前用户的角色
  getRoles() {
    return ['user'];
  }

  @RoleGuardDecorator(['admin'])
  // 在装饰器中使用Reflect.defineMetadata()放定义roles只是为了方便封装
  // 当然,我们也可以在方法上直接定义roles,如下
  // Reflect.metadata('roles',['admin'])
  @parseDecorator
  delete(@parse((arg: any) => Number(arg)) id): UserService {
    this.users = this.getUsers().filter(userObj => userObj.id !== id);
    return this;
  }
}

const user = new UserService();
user.delete(1);
console.log(user.getUsers());

// 控制台将输出异常
// Error: you have not permission to run delete
```

## 组合与顺序

每一个属性,参数或方法都可以使用多组装饰器。每个类型的装饰器的调用顺序也是不同的。

### 组合使用

我们可以对任意一个被装饰者调用多组装饰器，多组装饰器一般书写在多行上(当然你也可以写在一行上，多行书写只不过是个约定俗成的惯例)，比如

```typescript
@RoleGuardDecorator
@parseDecorator
delete(@parse((arg: any) => Number(arg)) id): UserService 
```

当多个装饰器应用于一个声明上，它们求值方式与[高阶函数](http://en.wikipedia.org/wiki/Function_composition)相似。在这个模型下，当复合*RoleGuardDecorator*和*parseDecorator*时，复合的结果(*RoleGuardDecorator* ∘ *parseDecorator*)(*delete*)等同于*RoleGuardDecorator*(*parseDecorator*(*delete*))。

同时，我们可以参考react中的[高阶](https://zh-hans.reactjs.org/docs/higher-order-components.html)，原理相似

它们的调用步骤类似剥洋葱法，即：

1. 由上至下依次对装饰器表达式求值。
2. 求值的结果会被当作函数，由下至上依次调用。

我们使用装饰器工厂来包装一下`@parseDecorator`(`@RoleGuardDecorator`已经在上面的代码中包装为工厂)，并且在调用和求值阶段`console.log`来测试一下

```typescript
export const parseDecorator = () => {
  console.log('开始格式化数据');
  return (
    target: Object,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    return {
      ...descriptor,
      value(...args: any[]) {
        const newArgs = parseConf.map((toParse, index) => toParse(args[index]));
        console.log('格式化完毕');
        return descriptor.value.apply(this, newArgs);
      },
    };
  };
};

export const RoleGuardDecorator = (roles: string[]) => {
  return function roleGuard(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('开始验证角色');
    ...
    descriptor.value = function(...args: any[]) {
      ...
      console.log('验证角色完毕');
      return method.apply(this, args);
    };
    return descriptor;
  };
};

export class UserService {
  ...
  @RoleGuardDecorator(['admin'])
  // 把parseDecorator改成parseDecorator()
  @parseDecorator()
  getRoles() {
    // 提供验证角色为admin
    return ['admin'];
  }
}

const user = new UserService();
user.delete(1);
console.log(user.getUsers());

// 控制台输出
// 开始格式化数据
// 开始验证角色
// 验证角色完毕
// 格式化完毕
// [ { id: 2, username: 'lichnow' } ]
```

### 调用顺序

每种类型的装饰器的调用顺序是不同的，具体顺序如下：

1. *参数装饰器*，然后依次是*方法装饰器*，*访问符装饰器*，或*属性装饰器*应用到每个实例成员(即类原型的成员)。
2. *参数装饰器*，然后依次是*方法装饰器*，*访问符装饰器*，或*属性装饰器*应用到每个静态成员。
3. *参数装饰器*应用到构造函数(即类原型)。
4. *类装饰器*应用到类。

例如：我们使用元信息结合方法和参数装饰器来验证参数的*required*，其调用顺序为*参数装饰器*->*方法装饰器*

```typescript
const requiredMetadataKey = Symbol('required');

export const RequiredDecorator = (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number,
) => {
  const existingRequiredParameters: number[] =
    Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(
    requiredMetadataKey,
    existingRequiredParameters,
    target,
    propertyKey,
  );
};

export const ValidateDecorator = (
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<Function>,
) => {
  const method = descriptor.value;
  descriptor.value = function() {
    const requiredParameters: number[] = Reflect.getOwnMetadata(
      requiredMetadataKey,
      target,
      propertyName,
    );
    if (requiredParameters) {
      for (const parameterIndex of requiredParameters) {
        if (
          parameterIndex >= arguments.length ||
          arguments[parameterIndex] === undefined
        ) {
          throw new Error('Missing required argument.');
        }
      }
    }

    return method.apply(this, arguments);
  };
};

 @ValidateDecorator
  createUser(@RequiredDecorator username?: string, id?: number) {
    const ids: number[] = this.users.map(userEntity => userEntity.id);
    const newUser: UserEntity = {
      // 如果不提供ID参数,则新用户的ID为所有用户的最大ID + 1
      id: id || Math.max(...ids) + 1,
      // 如果不提供username参数,则生成随机字符串作为用户名
      username:
        username ||
        Math.random()
          .toString(36)
          .substring(2, 15),
    };
    this.users.push(newUser);
    return newUser;
  }


const user = new UserService();
user.createUser();
console.log(user.getUsers());

// 控制台抛出异常: Error: Missing required argument.

// 尝试去除required装饰器
@ValidateDecorator
  createUser(@RequiredDecorator username?: string, id?: number) {...}
// 控制台输出
// [
//  { id: 1, username: 'admin' },
//  { id: 2, username: 'lichnow' },
//  { id: 3, username: 'q5cb3pgfdhq' }
// ]
```
