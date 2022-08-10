---
sidebar_label: 排序,分页与过滤
sidebar_position: 5
---

# 排序,分页与过滤

视频地址: [https://www.bilibili.com/video/BV1DZ4y1Y78S?share_source=copy_web&vd_source=00f2b7e5f03bd39b4d8c477ef0bd8b1b](https://www.bilibili.com/video/BV1DZ4y1Y78S?share_source=copy_web&vd_source=00f2b7e5f03bd39b4d8c477ef0bd8b1b)

## 学习目标

* 重载TreeRepository自带方法来对树形结构的数据进行扁平化处理
* 对Typeorm查询出的数据列表进行分页处理
* 通过请求中的query查询对数据进行筛选处理,比如排序,过滤等
* 实现发布文章和取消发布的功能
* Typeorm 模型事件和Subscriber(订阅者)的使用
* 使用`sanitize-html`对文章内容进行防注入攻击处理

## 预装依赖

* [nestjs-typeorm-paginate](https://github.com/nestjsx/nestjs-typeorm-paginate)实现分页
* [sanitize-html](https://github.com/apostrophecms/sanitize-html)过滤`html`标签,防注入攻击
* [deepmerge](https://github.com/TehShrike/deepmerge)深度合并对象

```shell
~ pnpm add nestjs-typeorm-paginate sanitize-html deepmerge && pnpm add @types/sanitize-html -D
```

## 文件结构
创建文件

```shell
cd src/modules/content && \
mkdir subscribers && \
touch dtos/query-category.dto.ts \
dtos/query-post.dto.ts \
subscribers/post.subscriber.ts \
subscribers/index.ts \
services/sanitize.service.ts \
&& cd ../../../
```

与上一节一样,这一节的新增和修改集中于`ContentModule`

```
src/modules/content
├── constants.ts
├── content.module.ts
├── controllers
│   ├── category.controller.ts
│   ├── comment.controller.ts
│   ├── index.ts
│   └── post.controller.ts
├── dtos
│   ├── create-category.dto.ts
│   ├── create-comment.dto.ts
│   ├── create-post.dto.ts
│   ├── index.ts
│   ├── query-category.dto.ts
│   ├── query-post.dto.ts
│   ├── update-category.dto.ts
│   └── update-post.dto.ts
├── entities
│   ├── category.entity.ts
│   ├── comment.entity.ts
│   ├── index.ts
│   └── post.entity.ts
├── repositories
│   ├── category.repository.ts
│   ├── comment.repository.ts
│   ├── index.ts
│   └── post.repository.ts
├── services
│   ├── category.service.ts
│   ├── comment.service.ts
│   ├── index.ts
│   ├── post.service.ts
│   └── sanitize.service.ts
└── subscribers
    ├── index.ts
    └── post.subscriber.ts
```

## 应用编码

这节多了一个新的概念,即`subscriber`,具体请查阅`typeorm`文档,当然你也可以在模型中使用事件处理函数,效果没差别

### 模型

#### `CategoryEntity`

*代码:src/modules/content/entities/category.entity.ts*

* 添加`order`字段用于排序
* 添加`level`属性(虚拟字段)用于在打平树形数据的时候添加当前项的等级

#### PostEntity

*代码: src/modules/content/entities/post.entity.ts*

`type`字段的类型用`enum`枚举来设置,首先需要定义一个`PostBodyType`的`enum`类型,可以添加一个`constants.ts`文件来统一定义这些`enum`和常量

* 添加`publishedAt`字段用于控制发布时间和发布状态
* 添加` type`字段用于设置发布类型
* 添加`customOrder`字段用于自定义排序

### 存储类

#### `CategoryRepository`

*代码: src/modules/content/repositories/category.repository.ts*

因为`CategoryRepository`继承自`TreeRepository`,所以我们在`typeorm`源码中找到这个类,并对部分方法进行覆盖,如此我们就可以对树形分类进行排序,覆盖的方法如下

> 当然后面会讲到更加深入的再次封装,此处暂时先这么用

* `findRoots` 为根分类列表查询添加排序
* `createDescendantsQueryBuilder` 为子孙分类查询器添加排序
* `createAncestorsQueryBuilder` 为祖先分类查询器添加排序

### DTO验证

新增`QueryCategoryDto`和`QueryPostDto`用于查询分类和文章时进行分页以及过滤数据和设置排序类型等

在添加`DTO`之前,现在添加几个数据转义函数,以便把请求中的字符串改成需要的数据类型

```
// src/core/helpers.ts

// 用于请求验证中的number数据转义
export function tNumber(value?: string | number): string |number | undefined
// 用于请求验证中的boolean数据转义
export function tBoolean(value?: string | boolean): string |boolean | undefined
// 用于请求验证中转义null
export function tNull(value?: string | null): string | null | undefined
```

修改`create-category.dto.ts`和`create-comment.dto.ts`的`parent`字段的`@Transform`装饰器

```
export class CreateCategoryDto {
...
    @Transform(({ value }) => tNull(value))
    parent?: string;
}
```

添加一个通用的`DTO`接口类型

```
// src/core/types.ts

// 分页验证DTO接口
export interface PaginateDto {
    page: number;
    limit: number;
}
```

#### `QueryCategoryDto`

*代码: src/modules/content/dtos/query-category.dto.ts*

* `page`属性设置当前分页
* `limit`属性设置每页数据量

#### `QueryPostDto`

除了与`QueryCateogryDto`一样的分页属性外,其它属性如下

* `orderBy`用于设置排序类型
* `isPublished`根据发布状态过滤文章
* `category`过滤出一下分类及其子孙分类下的文章

`orderBy`字段是一个`enum`类型的字段,它的可取值如下

* `CREATED`: 根据创建时间降序
* `UPDATED`: 根据更新时间降序
* `PUBLISHED`: 根据发布时间降序
* `COMMENTCOUNT`: 根据评论数量降序
* `CUSTOM`: 根据自定义的`order`字段升序

### 服务类

#### `SanitizeService`

*代码: src/modules/content/services/sanitize.service.ts*

此服务类用于`clean html`

`sanitize`方法用于对HTML数据进行防注入处理

#### `CategoryService`

*代码:src/modules/content/services/category.service.ts*

添加一个辅助函数,用于对打平后的树形数据进行分页

```
// src/core/helpers.ts
export function manualPaginate<T extends ObjectLiteral>(
    { page, limit }: PaginateDto,
    data: T[],
): Pagination<T>
```

新增`paginate(query: QueryCategoryDto)`方法用于处理分页

```
async paginate(query: QueryCategoryDto) {
    // 获取树形数据
    const tree = await this.findTrees();
    // 打平树形数据
    const list = await this.categoryRepository.toFlatTrees(tree);
    // 调用手动分页函数进行分页
    return manualPaginate(query, list);
}
```

#### `PostService`

*代码:src/modules/content/services/post.service.ts*

* `getListQuery`: 用于构建过滤与排序以及通过分类查询文章数据等功能的`query`构建器
* `paginate`: 调用`getListQuery`生成`query`,并作为`nestjs-typeorm-paginate`的` paginate`的参数对数据进行分页

```
async paginate(params: FindParams, options: IPaginationOptions) {
    const query = await this.getListQuery(params);
    return paginate<PostEntity>(query, options);
}
```

### 订阅者

#### `PostSubscriber`

*代码: src/modules/content/subscribers/post.subscriber.ts*

* `beforeInsert`(插入数据前事件): 如果在添加文章的同时发布文章,则设置当前时间为发布时间
* `beforeUpdate`(更新数据前事件): 更改发布状态会同时更新发布时间的值,如果文章更新为未发布状态,则把发布时间设置为null
* `afterLoad`(加载数据后事件): 对HTML类型的文章内容进行去标签处理防止注入攻击

**一个需要注意的点是需要在**`subcriber`类的构造函数中注入`Connection`才能获取链接

```
   constructor(
        connection: Connection,
        protected sanitizeService: SanitizeService,
    ) {
        connection.subscribers.push(this);
    }
```

#### 注册订阅者

把订阅者注册成服务后,由于在构造函数中注入了`connection`这个连接对象,所以`typeorm`会自动把它加载到这个默认连接的`subscribers`配置中

```
// src/modules/content/subscribers/post.subscriber.ts
import * as SubscriberMaps from './subscribers';
const subscribers = Object.values(SubscriberMaps);
@Module({
    ....
    providers: [...subscribers, ...dtos, ...services],
})
```

### 控制器

#### `CategoryController`

*代码: src/modules/content/controllers/category.controller.ts*

* `list`: 通过分页来查找扁平化的分类列表
* `index`: 把url设置成` @Get('tree')`

```
    @Get()
    // 分页查询
    async list(
        @Query(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
        )
        query: QueryCategoryDto,
    ) {
        return this.categoryService.paginate(query);
    }

    // 查询树形分类
    @Get('tree')
    async index() {
        return this.categoryService.findTrees();
    }
```

#### `PostController`

**代码: src/modules/content/controllers/post.controller.ts**

修改`index`方法用于分页查询

```
// 通过分页查询数据
async index(
        @Query(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
        )
        { page, limit, ...params }: QueryPostDto,
    ) {
        return this.postService.paginate(params, { page, limit });
    }
```