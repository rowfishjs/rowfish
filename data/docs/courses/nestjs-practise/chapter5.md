---
sidebar_label: 自动验证,序列化与异常处理
sidebar_position: 6
---

# 自动验证,序列化与异常处理

视频地址: [https://www.bilibili.com/video/BV1j34y1H7MA?share_source=copy_web&vd_source=00f2b7e5f03bd39b4d8c477ef0bd8b1b](https://www.bilibili.com/video/BV1j34y1H7MA?share_source=copy_web&vd_source=00f2b7e5f03bd39b4d8c477ef0bd8b1b)

## 学习目标

* 全局自动数据验证管道
* 全局数据序列化拦截器
* 全局异常处理过滤器

## 文件结构

本节内容主要聚焦于`CoreModule`

```
src/modules/core
├── constants.ts
├── core.module.ts
├── decorators
│   ├── dto-validation.decorator.ts
│   ├── index.ts
│   └── repository.decorator.ts
├── helpers.ts
├── providers
│   ├── app.filter.ts
│   ├── app.interceptor.ts
│   ├── app.pipe.ts
│   └── index.ts
└── types.ts
```

## 应用编码

本节中用到一个新的`Typescript`知识点-自定义装饰器和`matedata`,详细使用请查看我写的一篇相关文章

### 装饰器

添加一个用于为`Dto`构造`metadata`数据的装饰器

```shell
// src/core/decorators/dto-validation.decorator.ts
export const DtoValidation = (
    options?: ValidatorOptions & {
        transformOptions?: ClassTransformOptions;
    } & { type?: Paramtype },
) => SetMetadata(DTO_VALIDATION_OPTIONS, options ?? {});
```

### 验证管道

自定义一个全局的验证管道(继承自`Nestjs`自带的`ValidationPipe`管道)

*代码: src/core/providers/app.pipe.ts*

大致验证流程如下

1. 获取要验证的dto类
2. 获取`Dto`自定义的`matadata`数据(通过上面的装饰器定义)
3. 合并默认验证选项(通过在`CoreModule`注册管道时定义)与`matadata`
4. 根据DTO类上设置的type来设置当前的DTO请求类型('body' | 'query' | 'param' | 'custom')
5. 如果被验证的DTO设置的请求类型与被验证的数据的请求类型不是同一种类型则跳过此管道
6. 合并当前transform选项和自定义选项(验证后的数据使用class-transfomer\`序列化)
7. 如果dto类的中存在transform静态方法,则返回调用进一步transform之后的结果
8. 重置验证选项和transform选项为默认

### 序列化拦截器

默认的序列化拦截器是无法对分页数据进行处理的,所以自定义的全局序列化拦截器类重写`serialize`方法,以便对分页数据进行拦截并序列化

```
// src/core/providers/app.interceptor.ts
serialize(
        response: PlainLiteralObject | Array<PlainLiteralObject>,
        options: ClassTransformOptions,
    ): PlainLiteralObject | PlainLiteralObject[] {
        const isArray = Array.isArray(response);
        if (!isObject(response) && !isArray) return response;
        // 如果是响应数据是数组,则遍历对每一项进行序列化
        if (isArray) {
            return (response as PlainLiteralObject[]).map((item) =>
                this.transformToPlain(item, options),
            );
        }
        // 如果是分页数据,则对items中的每一项进行序列化
        if (
            'meta' in response &&
            'items' in response &&
            Array.isArray(response.items)
        ) {
            return {
                ...response,
                items: (response.items as PlainLiteralObject[]).map((item) =>
                    this.transformToPlain(item, options),
                ),
            };
        }
        // 如果响应是个对象则直接序列化
        return this.transformToPlain(response, options);
    }
```

### 异常处理过滤器

Typeorm在找不到模型数据时会抛出`EntityNotFound`的异常,而此异常不会被捕获进行处理,以至于直接抛出`500`错误,一般在数据找不到时我们需要抛出的是`404`异常,所以需要定义一个全局异常处理的过滤器来进行捕获并处理.

全局的异常处理过滤器继承自Nestjs自带的`BaseExceptionFilter`,在自定义的类中定义一个对象属性,并复写`catch`方法以根据此属性中不同的异常进行判断处理

```
// src/core/providers/app.filter.ts
protected resExceptions: Array<
        { class: Type<Error>; status?: number } | Type<Error>
    > = [{ class: EntityNotFoundError, status: HttpStatus.NOT_FOUND }];
catch(exception: T, host: ArgumentsHost) {...}

```

### 注册全局

在`CoreModule`中分别为全局的验证管道,序列化拦截器和异常处理过滤器进行注册

> 在注册全局管道验证时传入默认参数

```
// src/core/core.module.ts
providers: [
        {
            provide: APP_PIPE,
            useFactory: () =>
                new AppPipe({
                    transform: true,
                    forbidUnknownValues: true,
                    validationError: { target: false },
                }),
        },
        {
            provide: APP_FILTER,
            useClass: AppFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AppIntercepter,
        },
    ],
})
```

### 逻辑代码

* 对于验证器需要修改`Dto`和`Controller`
* 对于拦截器需要修改`Entity`和`Controller`
* 对于过滤器需要修改`Service`

#### 自动序列化

以`PostEntity`为例,比如在显示文章列表数据的时候为了减少数据量不需要显示`body`内容,而单独访问一篇文章的时候则需要,这时候可以添加添加一个序列化组`post-detail`,而为了确定每个模型的字段在读取数据时只显示我们需要的,所以在类前添加一个`@Exclude`装饰器

> 对于对象类型需要通过`@Type`装饰器的字段转义

示例

```
// src/modules/content/entities/post.entity.ts
    ...
    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt!: Date;
    @Expose()
    @Type(() => CategoryEntity)
    @ManyToMany((type) => CategoryEntity, (category) => category.posts, {
        cascade: true,
    })
    @JoinTable()
    categories!: CategoryEntity[];
    @Expose({ groups: ['post-detail'] })
    @Column({ comment: '文章内容', type: 'longtext' })
    body!: string;
```

然后可以在在控制器中针对有特殊配置的序列化添加`@SerializeOptions`装饰器,如序列化组

示例

```
// src/modules/content/controllers/post.controller.ts
    ...
    @Get(':post')
    @SerializeOptions({ groups: ['post-detail'] })
    async show(
        @Param('post', new ParseUUIDEntityPipe(PostEntity))
        post: string,
    ) {
        return this.postService.detail(post);
    }

```

#### 自动验证

为了代码简洁,把所有针对同一模型的`DTO`类全部放入一个文件,于是有了以下2个`dto`文件

* `src/modules/content/dtos/category.dto.ts`
* `src/modules/content/dtos/post.dto.ts`

为`dto`文件中需要传入自定义验证参数的类添加`@DtoValidation`装饰器,比如`@DtoValidation({ groups: ['create'] })`

注意的是默认的`paramType`为`body`,所以对于`query`,需要额外加上`type: 'query'`

示例

```
// src/modules/content/dtos/category.dto.ts
@Injectable()
@DtoValidation({ type: 'query' })
export class QueryCategoryDto implements PaginateDto {
...
}
```

现在可以在控制器中删除所有的`new ValidatePipe(...)`代码了,因为全局验证管道会自行处理

#### 自动处理异常

现在把服务中的`findOne`等查询全部改成`findOneOrFail`等,把抛出的`NotFoundError`这些异常去除就可以在typeorm抛出默认的`EntityNotFound`异常时就会响应`404`

示例

```
// src/modules/content/services/post.service.ts
    async findOne(id: string) {
        const query = await this.getItemQuery();
        const item = await query.where('post.id = :id', { id }).getOne();
        if (!item)
            throw new EntityNotFoundError(PostEntity, `Post ${id} not exists!`);
        return item;
    }
```