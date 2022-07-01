---

slug: accesscontrol-usage

title: accesscontrol使用指南

authors: pincman

tags: [accesscontrol,typescript,nestjs]

rf_summary: 这是一篇好几年前发布在老博客的文章,虽然accesscontroll目前已经不用了,但是在写权限功能的时候,偶尔拿过来参考参考还是挺不错的😁

---
### 基于角色和属性的Node.js访问控制

虽然许多[RBAC][rbac]（基于角色的访问控制）实现上有所不同，但基础知识都是一样的，这种模式也被广泛采用，因为它模拟了真实生活角色(任务)分配。 但是数据变得越来越复杂; 您需要在资源，功能甚至环境中定义策略。 这称为 [ABAC][abac] （基于属性的访问控制）。

我们需要合并以上两者的最佳特性（见[NIST paper][nist-paper]）; 这个node库不仅实现了RBAC基础知识，并且还关注* resource *和* action *属性。

## 核心功能

- 链式的，友好的API。
  例如`ac.can(role).create(resource)`
- 角色分层**继承**。
- 可**一次**定义授权（例如从数据库结果）也可以**逐个**定义授权。
- 通过**glob表示法**定义的属性授予/拒绝权限（支持嵌套对象）。
- 能够设置可允许的属性**过滤**数据（模型）实例。
- 能够控制**自己创建**的或**任何**资源的访问。
- 能够**锁定**基础授权模型。
- 没有**静默**错误。
- **快**。（授权存储在内存中，没有数据库查询。）
- **经过**严格**测试**。
- TypeScript支持。

*为了构建更加健壮的应用，这个库（v1.5.0 +）完全用TypeScript重写*

## 安装

使用 [**npm**](https://www.npmjs.com/package/accesscontrol): `npm i accesscontrol --save`  
使用 [**yarn**](https://yarn.pm/accesscontrol): `yarn add accesscontrol`

## 使用指南

```js
const AccessControl = require('accesscontrol');
// or:
// import { AccessControl } from 'accesscontrol';
```

### 基础示例

逐个定义 roles（权限） 和grants（角色）
```js
const ac = new AccessControl();
ac.grant('user')                    // 定义新角色或修改现有角色。也可以是一个数组。
    .createOwn('video')             // 与.createOwn('video', ['*'])相同 ['*']为默认参数
    .deleteOwn('video')
    .readAny('video')
  .grant('admin')                   // 切换到另一个角色而不破坏操作链
    .extend('user')                 // 继承角色功能。一样，也可以是一个数组 
    .updateAny('video', ['title'])  // 明确定义可操作的属性 
    .deleteAny('video');

const permission = ac.can('user').createOwn('video');
console.log(permission.granted);    // —> true
console.log(permission.attributes); // —> ['*'] (所有属性)

permission = ac.can('admin').updateAny('video');
console.log(permission.granted);    // —> true
console.log(permission.attributes); // —> ['title']
```

### Express.js 示例

检查所请求资源和操作的角色权限，如果已授权则返回权限筛选出的属性进行响应

```js
const ac = new AccessControl(grants);
// ...
router.get('/videos/:title', function (req, res, next) {
    const permission = ac.can(req.user.role).readAny('video');
    if (permission.granted) {
        Video.find(req.params.title, function (err, data) {
            if (err || !data) return res.status(404).end();
            // filter data by permission attributes and send.
            res.json(permission.filter(data));
        });
    } else {
        // resource is forbidden for this user/role
        res.status(403).end();
    }
});
```

## 角色

您可以通过轻松地调用`AccessControl`实例上的方法`.grant(<role>)`或`.deny(<role>)`方法来创建/定义角色。

- 角色也可以继承自其它角色.

```js
// 用户角色继承查看者角色权限
ac.grant('user').extend('viewer');
// 管理员角色继承普通用户和编辑员的角色权限
ac.grant('admin').extend(['user', 'editor']);
// 管理员和超级管理员角色都继承了版主权限
ac.grant(['admin', 'superadmin']).extend('moderator');
```

- 继承是通过引用完成的，因此您可以在继承角色之前或之后授予资源权限。

```js
// 案例 #1
ac.grant('admin').extend('user') // 假设用户角色已经存在 
  .grant('user').createOwn('video');

// 案例 #2
ac.grant('user').createOwn('video')
  .grant('admin').extend('user');

// 以下结果对于两种情况都是相同的
const permission = ac.can('admin').createOwn('video');
console.log(permission.granted); // true
```


继承说明：

- 角色不能自我继承。
- 不允许交叉继承。
  例如`ac.grant('user').extend('admin').grant('admin').extend('user')`将抛出异常。
- 角色不能（预）继承不存在的角色。换句话说，您应该首先创建基本角色。例如`ac.grant('baseRole').grant('role').extend('baseRole')`

## 动作和动作属性

[CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)操作是您可以对资源执行的操作。有两个动作属性定义了资源的**所有权**：*own*和*any*。

例如，一个`admin`角色可以`create`，`read`，`update`或`delete`（CRUD）**任何** `account`资源。但是，一个`user`角色可能只`read`或`update`它**自己的** `account`资源。

<table>
    <thead>
        <tr>
            <th>操作</th>
            <th>所有权</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="2">
            <b>C</b>reate<br />
            <b>R</b>ead<br />
            <b>U</b>pdate<br />
            <b>D</b>elete<br />
            </td>
            <td>自己的资源</td>
            <td>可以(或不可以)对当前请求的自己的资源执行C|R|U|D 操作。</td>
        </tr>
        <tr>
            <td>任何资源</td>
            <td>可以(或不可以)对任何资源执行C|R|U|D 操作,包括自己的资源。</td>
        </tr>   
    </tbody>
</table>

```js
ac.grant('role').readOwn('resource');
ac.deny('role').deleteAny('resource');
```

*请注意，操作**自己的资源**也要求您检查实际所有权。[查看此处](https://github.com/onury/accesscontrol/issues/14#issuecomment-328316670) 获取更多信息。*

## 资源和资源属性

多个角色可以访问特定资源。但是根据上下文，您可能需要限制特定角色可访问的资源内容。

这可以通过资源属性实现。您可以使用Glob表示法来定义允许或拒绝的资源属性。

例如，我们有一个`video`具有以下属性的资源：`id`，`title`和`runtime`。`admin`角色可以读取*任何* `video`资源的所有属性：

```js
ac.grant('admin').readAny('video', ['*']);
// 也可以这样写:
// ac.grant('admin').readAny('video');
```
但是`id`属性不应该被`user`角色读取。

```js
ac.grant('user').readOwn('video', ['*', '!id']);
// 也可以这样写:
// ac.grant('user').readOwn('video', ['title', 'runtime']);
```

你也可以嵌套对象 (属性).
```js
ac.grant('user').readOwn('account', ['*', '!record.id']);
```

## 检查权限和过滤属性

你可以调用`AccessControl`实例的`.can(<role>).<action>(<resource>)`方法来检查对指定资源和行为的权限。

```js
const permission = ac.can('user').readOwn('account');
permission.granted;       // true
permission.attributes;    // ['*', '!record.id']
permission.filter(data);  // filtered data (without record.id)
```
见 [express.js 示例](#expressjs-example).

## 一次定义所有授权

你可以一次把所有授权传递给 `AccessControl` 的构造方法.
它也可以接受一个对象 `Object`:

```js
// 这实际上是如何在内部维护授权的方案
let grantsObject = {
    admin: {
        video: {
            'create:any': ['*', '!views'],
            'read:any': ['*'],
            'update:any': ['*', '!views'],
            'delete:any': ['*']
        }
    },
    user: {
        video: {
            'create:own': ['*', '!rating', '!views'],
            'read:own': ['*'],
            'update:own': ['*', '!rating', '!views'],
            'delete:own': ['*']
        }
    }
};
const ac = new AccessControl(grantsObject);
```
... 也可以传递一个 数组 (从数据库中获取时很有用):
```js
// 从数据库获取的授权列表 (必须在内部转换为如下格式的有效的grants对象)
let grantList = [
    { role: 'admin', resource: 'video', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'video', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'video', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'video', action: 'delete:any', attributes: '*' },

    { role: 'user', resource: 'video', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'user', resource: 'video', action: 'read:any', attributes: '*' },
    { role: 'user', resource: 'video', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'user', resource: 'video', action: 'delete:own', attributes: '*' }
];
const ac = new AccessControl(grantList);
```
你可以随时设置授权...
```js
const ac = new AccessControl();
ac.setGrants(grantsObject);
console.log(ac.getGrants());
```
...除非你锁定它:
```js
ac.lock().setGrants({}); // throws after locked
```

## 适配nest.js

#### 一个基于[onury/accesscontrol](https://github.com/onury/accesscontrol)实现的Nestjs权限控制模块

#### 本模块提供什么 ?

在这个模块中，您将拥有开箱即用的以下所有功能（只用于Nest.js）。

* 它是**基于装饰器的，**因为大多数时候你会在你的路由中使用装饰器。
* 内置**ACGuard**，您可以直接使用它。
* 从任何地方都可以访问底层的**AccessControl**对象。

## 安装

* NPM:

```bash
npm install nest-access-control --save
```

* Yarn:

```bash
yarn add nest-access-control
```

---

#### 示例

> 查看示例目录以获取更多代码;

加入我们需要构建视频服务，以便用户可以与他人分享视频，但我们需要一些`admins`来控制这些视频。

1.  首先让我们定义角色:

为了构建我们的角色，我们需要这个`RolesBuilder`类，它继承自`accesscontrol`包的`AccessControl`类。

```ts
// app.roles.ts

export enum AppRoles {
  USER_CREATE_ANY_VIDEO = 'USER_CREATE_ANY_VIDEO',
  ADMIN_UPDATE_OWN_VIDEO = 'ADMIN_UPDATE_OWN_VIDEO',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(AppRoles.USER_CREATE_ANY_VIDEO) // define new or modify existing role. also takes an array.
  .createOwn('video') // equivalent to .createOwn('video', ['*'])
  .deleteOwn('video')
  .readAny('video')
  .grant(AppRoles.ADMIN_UPDATE_OWN_VIDEO) // switch to another role without breaking the chain
  .extend(AppRoles.USER_CREATE_ANY_VIDEO) // inherit role capabilities. also takes an array
  .updateAny('video', ['title']) // explicitly defined attributes
  .deleteAny('video');
```

> 专家提示 ? ：请将所有角色组织在一个文件中，例如： `app.roles.ts`。

2. 接着让我们在跟模块中使用`AccessControlModule`注册角色：

```ts
// app.module.ts

import { roles } from './app.roles';

@Module({
  imports: [AccessControlModule.forRoles(roles)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

直到现在一切都很好，现在让我们构建我们的应用程序，假设我们有视频名称列表，用户可以 - *根据我们的角色* - `create:own`新视频或`read:any`视频，好的，让我们开始构建它

```ts
// app.controller.ts
...
@Controller()
export class AppController  {
	constructor(private readonly appService: AppService)  {}
	@UseGuards(AuthGuard, ACGuard)
	@UseRoles({
		resource:  'video',
		action:  'read',
		possession:  'any',
	})
	@Get()
	root(@UserRoles() userRoles: any)  {
		return this.appService.root(userRoles);
	}
}
```

那么让我们讨论一下发生了什么！

首先我们介绍了两个新装饰器，实际上它们是三个，但让我们看看它们能做什么：

- `@UseRoles({ ... })`：这是最常用的装饰器，它定义用户允许访问此路由的角色。它可以设置一个或多个角色，但请记住，**必须**满足所有角色。角色的结构非常简单，例如，我们在这里定义了我们拥有的资源，以及**ACGuard \*** - 将检查用户角色，然后如果用户角色具有访问此资源的权限，则守卫将返回`true`，否则将抛出一个`ForbiddenException`。关于角色的结构的更多信息请参阅`roles.interface.ts`文件或读取`accesscontrol`库的[原始文档](https://onury.io/accesscontrol/)。
- `UserRoles(<prop>)`：如果你想直接访问用户角色，也许你就想手动检查它的角色，而不是让`ACGuard`为你做这些，然后你就会寻找`ACGuard`这个装饰器。这个装饰器它其实很简单，它只是获取`req.user.roles`从`request`对象返回值，但是等等，如果用户的角色中不存在`prop: role`，我们知道你会问这个问题，这样你就可以将一个可选的属性键传递给装饰器了以便从用户对象获取它，例如`@UserRoles('permissions')`将返回`req.user.permissions`。
- `@InjectRolesBuilder()`: If you hate the `ACGuard` - _imo it's a good guard_ - and want to build your own Guard instead, you will likely need to access to the underlying `RolesBuilder` Object , then that decorator for you, it will inject the `Roles` you have defined before, i.e the object passed to the `AccessControlModule.forRoles(roles)`.
- `@InjectRolesBuilder()`：如果你不喜欢的`ACGuard`- *这是一个很好的守卫* -如果你想建立自己的守卫代替它，您可能需要访问底层`RolesBuilder`对象，那么这个装饰器将会注入你之前已定义的`Roles`，即传递给`AccessControlModule.forRoles(roles)`的对象。

#### 限制

首先，这个模块假设以下情况

1.  在 `req.user`存在用户对象
2.  您可以自己构建`AuthGuard`将`user`对象附加到`req`对象的内容,[查看详细方法](https://docs.nestjs.com/guards)
3.  the `AuthGuard` must be registered before roles guard, in this case it's `ACGuard`, and of course you can combine the `AuthGuard` and `ACGuard` in one guard, and use it everywhere.
4.  `AuthGuard`必须在roles守卫之前注册，在这个案例中roles守卫就是`ACGuard`，当然你可以把`AuthGuard`和`ACGuard`放在一个守卫中，并在任何地方使用它。

其次，我不认为这些是限制，因为你可以轻松地建立自己的守卫，而不再需要内置的了。