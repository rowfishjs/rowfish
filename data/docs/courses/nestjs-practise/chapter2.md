---
sidebar_label: 基本数据操作
sidebar_position: 3
---

# 基本数据操作

视频地址: [https://www.bilibili.com/video/BV1mT411u76H?share_source=copy_web&vd_source=00f2b7e5f03bd39b4d8c477ef0bd8b1b](https://www.bilibili.com/video/BV1mT411u76H?share_source=copy_web&vd_source=00f2b7e5f03bd39b4d8c477ef0bd8b1b)

[postman]: https://www.postman.com/ "postman"
[lodash]: https://www.lodashjs.com/	"lodash"
[cross-env]: https://github.com/kentcdodds/cross-env#readme	"cross-env"
[class-transformer]: https://github.com/typestack/class-transformer	"class-transformer"
[class-validator]: https://github.com/typestack/class-validator	"class-validator"
[typeorm]: https://typeorm.io/ "typeorm"
[nestjs-typeorm]: https://docs.nestjs.com/techniques/database "@nestjs/typeorm"
[@nestjs/platform-fastify]: https://docs.nestjs.com/techniques/performance	"@nestjs/platform-fastify"
[nestjs-swagger]: https://docs.nestjs.com/openapi/introduction "nestjs-swagger"
[fastify-swagger]: https://docs.nestjs.com/openapi/introduction	"fastify-swagger"
[express]: https://expressjs.com/	"express"
[fastify]: https://www.fastify.io/	"fastify"

## 学习目标

- 简单地整合[nestjs][]框架与[typeorm][]
- 实现基本的*CRUD*数据操作
- 使用[class-validator][]验证请求数据
- 更换更加快速的[fastify][]适配器
- 使用Thunder Client对测试接口

## 安装Mysql

> 实际生产环境中建议使用PostgreSQL,因为教程以学习为主,所以直接使用相对来说比较通用和简单的Mysql

使用以下命令安装Mysql

> 如果本机不是使用linux(比如使用wsl2),请到[mysql](https://dev.mysql.com/downloads/repo/apt/)官网点击download按钮下载安装包后在chrome查看下载地址，然后在开发机用`wget`下载

> 如果本机使用MacOS,使用`brew install mysql`,如果本机使用Arch系列,使用`sudo pacman -Syy mysql`

```shell
# 下载镜像包
cd /usr/local/src
sudo wget sudo wget https://repo.mysql.com/mysql-apt-config_0.8.22-1_all.deb
# 添加镜像(其它选项不用管，直接OK就可以)
sudo apt-get install ./mysql-apt-config_0.8.22-1_all.deb
# 升级包列表
sudo apt-get update
# 开始安装，输入密码后，有一个密码验证方式，因为是开发用，所以选择第二个弱验证即可
sudo apt-get install mysql-server 
# 初始化,在是否加载验证组件时选择No,在是否禁用远程登录时也选择No
sudo mysql_secure_installation
# 因为是远程SSH连接开发所以需要开启远程数据库链接，如果是本地或者wsl2则不需要开启
mysql -u root -p 
CREATE USER 'root'@'%' IDENTIFIED BY '密码';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

接着使用Navicat等客户端就可以连接了

## 预装依赖

- [lodash][]是常用的工具库
- [cross-env][]用于跨平台设置环境变量
- [class-transformer][]用于对请求和返回等数据进行序列化 
- [class-validator][]用于验证请求`dto`等
- [typeorm][]一个TS编写的[node.js][]ORM
- [@nestjs/typeorm][]Nestjs的TypeOrm整合模块
- [@nestjs/platform-fastify][]Fastify适配器,用于替代express
- [nestjs-swagger][]生成open api文档,目前我们使用其`PartialType`函数是`UpdateDto`中的属性可选
- [fastify-swagger][]生成Fastify的Open API

```shell
~ pnpm add class-transformer \
  @nestjs/platform-fastify \
  class-validator \
  lodash \
  @nestjs/swagger \
  fastify-swagger \
  mysql2 \
  typeorm \
  @nestjs/typeorm

 ~ pnpm add @types/lodash cross-env @types/node typescript -D
```

## 生命周期

要合理的编写应用必须事先了解清楚整个程序的访问流程,本教程会讲解如何一步步演进每一次访问流,作为第一步课时,我们的访问流非常简单,可以参考下图

![](https://pic.pincman.com/media/20201109040813.png)

## 文件结构

我们通过整合[typeorm][]来连接mysql实现一个基本的CRUD应用,首先我们需要创建一下文件结构

> 建议初学者手动创建，没必要使用CLI去创建，这样目录和文件更加清晰

1. 创建模块
2. 编写模型
3. 编写Repository(如果有需要的话)
5. 编写数据验证的DTO
6. 编写服务
7. 编写控制器
8. 在每个以上代码各自的目录下建立一个`index.ts`并导出它们
9. 在各自的`Module`里进行注册提供者,导出等
10. 在`AppModule`中导入这两个模块

编写好之后的目录结构如下

```shell
.
├── app.module.ts                           # 引导模块           
├── config                                  # 配置文件目录
│   ├── database.config.ts                  # 数据库配置
│   └── index.ts
├── main.ts                                 # 应用启动器
├── modules
    ├── content                             # 内容模块目录
    │   ├── content.module.ts               # 内容模块
    │   ├── controllers                     # 控制器
    │   ├── dtos                            # DTO访问数据验证
    │   ├── entities                        # 数据实体模型
    |   ├── index.ts              
    │   ├── repositories                    # 自定义Repository
    │   ├── services                        # 服务
    └──  core
        ├── constants.ts                    # 常量
        ├── core.module.ts                  # 核心模块
        ├── decorators                      # 装饰器
        └── types.ts                        # 公共类型
```

## 应用编码

在开始编码之前需要先更改一下`package.json`和`nestjs-cli.json`两个文件

在`package.json`中修改一下启动命令,以便每次启动可以自动配置运行环境并兼容`windows`环境

```json
"prebuild": "cross-env rimraf dist",
"start": "cross-env NODE_ENV=development nest start",
"start:dev": "cross-env NODE_ENV=development nest start --watch",
"start:debug": "cross-env NODE_ENV=development nest start --debug --watch",
"start:prod": "cross-env NODE_ENV=production node dist/main",
```

为了在每次重新编译前自动删除上次的产出,在`nestjs-cli.json`中配置` "deleteOutDir": true`

### `main.ts`

把适配器由[express][]换成更快的[fastify][],并把监听的IP改成`0.0.0.0`方便外部访问.为了在使用[class-validator][]的`DTO`类中也可以注入nestjs容器的依赖,需要添加`useContainer`

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3000,'0.0.0.0');
}
bootstrap();
```
### 连接配置

创建一个`src/config/database.config.ts`文件

```typescript
export const database: () => TypeOrmModuleOptions = () => ({
    // ...
    // 此处entites设置为空即可,我们直接通过在模块内部使用`forFeature`来注册模型
    // 后续魔改框架的时候,我们会通过自定义的模块创建函数来重置entities,以便给自己编写的CLI使用
    // 所以这个配置后面会删除
    entities: [], 
    // 自动加载模块中注册的entity
    autoLoadEntities: true,
    // 可以在开发环境下同步entity的数据结构到数据库
    // 后面教程会使用自定义的迁移命令来代替,以便在生产环境中使用,所以以后这个选项会永久false
    synchronize: process.env.NODE_ENV !== 'production',
});

```

### `CoreModule`

核心模块用于挂载一些全局类服务,比如整合[typeorm][]的``TypeormModule`

**注意**: 这里不要使用`@Global()`装饰器来构建全局模块，因为后面在`CoreModule`类中添加一些其它方法

返回值中添加`global: true`来注册全局模块,并导出`metadata`.

```typescript
// src/core/core.module.ts
export class CoreModule {
    public static forRoot(options?: TypeOrmModuleOptions) {
        const imports: ModuleMetadata['imports'] = [TypeOrmModule.forRoot(options)];
        return {
            global: true,
            imports,
            module: CoreModule,
        };
    }
}
```

在`AppModule`导入该模块,并注册数据库连接

```typescript
// src/app.module.ts
@Module({
    imports: [CoreModule.forRoot(database())],
  ...
})
export class AppModule {}
```

### 自定义存储类

由于原来用于自定义Repository的`@EntityRepository`在[typeorm][typeorm]0.3版本后已经不可用,特别不方便,所以根据[这里的示例](https://gist.github.com/anchan828/9e569f076e7bc18daf21c652f7c3d012)来自定义一个`CustomRepository`装饰器

```typescript
// src/modules/core/constants.ts
// 传入装饰器的metadata数据标识
export const CUSTOM_REPOSITORY_METADATA = 'CUSTOM_REPOSITORY_METADATA';

// src/modules/core/decorators/repository.decorator.ts
// 定义装饰器
import { CUSTOM_REPOSITORY_METADATA } from '../constants';
export const CustomRepository = <T>(entity: ObjectType<T>): ClassDecorator =>
    SetMetadata(CUSTOM_REPOSITORY_METADATA, entity);

// src/modules/core/decorators/index.ts
export * from './repository.decorator';
```

定义静态方法用于注册自定义Repository

```typescript
 public static forRepository<T extends Type<any>>(
        repositories: T[],
        dataSourceName?: string,
    ): DynamicModule {
        const providers: Provider[] = [];

        for (const Repo of repositories) {
            const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_METADATA, Repo);

            if (!entity) {
                continue;
            }

            providers.push({
                inject: [getDataSourceToken(dataSourceName)],
                provide: Repo,
                useFactory: (dataSource: DataSource): typeof Repo => {
                    const base = dataSource.getRepository<ObjectType<any>>(entity);
                    return new Repo(base.target, base.manager, base.queryRunner);
                },
            });
        }

        return {
            exports: providers,
            module: CoreModule,
            providers,
        };
    }
```

###  `ContentModule`

内容模块用于存放*CRUD*操作的逻辑代码

```typescript
// src/modules/content/content.module.ts
@Module({})
export class ContentModule {}
```

在`AppModule`中注册

```typescript
// src/app.module.ts
@Module({
    imports: [CoreModule.forRoot(database()),ContentModule],
  ...
})
export class AppModule {}
```

#### 实体模型

创建一个`PostEntity`用于文章数据表

`PostEntity`继承``BaseEntity`,这样做是为了我们可以进行`ActiveRecord`操作,例如`PostEntity.save(post)`,因为纯`DataMapper`的方式有时候代码会显得啰嗦,具体请查看[此处](https://typeorm.io/#/active-record-data-mapper)

`@CreateDateColumn`和` @UpdateDateColumn`是自动字段,会根据创建和更新数据的时间自动产生,写入后不必关注

```typescript
// src/modules/content/entities/post.entity.ts
// 'content_posts'是表名称
@Entity('content_posts')
export class PostEntity extends BaseEntity {
...
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt!: Date;

    @UpdateDateColumn({
        comment: '更新时间',
    })
    updatedAt!: Date;
}
```

#### 存储类

本节存储类是一个空类,后面会添加各种操作方法

>   这里用到我们前面定义的自定义CustomRepository装饰器

```typescript
// src/modules/content/repositories/post.repository.ts
@CustomRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {}
```

#### 注册模型和存储类

在编写好`entity`和`repository`之后我们还需要通过`Typeorm.forFeature`这个静态方法进行注册,并把存储类导出为提供者以便在其它模块注入

```typescript
// src/modules/content/content.module.ts
@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity]),
        // 注册自定义Repository
        CoreModule.forRepository([PostRepository]),
    ],
     exports: [
        // 导出自定义Repository,以供其它模块使用
        CoreModule.forRepository([PostRepository]),
    ],
})
export class ContentModule {}
```

#### DTO验证

`DTO`配合管道(PIPE)用于控制器的数据验证,验证器则使用[class-validator][]

> class-validator是基于validator.js的封装,所以一些规则可以通过validator.js的文档查找,后面教程中我们会编写大量的自定义的验证规则,这节先尝试基本的用法

其基本的使用方法就是给`DTO`类的属性添加一个验证装饰器,如下

> `groups`选项用于配置验证组

```typescript
// src/modules/content/dtos/create-post.dto.ts
@Injectable()
export class CreatePostDto {
    @MaxLength(255, {
        always: true,
        message: '文章标题长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '文章标题必须填写' })
    @IsOptional({ groups: ['update'] })
    title!: string;
    ...
}

```

更新验证类`UpdatePostDto`继承自`CreatePostDto`,为了使`CreatePostDto`中的属性变成可选,需要使用[@nestjs/swagger][]包中的`PartialType`方法,请查阅[此处](https://docs.nestjs.com/openapi/mapped-types)文档

```typescript
// src/modules/content/dtos/update-post.dto.ts
@Injectable()
export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsUUID(undefined, { groups: ['update'], message: '文章ID格式错误' })
    @IsDefined({ groups: ['update'], message: '文章ID必须指定' })
    id!: string;
}

```

#### 服务类

服务一共包括5个简单的方法,通过调用`PostRepository`来操作数据

```typescript
// src/modules/content/services/post.service.ts
@Injectable()
export class PostService {
    // 此处需要注入`PostRepository`的依赖
    constructor(private postRepository: PostRepository) {}
    // 查询文章列表
    async findList() 
    // 查询一篇文章的详细信息
    async findOne(id: string)
    // 添加文章
    async create(data: CreatePostDto)
    // 更新文章
    async update(data: UpdatePostDto)
    // 删除文章
    async delete(id: string)
}

```

#### 控制器

控制器的方法通过`@GET`,`@POST`,`@PUT`,`@PATCH`,`@Delete`等装饰器对外提供接口,并且通过注入`PostService`服务来操作数据.在控制器的方法上使用框架自带的`ValidationPipe`管道来验证请求中的`body`数据,`ParseUUIDPipe`来验证`params`数据

```typescript
// 控制器URL的前缀
@Controller('posts')
export class PostController {
    constructor(protected postService: PostService) {}

    ...
   // 其它方法请自行查看源码
    @Get(':post')
    async show(@Param('post', new ParseUUIDPipe()) post: string) {
        return this.postService.findOne(post);
    }

    @Post()
    async store(
        @Body(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                // 不在错误中暴露target
                validationError: { target: false },
                groups: ['create'],
            }),
        )
        data: CreatePostDto,
    ) {
        return this.postService.create(data);
    }
}
```

#### 注册控制器等

- 为了后面``DTO`中可能会导入服务,需要把`DTO`,同样注册为提供者并且改造一下`main.ts`,把容器加入到`class-containter`中
- `PostService`服务可能后续会被`UserModule`等其它模块使用,所以此处我们也直接导出

```typescript
// src/modules/content/content.module.ts
@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity]),
        // 注册自定义Repository
        CoreModule.forRepository([PostRepository]),
    ],
    providers: [PostService, CreatePostDto, UpdatePostDto],
    controllers: [PostController],
    exports: [
        PostService,
        // 导出自定义Repository,以供其它模块使用
        CoreModule.forRepository([PostRepository]),
    ],
})
export class ContentModule {}
```

```typescript
// src/main.ts
...
async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.listen(3000, '0.0.0.0');
}
```

最后启动应用在`Thunder Client`中测试接口
