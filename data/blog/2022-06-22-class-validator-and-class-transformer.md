---

slug: class-validator-and-class-transformer-cn

title: class-validator和class-transformer的中文文档

authors: pincman

tags: [class-validator, class-transformer,typescript,nestjs]

rf_summary: 一直在使用Nestjs，其中两个类库ClassValidator和ClassTransformer经常用到,用到规则和API，老去Github查文档太麻烦。<br />直接翻译了一下放博客里方便后续查看，因为两个库是一个作者的，就直接放在一起了，有需要的同学可以随时查阅

---
:::caution

随着时间的推移，可能部分内容无法与官方最新版本同步，请自行对比查看，我有空会更新

:::

用于Typescript或ES6+的类验证，基于[validator.js](https://github.com/chriso/validator.js)

[手动验证方法列表](https://github.com/typestack/class-validator#manual-validation)和[验证装饰器列表](https://github.com/typestack/class-validator#validation-decorators)

## class-validator中文文档

### 安装

```shell
npm install class-validator --save
```

#### 基本使用

创建一个`Post`作为演示,在每个属性上添加不同的验证[装饰器](https://test.pincman.com/notes/decorator.html)尝试

```javascript
import {validate, validateOrReject, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

export class Post {

    @Length(10, 20)
    title: string;

    @Contains("hello")
    text: string;

    @IsInt()
    @Min(0)
    @Max(10)
    rating: number;

    @IsEmail()
    email: string;

    @IsFQDN()
    site: string;

    @IsDate()
    createDate: Date;

}

let post = new Post();
post.title = "Hello"; // should not pass
post.text = "this is a great post about hell world"; // should not pass
post.rating = 11; // should not pass
post.email = "google.com"; // should not pass
post.site = "googlecom"; // should not pass

// 如果验证失败不会停止运行程序
validate(post).then(errors => { 
    if (errors.length > 0) {
        console.log("validation failed. errors: ", errors);
    } else {
        console.log("validation succeed");
    }
});

// 验证失败就停止运行程序
validateOrReject(post).catch(errors => {
    console.log("Promise rejected (validation failed). Errors: ", errors);
});
// 或者
async function validateOrRejectExample(input) {
    try {
        await validateOrReject(input);
    } catch (errors) {
        console.log("Caught promise rejection (validation failed). Errors: ", errors)
    }
}
```

#### 选项

``validate``函数的第二个参数是一个选项对象，尽量设置`forbidNonWhitelisted`为`true`以避免unkown对象的输入验证

```javascript
export interface ValidatorOptions {

    skipMissingProperties?: boolean;
    whitelist?: boolean;
    forbidNonWhitelisted?: boolean;
    groups?: string[];
    dismissDefaultMessages?: boolean;
    validationError?: {
        target?: boolean;
        value?: boolean;
    };

    forbidUnknownValues?: boolean;
}
```

#### 验证错误

验证失败返回的错误数组是`ValidationError`类的对象的数组，格式如下

```javascript
{
    target: Object; // Object that was validated.
    property: string; // Object's property that haven't pass validation.
    value: any; // Value that haven't pass a validation.
    constraints?: { // Constraints that failed validation with error messages.
        [type: string]: string;
    };
    children?: ValidationError[]; // Contains all nested validation errors of the property
}
```

返回的格式如下

```javascript
[{
    target: /* post object */,
    property: "title",
    value: "Hello",
    constraints: {
        length: "$property must be longer than or equal to 10 characters"
    }
}, {
    target: /* post object */,
    property: "text",
    value: "this is a great post about hell world",
    constraints: {
        contains: "text must contain a hello string"
    }
},
// and other errors
]
```

在http响应中我们一般不想在错误中暴露`target`，那么就可以如下方式禁用它

```javascript
validator.validate(post, { validationError: { target: false } });
```

#### 验证消息

我们可以自定义在`ValidationError`对象中返回的错误消息

```javascript
import {MinLength, MaxLength} from "class-validator";

export class Post {

    @MinLength(10, {
        message: "Title is too short"
    })
    @MaxLength(50, {
        message: "Title is too long"
    })
    title: string;
}
```

消息可以接受几个参数作为变量，用字符串混合的方式放入，比如`"$constraint1 characters"`

```javascript
import {MinLength, MaxLength} from "class-validator";

export class Post {

    @MinLength(10, { // here, $constraint1 will be replaced with "10", and $value with actual supplied value
        message: "Title is too short. Minimal length is $constraint1 characters, but actual is $value"
    })
    @MaxLength(50, { // here, $constraint1 will be replaced with "50", and $value with actual supplied value
        message: "Title is too long. Maximal length is $constraint1 characters, but actual is $value"
    })
    title: string;
}
```

能接受的变量如下

- `value` - 被验证的值
- `constraints` - 由指定验证类型定义的约束数组
- `targetName` - 验证对象的类的名称
- `object` - 被验证的对象
- `property` - 被验证的属性名

当然`message`还可以接受一个函数的返回值，这个函数的参数为`ValidationArguments`类的对象，而`ValidationArguments`类的属性就是上面的变量列表

```javascript
import {MinLength, MaxLength, ValidationArguments} from "class-validator";

export class Post {

    @MinLength(10, {
        message: (args: ValidationArguments) => {
            if (args.value.length === 1) {
                return "Too short, minimum length is 1 character";
            } else {
                return "Too short, minimum length is " + args.constraints[0] + " characters";
            }
        }
    })
    title: string;
}
```

### 特殊类型

`class-validator`对一些经常使用的特殊类型有专门的处理方法

#### 集合类型

验证数组,`Sets`,`Map`等集合类型需要开启`each`选项

#### 验证数组

```javascript
import {MinLength, MaxLength} from "class-validator";

export class Post {

    @MaxLength(20, {
        each: true
    })
    tags: string[];
}
```

#### 验证Sets

```javascript
import {MinLength, MaxLength} from "class-validator";

export class Post {

    @MaxLength(20, {
        each: true
    })
    tags: Set<string>;
}
```

#### 验证Map

```javascript
import {MinLength, MaxLength} from "class-validator";

export class Post {

    @MaxLength(20, {
        each: true
    })
    tags: Map<string, string>;
}
```

#### 嵌套对象

一个验证的类中的某些属性可能是类一个的对象，比如`Post`类的`user`属性为`User`类，则可以使用`@ValidateNested()`方式来同时验证`Post`和嵌入的`User`类

```javascript
import {ValidateNested} from "class-validator";

export class Post {

    @ValidateNested()
    user: User;

}
```

#### Promise对象

如果待验证的属性是一个`Promise`对象，比如通过`await`关键字返回的值，则可以使用`@ValidatePromise()`

```javascript
import {ValidatePromise, Min} from "class-validator";

export class Post {

    @Min(0)
    @ValidatePromise()
    userId: Promise<number>;

}
```

`@ValidatePromise()`也可以和`@ValidateNested()`一起使用

```javascript
import {ValidateNested, ValidatePromise} from "class-validator";

export class Post {

    @ValidateNested()
    @ValidatePromise()
    user: Promise<User>;

}
```

### 高级主题

#### 子类验证

如果定义一个从另一个继承的子类时，子类将自动继承父级的装饰器。如果在后代类中重新定义了属性，则装饰器将从该类和基类中继承

```javascript
import {validate} from "class-validator";

class BaseContent {

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

class User extends BaseContent {

    @MinLength(10)
    @MaxLength(20)
    name: string;

    @Contains("hello")
    welcome: string;

    @MinLength(20)
    password: string; /
}

let user = new User();

user.email = "invalid email";  // inherited property
user.password = "too short" // password wil be validated not only against IsString, but against MinLength as well
user.name = "not valid";
user.welcome = "helo";

validate(user).then(errors => {
    // ...
});  // it will return errors for email, title and text properties
```

#### 条件验证

当某个属性需要满足一定条件验证时可以使用(`@ValidateIf`)装饰器

```javascript
import {ValidateIf, IsNotEmpty} from "class-validator";

export class Post {
    otherProperty:string;

    @ValidateIf(o => o.otherProperty === "value")
    @IsNotEmpty()
    example:string;
}
```

#### 白名单

一个被验证的类的对象可以定义在类中不存在的属性，在验证时不会产生错误。为了使只有添加了**验证装饰器**的属性才能被定义，你需要把`whitelist`设置为`true`，那么如果对象中定义一个类中不存在的属性就无法通过验证了。

```javascript
import {validate} from "class-validator";
// ...
validate(post, { whitelist: true });
```

开启白名单之后所有没有加上**验证装饰器**的属性被定义后都将无法通过验证，如果你想一些属性可以被定义但是又不想被验证，如果[条件验证](#条件验证)中的`otherProperty`属性，那么你需要在该属性上面添加一个`@Allow`装饰器

```javascript
/**
 * title可以被定义
 * nonWhitelistedProperty不能被定义，否则验证失败
 */
import {validate, Allow, Min} from "class-validator";

export class Post {

    @Allow()
    title: string;

    @Min(0)
    views: number;

    nonWhitelistedProperty: number;
}

let post = new Post();
post.title = 'Hello world!';
post.views = 420;

post.nonWhitelistedProperty = 69;
// 额外属性不能被添加，否则验证失败
(post as any).anotherNonWhitelistedProperty = "something";

validate(post).then(errors => {
  // post.nonWhitelistedProperty is not defined
  // (post as any).anotherNonWhitelistedProperty is not defined
  ...
});
```

如果你想要所有没有添加**验证装饰器**的属性都无法定义，则可以设置`forbidNonWhitelisted`为`true`

> 这个一般不要设置，否则属性添加@Allow会都没用了

```javascript
import {validate} from "class-validator";
// ...
validate(post, { whitelist: true, forbidNonWhitelisted: true });
```

#### 添加上下文

你可以在验证装饰其中添加一个自定义的上下文对象，此对象在验证失败时被`ValidationError`的实例获取

```javascript
import { validate } from 'class-validator';

class MyClass {
	@MinLength(32, {
		message: "EIC code must be at least 32 characters",
		context: {
			errorCode: 1003,
			developerNote: "The validated string must contain 32 or more characters."
		}
	})
	eicCode: string;
}

const model = new MyClass();

validate(model).then(errors => {
    //errors[0].contexts['minLength'].errorCode === 1003
});
```

#### 跳过缺失属性

有时候你需要跳过一些对象中没有设置的属性，比如更新数据模型时，与创建模型不同的是你只会更新部分值，那么这时候你就需要设置`skipMissingProperties`为`true`，当然可能一部分属性是你不想被跳过验证的，那么需要在这些属性上加上`@IsDefined()`装饰器，加了`@IsDefined()`装饰器的属性会忽略`skipMissingProperties`而必定被验证

```javascript
import {validate} from "class-validator";
// ...
validate(post, { skipMissingProperties: true });
```

#### 验证组

```javascript
import {validate, Min, Length} from "class-validator";

export class User {

    @Min(12, {
        groups: ["registration"]
    })
    age: number;

    @Length(2, 20, {
        groups: ["registration", "admin"]
    })
    name: string;
}

let user = new User();
user.age = 10;
user.name = "Alex";

validate(user, {
    groups: ["registration"]
}); // 无法通过验证

validate(user, {
    groups: ["admin"]
}); // 可以通过验证

validate(user, {
    groups: ["registration", "admin"]
}); // 无法通过验证

validate(user, {
    groups: undefined // 默认模式
}); // 无法通过验证，因为没有指定group则所有属性都将被验证

validate(user, {
    groups: []
}); // 无法通过验证 (与'groups: undefined'相同)
```

在验证中还有一个`always: true`选项，如果添加了此选项，无论验证时设定的是哪种模式的`groups`，都将被验证

#### 使用服务容器

你可以使用服务容器来加载验证器通过依赖注入的方式使用。以下如何将其与[typedi](https://github.com/pleerock/typedi)集成的示例：

```javascript
import {Container} from "typedi";
import {useContainer, Validator} from "class-validator";

// do this somewhere in the global application level:
useContainer(Container);
let validator = Container.get(Validator);

// now everywhere you can inject Validator class which will go from the container
// also you can inject classes using constructor injection into your custom ValidatorConstraint-s
```

#### 非装饰器验证

如果你的运行环境不支持装饰器请看[这里](https://github.com/typestack/class-validator#defining-validation-schema-without-decorators)

#### 验证普通对象

> Nest.js中使用的验证管道就是class-validator+class-transformer结合的方式

由于装饰器的性质，必须使用`new class()`语法实例化待验证的对象。如果你使用了class-validator装饰器定义了类，并且想要验证普通的JS对象（文本对象或JSON.parse返回），则需要将其转换为类实例（例如，使用[class-transformer]([class-transformer](https://github.com/pleerock/class-transformer))）或仅使用[class-transformer-validator](https://github.com/19majkel94/class-transformer-validator)扩展可以为您完成此任务。

### 自定义验证

#### 自定义规则类

你可以创建一个自定义的验证规则的类，并在规则类上添加`@ValidatorConstraint`装饰器。 还可以设置验证约束名称(`name`选项)-该名称将在`ValidationError`中用作“error type”。 如果您不提供约束名称，它将自动生成。

规则类必须实现`ValidatorConstraintInterface`接口及`validate`方法，该接口定义了验证逻辑。 如果验证成功，则方法返回`true`，否则返回`false`。 自定义验证器可以是异步的，如果您想在执行一些异步操作后执行验证，只需在`validate`方法中返回带有布尔值的`promise`。

我们还可以定义了可选方法`defaultMessage`，它在属性上的装饰器未设置错误消息的情况下定义了默认错误消息。

首选我们创建一个`CustomTextLength`演示用的验证规则类

```javascript
import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";

@ValidatorConstraint({ name: "customText", async: false })
export class CustomTextLength implements ValidatorConstraintInterface {

    validate(text: string, args: ValidationArguments) {
        return text.length > 1 && text.length < 10; // 对于异步验证，您必须在此处返回Promise<boolean>
    }

    defaultMessage(args: ValidationArguments) { // 如果验证失败，您可以在此处提供默认错误消息
        return "Text ($value) is too short or too long!";
    }

}
```

定义好规则后我们就可以在类中使用了

```javascript
import {Validate} from "class-validator";
import {CustomTextLength} from "./CustomTextLength";

class Post {

    @Validate(CustomTextLength, {
        message: "Title is too short or long!"
    })
    title: string;

}


validate(post).then(errors => {
    // ...
});
```

你也可以将自定义的约束传入规则类，并通过约束来设定验证的条件

```javascript
import {Validate} from "class-validator";
import {CustomTextLength} from "./CustomTextLength";

import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
class CustomTextLength implements ValidatorConstraintInterface {

    validate(text: string, validationArguments: ValidationArguments) {
        return text.length > validationArguments.constraints[0] && text.length < validationArguments.constraints[1];
    }

}

class Post {

    @Validate(CustomTextLength, [3, 20], {
        message: "Wrong post title"
    })
    title: string;

}
```

#### 自定义装饰器

创建自定义装饰器的方法类似创建自定义规则类，只是使用装饰器而已

> 装饰器的详细使用请看我[这篇文章](https://test.pincman.com/notes/decorator.html)

```javascript
import {registerDecorator, ValidationOptions, ValidationArguments} from "class-validator";

function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isLongerThan",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return  typeof value === "string" &&
                           typeof relatedValue === "string" &&
                           value.length > relatedValue.length; // you can return a Promise<boolean> here as well, if you want to make async validation
                }
            }
        });
   };
}

export class Post {

    title: string;

    @IsLongerThan("title", {
       /* you can also use additional validation options, like "groups" in your custom validation decorators. "each" is not supported */
       message: "Text must be longer than the title"
    })
    text: string;

}
```

在自定义装饰器上仍然可以使用`ValidationConstraint`装饰器。我们在创建一个`IsUserAlreadyExist`验证装饰器演示

```javascript
import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";

@ValidatorConstraint({ async: true })
class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {

    validate(userName: any, args: ValidationArguments) {
        return UserRepository.findOneByName(userName).then(user => {
            if (user) return false;
            return true;
        });
    }

}

function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserAlreadyExistConstraint
        });
   };
}

class User {

    @IsUserAlreadyExist({
       message: "User $value already exists. Choose another name."
    })
    name: string;

}
```

#### 同步验证

如果只是想简单的进行同步验证，可以使用`validateSync`代替`validate`。不过需要注意的是`validateSync`会忽略所有的异步验证。

## class-transfomer中文文档

类转换器的作用是将普通的javascript对象转换成类对象。我们通过api端点或者json文件访问所得的是普通的json文本，一般我们通过`JSON.parse`把其转换成普通的javascript对象，但是有时候我们想让它变成一个类的对象而不是普通的javascript对象。比如用`class-validator`来验证从后端api获取的json字符串时，我们就需要自动把json转为待验证类的对象而不是一个js对象。

例如我们现在可以读取远程api的一个`users.json`的内容如下

```json
[{
  "id": 1,
  "firstName": "Johny",
  "lastName": "Cage",
  "age": 27
},
{
  "id": 2,
  "firstName": "Ismoil",
  "lastName": "Somoni",
  "age": 50
},
{
  "id": 3,
  "firstName": "Luke",
  "lastName": "Dacascos",
  "age": 12
}]
```

我们有一个`User`类

```javascript
export class User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;

    getName() {
        return this.firstName + " " + this.lastName;
    }

    isAdult() {
        return this.age > 36 && this.age < 60;
    }
}
```

然后你想通过`user.json`来获取`User`的对象数组

```javascript
fetch("users.json").then((users: User[]) => {
    // you can use users here, and type hinting also will be available to you,
    //  but users are not actually instances of User class
    // this means that you can't use methods of User class
});
```

现在你可以获取`users[0].firstname`但是由于你获取的是普通的js对象而非`User`类的对象，所以你无法调用`users[0].getName()`方法，而**class-transformer**就是为了把普通的js对象按你的需求转换成类对象而生的。

你只要像下面这样就可以创建真正的`User[]`对象数组了

```javascript
fetch("users.json").then((users: Object[]) => {
    const realUsers = plainToClass(User, users);
    // now each user in realUsers is instance of User class
});
```

### 安装

1. 安装class-transformer:
   `npm install class-transformer --save`

2. 安装`reflect-metadata`

   > reflect-metadata是必须的，具体使用请看[我这边文章]([https://test.pincman.com/notes/decorator.html#%E5%85%83%E4%BF%A1%E6%81%AF%E5%8F%8D%E5%B0%84API](https://test.pincman.com/notes/decorator.html#元信息反射API))

         安装后在`app.ts`这种顶层文件你需要`import "reflect-metadata";`

### 基础方法

#### plainToClass

普通对象转换为类对象

```javascript
import {plainToClass} from "class-transformer";

let users = plainToClass(User, userJson); // to convert user plain object a single user. also supports arrays
```

#### plainToClassFromExist

普通对象合并已经创建的类实例

```javascript
const defaultUser = new User();
defaultUser.role = 'user';

let mixedUser = plainToClassFromExist(defaultUser, user); // mixed user should have the value role = user when no value is set otherwise.
```

#### classToPlain

类实例转换为普通对象

> 转换后可以使用`JSON.stringify`再转成普通的json文本

```javascript
import {classToPlain} from "class-transformer";
let photo = classToPlain(photo);
```

#### classToClass

克隆类实例

```javascript
import {classToClass} from "class-transformer";
let photo = classToClass(photo);
```

可以使用`ignoreDecorators`选项去除所有原实例中的装饰器

#### serialize

直接把类实例转换为json文本,是不是数组都可以转换

```javascript
import {serialize} from "class-transformer";
let photo = serialize(photo);
```

#### deserialize 和 deserializeArray

直接把json文本转换为类对象

```javascript
import {deserialize} from "class-transformer";
let photo = deserialize(Photo, photo);
```

如果json文本是个对象数组请使用`deserializeArray`方法

```javascript
import {deserializeArray} from "class-transformer";
let photos = deserializeArray(Photo, photos);
```

#### 强制类型安全

`plainToClass`会把所有的被转换对象的属性全部类实例的属性，即时类中并不存在某些属性

```javascript
import {plainToClass} from "class-transformer";

class User {
  id: number
  firstName: string
  lastName: string
}

const fromPlainUser = {
  unkownProp: 'hello there',
  firstName: 'Umed',
  lastName: 'Khudoiberdiev',
}

console.log(plainToClass(User, fromPlainUser))

// User {
//   unkownProp: 'hello there',
//   firstName: 'Umed',
//   lastName: 'Khudoiberdiev',
// }
```

你可以使用`excludeExtraneousValues`选项结合`Expose`装饰器来指定需要公开的属性

```javascript
import {Expose, plainToClass} from "class-transformer";

class User {
    @Expose() id: number;
    @Expose() firstName: string;
    @Expose() lastName: string;
}

const fromPlainUser = {
  unkownProp: 'hello there',
  firstName: 'Umed',
  lastName: 'Khudoiberdiev',
}

console.log(plainToClass(User, fromPlainUser, { excludeExtraneousValues: true }))

// User {
//   id: undefined,
//   firstName: 'Umed',
//   lastName: 'Khudoiberdiev'
// }
```

### 子类型转换

#### 嵌套对象

由于现在Typescript对反射还没有非常好的支持，所以你需要使用`@Type`装饰器来隐式地指定属性所属的类

```javascript
import {Type, plainToClass} from "class-transformer";

export class Album {

    id: number;

    name: string;

    @Type(() => Photo)
    photos: Photo[];
}

export class Photo {
    id: number;
    filename: string;
}

let album = plainToClass(Album, albumJson);
// now album is Album object with Photo objects inside
```

#### 多类型选项

一个嵌套的子类型也可以匹配多个类型，这可以通过判断器实现。判断器需要指定一个` property`，而被转换js对象中的嵌套对象的也必须拥有与`property`相同的一个字段，并把值设置为需要转换的子类型的名称。判断器还需要指定所有的子类型值以及其名称，具体示例如下

```javascript
import {Type, plainToClass} from "class-transformer";

const albumJson = {
    "id": 1,
    "name": "foo",
    "topPhoto": {
        "id": 9,
        "filename": "cool_wale.jpg",
        "depth": 1245,
        "__type": "underwater"
    }
}

export abstract class Photo {
    id: number;
    filename: string;
}

export class Landscape extends Photo {
    panorama: boolean;
}

export class Portrait extends Photo {
    person: Person;
}

export class UnderWater extends Photo {
    depth: number;
}

export class Album {

    id: number;
    name: string;

    @Type(() => Photo, {
        discriminator: {
            property: "__type",
            subTypes: [
                { value: Landscape, name: "landscape" },
                { value: Portrait, name: "portrait" },
                { value: UnderWater, name: "underwater" }
            ]
        }
    })
    topPhoto: Landscape | Portrait | UnderWater;

}

let album = plainToClass(Album, albumJson);
// now album is Album object with a UnderWater object without `__type` property.
```

此外可以设置`keepDiscriminatorProperty: true`，这样可以把判断器的属性也包含在转换后的对象中

### 排除与公开

#### 公开方法的返回值

添加`@Expose`装饰器即可公开getter和方法的返回值

```javascript
import {Expose} from "class-transformer";

export class User {

    id: number;
    firstName: string;
    lastName: string;
    password: string;

    @Expose()
    get name() {
        return this.firstName + " " + this.lastName;
    }

    @Expose()
    getFullName() {
        return this.firstName + " " + this.lastName;
    }
}
```

#### 公开属性为不同名称

如果要使用其他名称公开某些属性，可以通过为`@Expose`装饰器指定`name`选项来实现：

```javascript
import {Expose} from "class-transformer";

export class User {

    @Expose({ name: "uid" })
    id: number;

    firstName: string;

    lastName: string;

    @Expose({ name: "secretKey" })
    password: string;

    @Expose({ name: "fullName" })
    getFullName() {
        return this.firstName + " " + this.lastName;
    }
}
```

#### 跳过指定属性

有时您想在转换过程中跳过一些属性。这可以使用`@Exclude`装饰器完成：

```javascript
import {Exclude} from "class-transformer";

export class User {

    id: number;

    email: string;

    @Exclude()
    password: string;
}
```

现在，当您转换用户时，`password`属性将被跳过，并且不包含在转换结果中。

#### 根据操作决定跳过

我们可以通过`toClassOnly`或者`toPlainOnly`来控制一个属性在哪些操作中需要排除

```javascript
import {Exclude} from "class-transformer";

export class User {

    id: number;

    email: string;

    @Exclude({ toPlainOnly: true })
    password: string;
}
```

现在`password`属性将会在`classToPlain`操作中排除，相反的可以使用`toClassOnly`

#### 跳过类的所有属性

你可以通过在类上添加`@Exclude`装饰器并且在需要公开的属性上添加`@Expose`装饰器来只公开指定的属性

```javascript
import {Exclude, Expose} from "class-transformer";

@Exclude()
export class User {

    @Expose()
    id: number;

    @Expose()
    email: string;

    password: string;
}
```

另外，您可以在转换期间设置排除策略：

```javascript
import {classToPlain} from "class-transformer";
let photo = classToPlain(photo, { strategy: "excludeAll" });
```

这时你不需要在添加`@Exclude`装饰器了

#### 跳过私有属性或某些前缀属性

我们可以排除公开具有指定前缀的属性以及私有属性

```javascript
import {Expose} from "class-transformer";

export class User {

    id: number;
    private _firstName: string;
    private _lastName: string;
    _password: string;

    setName(firstName: string, lastName: string) {
        this._firstName = firstName;
        this._lastName = lastName;
    }

    @Expose()
    get name() {
        return this.firstName + " " + this.lastName;
    }

}

const user = new User();
user.id = 1;
user.setName("Johny", "Cage");
user._password = 123;

const plainUser = classToPlain(user, { excludePrefixes: ["_"] });
// here plainUser will be equal to
// { id: 1, name: "Johny Cage" }
```

#### 使用组来控制排除的属性

```javascript
import {Exclude, Expose} from "class-transformer";

@Exclude()
export class User {

    id: number;

    name: string;

    @Expose({ groups: ["user", "admin"] }) // this means that this data will be exposed only to users and admins
    email: string;

    @Expose({ groups: ["user"] }) // this means that this data will be exposed only to users
    password: string;
}

let user1 = classToPlain(user, { groups: ["user"] }); // will contain id, name, email and password
let user2 = classToPlain(user, { groups: ["admin"] }); // will contain id, name and email
```

#### 使用版本范围来控制公开和排除的属性

如果要构建具有不同版本的API，则class-transformer具有非常有用的工具。您可以控制应在哪个版本中公开或排除模型的哪些属性。示例

```javascript
import {Exclude, Expose} from "class-transformer";

@Exclude()
export class User {

    id: number;

    name: string;

    @Expose({ since: 0.7, until: 1 }) // this means that this property will be exposed for version starting from 0.7 until 1
    email: string;

    @Expose({ since: 2.1 }) // this means that this property will be exposed for version starting from 2.1
    password: string;
}

let user1 = classToPlain(user, { version: 0.5 }); // will contain id and name
let user2 = classToPlain(user, { version: 0.7 }); // will contain id, name and email
let user3 = classToPlain(user, { version: 1 }); // will contain id and name
let user4 = classToPlain(user, { version: 2 }); // will contain id and name
let user5 = classToPlain(user, { version: 2.1 }); // will contain id, name nad password
```

### 特殊处理

#### 将日期字符串转换为Date对象

有时，您的JavaScript对象中有一个以字符串格式接收的Date。您想从中创建一个真正的javascript Date对象。您只需将Date对象传递给`@Type`装饰器即可完成此操作：

> 当从类对象反向转换为普通对象时registrationDate将会被转回为字符串

```javascript
import {Type} from "class-transformer";

export class User {

    id: number;

    email: string;

    password: string;

    @Type(() => Date)
    registrationDate: Date;
}
```

当您想将值转换为`Number`, `String`, `Boolean` 类型时也是这样做

#### 数组处理

当你想转换数组时，你必须使用`@Type`装饰器指定数组项的类型也可以使用自定义的数组类型

`Set`和`Map`也是一样

```javascript
import {Type} from "class-transformer";

export class AlbumCollection extends Array<Album> {
    // custom array functions ...
}

export class Photo {

    id: number;

    name: string;

    @Type(() => Album)
    albums: Album[];
    // albums: AlbumCollection; 使用自定义类型
}

export class Skill {
    name: string;
}

export class Weapon {
    name: string;
    range: number;
}

export class Player {
    name: string;

    @Type(() => Skill)
    skills: Set<Skill>;

    @Type(() => Weapon)
    weapons: Map<string, Weapon>;
}
```

### 自定义转换

#### 基本使用

你可以使用`@Transform`添加额外的数据转换,例如当你想把通过普通对象中的字符串日期转换后的`date`对象继续转换变成`moment`库的对象：

```javascript
import {Transform} from "class-transformer";
import * as moment from "moment";
import {Moment} from "moment";

export class Photo {

    id: number;

    @Type(() => Date)
    @Transform(value => moment(value), { toClassOnly: true })
    date: Moment;
}
```

现在当执行`plainToClass`转换后的对象中的`date`属性将是一个`Moment`对象。`@Transform`同样支持组和版本。

#### 高级用法

`@Transform`有更多的参数给你创建自定义的转换逻辑

```javascript
@Transform((value, obj, type) => value)
```

| 参数    | 描述                     |
| :------ | ------------------------ |
| `value` | 自定义转换执行前的属性值 |
| `obj`   | 转换源对象               |
| `type`  | 转换的类型               |

#### 其他装饰器

| 签名                     | 示例                                                 |
| ------------------------ | ---------------------------------------------------- |
| `@TransformClassToPlain` | `@TransformClassToPlain({ groups: ["user"] })`       |
| `@TransformClassToClass` | `@TransformClassToClass({ groups: ["user"] })`       |
| `@TransformPlainToClas`  | `@TransformPlainToClass(User, { groups: ["user"] })` |

上述装饰器接受一个可选参数：`ClassTransformOptions`-转换选项，例如groups, version, name，示例：

```javascript
@Exclude()
class User {

    id: number;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose({ groups: ['user.email'] })
    email: string;

    password: string;
}

class UserController {

    @TransformClassToPlain({ groups: ['user.email'] })
    getUser() {
        const user = new User();
        user.firstName = "Snir";
        user.lastName = "Segal";
        user.password = "imnosuperman";

        return user;
    }
}

const controller = new UserController();
const user = controller.getUser();
```

`user`对象将包含firstname,latstname和email

#### 使用泛型

由于目前Typescript对反射的支持还没有完善，所以只能使用其它替代方案，具体可以查看[这个例子](https://github.com/pleerock/class-transformer/tree/master/sample/sample4-generics)

#### 隐式类型转换

> 你如果将class-validator与class-transformer一起使用，则可能不想启用此功能。

根据Typescript提供的类型信息，启用内置类型之间的自动转换。默认禁用。

```javascript
import { IsString } from 'class-validator'

class MyPayload {

  @IsString()
  prop: string
}


const result1 = plainToClass(MyPayload, { prop: 1234 }, { enableImplicitConversion: true });
const result2 = plainToClass(MyPayload, { prop: 1234 }, { enableImplicitConversion: false });

/**
 *  result1 will be `{ prop: "1234" }` - notice how the prop value has been converted to string.
 *  result2 will be `{ prop: 1234 }` - default behaviour
 */
```

#### 循环引用

如果`User`包含一个`Photo`类型的`photos`数组属性，而`Photo`又包含一个属性链接到`User`，则转换过程中此属性会被忽略，除了`classToClass`操作。