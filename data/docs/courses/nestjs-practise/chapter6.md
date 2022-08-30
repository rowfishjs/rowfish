---
sidebar_label: 简化代码与自定义约束
sidebar_position: 7
---

# 简化代码与自定义约束
视频地址:https://www.bilibili.com/video/BV1Yd4y1G7EX/

## 学习目标

* 学会抽象代码,减少重复工作
* 自定义验证约束，支持数据库验证

## 文件结构

本节内容仍然主要聚焦于`CoreModule`

```
src/modules/core
├── constants.ts
├── constraints
│   ├── index.ts
│   ├── match.constraint.ts
│   ├── match.phone.constraint.ts
│   ├── model.exist.constraint.ts
│   ├── password.constraint.ts
│   ├── tree.unique.constraint.ts
│   ├── tree.unique.exist.constraint.ts
│   ├── unique.constraint.ts
│   └── unique.exist.constraint.ts
├── core.module.ts
├── crud
│   ├── index.ts
│   ├── repository.ts
│   ├── subscriber.ts
│   └── tree.repository.ts
├── decorators
│   ├── dto-validation.decorator.ts
│   ├── index.ts
│   └── repository.decorator.ts
├── filters
│   ├── index.ts
│   └── optional.uuid.pipe.ts
├── helpers.ts
├── providers
│   ├── app.filter.ts
│   ├── app.interceptor.ts
│   ├── app.pipe.ts
│   └── index.ts
└── types.ts
```

## 应用编码

### 验证约束

自定义验证约束的规则请看[这里](https://github.com/typestack/class-validator#custom-validation-decorators)

* `IsMatch`: 判断两个字段的值是否相等的验证规则
* `isMatchPhone`:手机号验证规则，必须是"区域号.手机号"的形式
* `IsPassword`: 密码复杂度验证，提供5种规则并且可自行添加规则
* `IsModelExist`: 查询某个字段的值的记录是否在某张数据表中存在
* `IsUnique`: 验证某个字段的唯一性
* `IsUniqueExist`: 在更新时验证唯一性,通过指定ignore忽略忽略的字段
* `IsTreeUnique`: 验证树形模型下同级别某个字段的唯一性
* `IsTreeUniqueExist`: 在更新时验证树形数据同级别某个字段的唯一性,通过ignore指定忽略的字段

自定义约束类

* 对于需要使用容器来注入依赖的约束需要添加上`@Injectable`装饰器(比如需要注入`DataSource`来访问数据库连接)
* 对于需要异步验证的约束请在`@ValidatorConstraint`中设置`async`为`true`(`name`选项随意填或者不填)，并且在`validate`方法前加上`async`
* `validate`中编写验证逻辑，其中`value`是验证字段的值，`args`是验证参数(比如`args.constraints`为验证条件数组，`args.object`为当前验证类的对象)，具体属性请查看`ValidationArguments`类型，`validate`返回一个布尔值代表是否验证成功
* `defaultMessage`方法用于定义验证失败后默认响应的错误信息，如果在验证属性上传入自定义的错误信息则会覆盖

自定义约束装饰器

* 构造一个装饰器工厂函数，其参数除了最后一项必须为`ValidationOptions`的自定义选项外，前面的参数作为验证条件数组被放入`args.constraints`中，`validationOptions`用于设置验证组和覆盖默认错误信息以及是否`each`等选项
* 工厂所返回的装饰器函数可以获取两个参数，`object`是验证类本身，通过`object.contsturctor`可获取当前验证类的实例，绑定`target`属性后会赋值给`validate`的`args.object`，`propertyName`即为当前验证属性的名称

一个自定义约束装饰器的大致代码结构如下

```
@Injectable()
@ValidatorConstraint({ name: 'Demo', async: true })
export class DemoConstraint implements ValidatorConstraintInterface {
    constructor(private dataSource: DataSource) {}

    async validate(value: any, args: ValidationArguments): Promise<boolean>

    defaultMessage(args: ValidationArguments):string {
        return `default error message`;
    }
}

export function IsDemo(...params:any[],validationOptions?: ValidationOptions) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [params],
            validator: UniqueTreeExistConstraint,
        });
    };
}

```

示例(以`IsUnique`为例)

```
// src/modules/core/constraints/unique.constraint.ts
@ValidatorConstraint({ name: 'entityItemUnique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
    constructor(private dataSource: DataSource) {}

    async validate(value: any, args: ValidationArguments) {
        // 获取要验证的模型和字段
        const config: Omit<Condition, 'entity'> = {
            property: args.property,
        };
        const condition = ('entity' in args.constraints[0]
            ? merge(config, args.constraints[0])
            : {
                  ...config,
                  entity: args.constraints[0],
              }) as unknown as Required<Condition>;
        if (!condition.entity) return false;
        try {
            // 查询是否存在数据,如果已经存在则验证失败
            const repo = this.dataSource.getRepository(condition.entity);
            return isNil(await repo.findOne({ where: { [condition.property]: value } }));
        } catch (err) {
            // 如果数据库操作异常则验证失败
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        const { entity, property } = args.constraints[0];
        const queryProperty = property ?? args.property;
        if (!(args.object as any).getManager) {
            return 'getManager function not been found!';
        }
        if (!entity) {
            return 'Model not been specified!';
        }
        return `${queryProperty} of ${entity.name} must been unique!`;
    }
}

export function IsUnique(
    params: ObjectType<any> | Condition,
    validationOptions?: ValidationOptions,
) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [params],
            validator: UniqueConstraint,
        });
    };
}
```

如果是有依赖注入的提供者约束，需要在`CoreModule`中注册

```
   // src/modules/core/core.module.ts
    public static forRoot(options?: TypeOrmModuleOptions): DynamicModule {
        // ...
        const providers: ModuleMetadata['providers'] = [
            ModelExistConstraint,
            UniqueConstraint,
            UniqueExistContraint,
            UniqueTreeConstraint,
            UniqueTreeExistConstraint,
        ];
        return {
            global: true,
            imports,
            providers,
            module: CoreModule,
        };
    }
```

### 抽象基类

为了简化代码以及后续课程中实现自定义`CRUD`库，需要编写一些基础类

#### `BaseRepository`

这是一个通用的基础存储类，在实现此类之前先添加如下类型和常量

```
// src/modules/core/constants.ts
/**
 * 排序方式
 */
export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC',
}

// src/modules/core/types.ts
/**
 * 排序类型,{字段名称: 排序方法}
 * 如果多个值则传入数组即可
 * 排序方法不设置,默认DESC
 */
export type OrderQueryType =
    | string
    | { name: string; order: `${OrderType}` }
    | Array<{ name: string; order: `${OrderType}` } | string>;

```

此类继承自自带的`Repository`类

* `queryName`属性是一个抽象属性,在子类中设置,用于在构建查询时提供默认模型的查询名称
* `orderBy`属性用于设置默认排序规则，可以通过每个方法的orderBy选项进行覆盖
* `buildBaseQuery`方法用于构建基础查询
* `getQueryName`方法用于获取`queryName`
* `getOrderByQuery`根据`orderBy`属性生成排序的querybuilder,如果传入`orderBy`则覆盖`this.orderBy`属性

```
// src/core/base/repository.ts
export abstract class BaseRepository<E extends ObjectLiteral> extends Repository<E> {
    protected abstract qbName: string;
    protected orderBy?: string | { name: string; order: `${OrderType}` };
    buildBaseQuery(): SelectQueryBuilder<E>
    getQBName()
    protected getOrderByQuery(qb: SelectQueryBuilder<E>, orderBy?: OrderQueryType): SelectQueryBuilder<E>
}

```

#### `TreeRepository`

默认的`TreeRepository`基类的方法如`findRoots`等无法在`QueryBuilder`中实现排序,自定义`query`函数等,所以创建一个继承自默认基类的新的`TreeRepository`来实现

在实现此类之前先添加如下类型

```
// src/core/types.ts
/**
 * 树形数据表查询参数
 */
export type TreeQueryParams<E extends ObjectLiteral> = FindTreeOptions & QueryParams<E>;
```

`TreeRepository`包含`BaseRepository`的`queryName`等所有属性和方法

其余属性及方法列如下

> 如果`params`中不传`orderBy`则使用`this.orderBy`属性

* `findTrees`: 重载方法，为树查询更改查询参数类型(如添加排序等)
* `findRoots`: 重载方法，为顶级查询更改查询参数类型(如添加排序和分页等)
* `findDescendants`: 重载方法，为后代列表查询更改查询参数类型(如添加排序等)
* `findDescendantsTree`:重载方法，为后代树查询更改查询参数类型(如添加排序等)
* `countDescendants`: 重载方法，为后代数量查询更改查询参数类型(如后续课程的软删除等)
* `createDtsQueryBuilder`: 为`createDescendantsQueryBuilder`添加条件参数
* `findAncestors`等祖先查询方法与后代你查询的方法类似,都是为对应的原方法添加条件查询参数
* `toFlatTrees`: 打平并展开树

```
// src/modules/core/crud/tree.repository.ts
export class BaseTreeRepository<E extends ObjectLiteral> extends TreeRepository<E> {
    protected qbName = 'treeEntity';
    protected orderBy?: string | { name: string; order: `${OrderType}` };
    constructor(target: EntityTarget<E>, manager: EntityManager, queryRunner?: QueryRunner)
    buildBaseQuery(): SelectQueryBuilder<E>
    getQBName()
    protected getOrderByQuery(qb: SelectQueryBuilder<E>, orderBy?: OrderQueryType)
    async findTrees(params: TreeQueryParams<E> = {}): Promise<E[]>
    findRoots(params: TreeQueryParams<E> = {}): Promise<E[]>
    findDescendants(entity: E, params: TreeQueryParams<E> = {}): Promise<E[]>
    async findDescendantsTree(entity: E, params: TreeQueryParams<E> = {}): Promise<E>
    countDescendants(entity: E, params: TreeQueryParams<E> = {}): Promise<number>
    createDtsQueryBuilder(
        closureTableAlias: string,
        entity: E,
        params: TreeQueryParams<E> = {},
    ): SelectQueryBuilder<E>
    findAncestors(entity: E, params: TreeQueryParams<E> = {}): Promise<E[]>
    async findAncestorsTree(entity: E, params: TreeQueryParams<E> = {}): Promise<E>
    countAncestors(entity: E, params: TreeQueryParams<E> = {}): Promise<number>
    createAtsQueryBuilder(
        closureTableAlias: string,
        entity: E,
        params: TreeQueryParams<E> = {},
    ): SelectQueryBuilder<E>
    async toFlatTrees(trees: E[], level = 0): Promise<E[]>
}
```

#### `BaseSubscriber`

这是一个基础的模型观察者，在其中添加一些属性和方法可以减少在编写观察者时的额外代码

添加一个`SubcriberSetting`类型用于设置一些必要的属性(这节课程只用于设置是否为树形模型)

```
// src/modules/core/types.ts
export type SubcriberSetting = {
    tree?: boolean;
};
```

在构造函数中根据传入的参数设置连接,并在连接中加入当前订阅者,以及构建默认的`repository`等

> 这个类比较简单，直接列出代码结构

实现如下

```
// src/core/base/subscriber.ts
@EventSubscriber()
export abstract class BaseSubscriber<E extends ObjectLiteral>
    implements EntitySubscriberInterface<E>
{
    /**
     * @description 数据库连接
     * @protected
     * @type {Connection}
     */
    protected dataSource: DataSource;

    /**
     * @description EntityManager
     * @protected
     * @type {EntityManager}
     */
    protected em!: EntityManager;

    /**
     * @description 监听的模型
     * @protected
     * @abstract
     * @type {ObjectType<E>}
     */
    protected abstract entity: ObjectType<E>;

    /**
     * @description 自定义存储类
     * @protected
     * @type {Type<SubscriberRepo<E>>}
     */
    protected repository?: SubscriberRepo<E>;

    /**
     * @description 一些相关的设置
     * @protected
     * @type {SubcriberSetting}
     */
    protected setting!: SubcriberSetting;

    constructor(dataSource: DataSource, repository?: SubscriberRepo<E>) {
        this.dataSource = dataSource;
        this.dataSource.subscribers.push(this);
        this.setRepository(repository);
        if (!this.setting) this.setting = {};
    }

    listenTo() {
        return this.entity;
    }

    async afterLoad(entity: any) {
        // 是否启用树形
        if (this.setting.tree && isNil(entity.level)) entity.level = 0;
    }

    protected setRepository(repository?: SubscriberRepo<E>) {
        this.repository = isNil(repository)
            ? this.dataSource.getRepository(this.entity)
            : repository;
    }

    /**
     * @description 判断某个属性是否被更新
     * @protected
     * @param {keyof E} cloumn
     * @param {UpdateEvent<E>} event
     */
    protected isUpdated(cloumn: keyof E, event: UpdateEvent<E>) {
        return !!event.updatedColumns.find((item) => item.propertyName === cloumn);
    }
}
```

### 修改应用

#### 模型观察者

使`CategorySubscriber`和`PostSubscriber`分别继承`BaseSubscriber`,以`CategorySubscriber`为例,如下

> `CategoryEntity`是一个树形模型,所以需要在设置中添加`tree`

```
// src/modules/content/subscribers/category.subscriber.ts
@EventSubscriber()
export class CategorySubscriber extends BaseSubscriber<CategoryEntity> {
    protected entity = CategoryEntity;

    protected setting: SubcriberSetting = {
        tree: true,
    };

    constructor(
        protected dataSource: DataSource,
        protected categoryRepository: CategoryRepository,
    ) {
        super(dataSource, categoryRepository);
    }
}
```

#### 存储类

使`CategoryRepository`和`CommentRepository`继承`BaseTreeRepository`，使`PostRepository`继承`BaseRepository`，并按需更改代码，以`CommentRepository`为例，如下

```
// src/modules/content/repositories/comment.repository.ts
@CustomRepository(CommentEntity)
export class CommentRepository extends BaseTreeRepository<CommentEntity> {
    protected qbName = 'comment';

    protected orderBy = 'createdAt';

    buildBaseQuery(): SelectQueryBuilder<CommentEntity> {
        return this.createQueryBuilder(this.qbName)
            .leftJoinAndSelect(`${this.getQBName()}.parent`, 'parent')
            .leftJoinAndSelect(`${this.qbName}.post`, 'post');
    }

    async findTrees(
        params: TreeQueryParams<CommentEntity> & { post?: string } = {},
    ): Promise<CommentEntity[]> {
        return super.findTrees({
            ...params,
            addQuery: (qb) => {
                return isNil(params.post) ? qb : qb.where('post.id = :id', { id: params.post });
            },
        });
    }
}
```

#### 添加约束

为了代码清晰，需要拆分原本的`post.dto.ts`,`category.dto.ts`以及`comment.dto.ts`等，按各自功能每个文件对应一个类，并添加上我们的自定义约束装饰器

以`CreateCategoryDto`为例

```
// 	src/modules/content/dtos/create-category.dto.ts
@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreateCategoryDto {
    @IsTreeUnique(
        { entity: CategoryEntity },
        {
            groups: ['create'],
            message: '分类名称重复',
        },
    )
    @IsTreeUniqueExist(
        { entity: CategoryEntity },
        {
            groups: ['update'],
            message: '分类名称重复',
        },
    )
    @MaxLength(25, {
        always: true,
        message: '分类名称长度不得超过$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '分类名称不得为空' })
    @IsOptional({ groups: ['update'] })
    name!: string;

    @IsModelExist(CategoryEntity, { always: true, message: '父分类不存在' })
    @IsUUID(undefined, { always: true, message: '父分类ID格式不正确' })
    @ValidateIf((value) => value.parent !== null && value.parent)
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    parent?: string;

    @Transform(({ value }) => tNumber(value))
    @IsNumber(undefined, { message: '排序必须为整数' })
    @IsOptional({ always: true })
    customOrder?: number;
}
```

最后在`dtos/index.ts`中重新导入拆分后的文件