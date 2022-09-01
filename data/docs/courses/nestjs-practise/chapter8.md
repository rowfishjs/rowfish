---
sidebar_label: CRUD抽象化框架构建
sidebar_position: 9
---

# CRUD抽象化框架构建
视频地址:https://www.bilibili.com/video/BV1pG4y167cV/

# CRUD抽象化框架构建

查看上一节的代码我们会发现有很多重复性的CRUD方法在复制粘贴，比如`CategoryService`与`PostService`，`CategoryController`与`PostController`等。所以本节的目标是对这些CRUD类进行抽象化

* 实现CRUD的Service基类
* 实现CRUD的Controller基类

## 核心模块

### 服务基类

* `repository`属性为默认的存储类，通过子类的`constructor`注入来赋值，必须继承自`BaseRepository`或`BaseTreeRepository`
* `enabl_trash`属性用于确定是否包含软删除操作
* `list`用于获取数据列表
* `paginate`用于获取分页数据
* `detail`用于获取数据详情
* `creatte`用于创建数据（注意：此方法由子类实现，子类不实现则调用时抛出403
* `update`方法与`create`一样由子类实现
* `delete`用于删除单条数据
* `deleteList`用于批量删除数据
* `deletePaginate`与`deleteList`的区别在于删除数据后返回的列表是分页数据
* `restore`,`restoreList`,`restorePaginate`用于恢复数据，返回的列表与删除雷同
* `buildItemQuery`用于构建单条数据的查询器
* `buildListQuery`用于构建数据列表的查询器

```
// src/modules/core/crud/service.ts
export abstract class BaseService<
    E extends ObjectLiteral,
    R extends BaseRepository<E> | BaseTreeRepository<E>,
    P extends QueryListParams<E> = QueryListParams<E>,
    M extends IPaginationMeta = IPaginationMeta,
> {
    protected repository: R;
    protected enable_trash = false;

    constructor(repository: R) {
        this.repository = repository;
        if (
            !(
                this.repository instanceof BaseRepository ||
                this.repository instanceof BaseTreeRepository
            )
        ) {
            throw new Error(
                'Repository must instance of BaseRepository or BaseTreeRepository in DataService!',
            );
        }
    }

    async list(params?: P, callback?: QueryHook<E>): Promise<E[]>

    async paginate(
        options: PaginateDto<M> & P,
        callback?: QueryHook<E>,
    ): Promise<Pagination<E, M>>


    async detail(id: string, trashed?: boolean, callback?: QueryHook<E>): Promise<E>

 
    create(data: any): Promise<E>

   
    update(data: any): Promise<E> 

    async delete(id: string, trash = true)

    async deleteList(data: string[], params?: P, trash?: boolean, callback?: QueryHook<E>)
   
    async deletePaginate(
        data: string[],
        options: PaginateDto<M> & P,
        trash?: boolean,
        callback?: QueryHook<E>,
    )
  
    async restore(id: string, callback?: QueryHook<E>)

    async restoreList(data: string[], params?: P, callback?: QueryHook<E>)

    async restorePaginate(data: string[], options: PaginateDto<M> & P, callback?: QueryHook<E>)

    protected async buildItemQuery(query: SelectQueryBuilder<E>, callback?: QueryHook<E>)

    protected async buildListQuery(qb: SelectQueryBuilder<E>, options: P, callback?: QueryHook<E>)
}

```

### 控制器

控制器基类

```
// src/modules/core/crud/controller.ts
export abstract class BaseController<
    S,
    P extends QueryListParams<any> = QueryListParams<any>,
    M extends IPaginationMeta = IPaginationMeta,
> {
    protected service: S;

    constructor(service: S) {
        this.setService(service);
    }

    private setService(service: S) {
        this.service = service;
    }

    @Get()
    async list(@Query() options: PaginateDto<M> & P & TrashedDto, ...args: any[]) {
        return (this.service as any).paginate(options);
    }

    @Get(':item')
    async detail(
        @Query() { trashed }: QueryDetailDto,
        @Param('item', new ParseUUIDPipe())
        item: string,
        ...args: any[]
    ) {
        return (this.service as any).detail(item, trashed);
    }

    @Post()
    async store(
        @Body()
        data: any,
        ...args: any[]
    ) {
        return (this.service as any).create(data);
    }

    @Patch()
    async update(
        @Body()
        data: any,
        ...args: any[]
    ) {
        return (this.service as any).update(data);
    }

    @Delete(':item')
    async delete(
        @Param('item', new ParseUUIDPipe())
        item: string,
        @Body()
        { trash }: DeleteDto,
        ...args: any[]
    ) {
        return (this.service as any).delete(item, trash);
    }

    @Delete()
    async deleteMulti(
        @Query()
        options: PaginateDto<M> & TrashedDto & P,
        @Body()
        { trash, items }: DeleteMultiDto,
        ...args: any[]
    ) {
        return (this.service as any).deletePaginate(items, options, trash);
    }

    @Patch('restore/:item')
    async restore(
        @Param('item', new ParseUUIDPipe())
        item: string,
        ...args: any[]
    ) {
        return (this.service as any).restore(item);
    }

    @Patch('restore')
    async restoreMulti(
        @Query()
        options: PaginateDto<M> & TrashedDto & P,
        @Body()
        { items }: DeleteRestoreDto,
        ...args: any[]
    ) {
        return (this.service as any).restorePaginate(items, options);
    }
}

```

由于控制器的方法和参数中用到一些装饰器，比如绑定DTO的`@Query`，序列化数据的`@SerializeOptions`等等，所以新增一个装饰器，并使用metadata来存储传入这些装饰器的数据

我们把这个命名为`Crud`，其作用如下

* 为控制器的方法添加上`DTO`类
* 为方法的响应添加上序列化选项
* 对于没有在`enabled`启用的方法抛出`404`

在编写装饰器之前需要先定义一下要用到的类型

```
// src/modules/core/types.ts

/**
 * CURD控制器方法列表
 */
export type CurdMethod =
    | 'detail'
    | 'delete'
    | 'restore'
    | 'list'
    | 'store'
    | 'update'
    | 'deleteMulti'
    | 'restoreMulti';

/**
 * CRUD装饰器的方法选项
 */
export interface CrudMethodOption {
    /**
     * 该方法是否允许匿名访问
     */
    allowGuest?: boolean;
    /**
     * 序列化选项,如果为`noGroup`则不传参数，否则根据`id`+方法匹配来传参
     */
    serialize?: ClassTransformOptions | 'noGroup';
}
/**
 * 每个启用方法的配置
 */
export interface CurdItem {
    name: CurdMethod;
    option?: CrudMethodOption;
}

/**
 * CRUD装饰器选项
 */
export interface CurdOptions {
    id: string;
    // 需要启用的方法
    enabled: Array<CurdMethod | CurdItem>;
    // 一些方法要使用到的自定义DTO
    dtos: {
        [key in 'query' | 'create' | 'update']?: Type<any>;
    };
}

```

装饰器代码

```
// src/modules/core/decorators/crud.decorator.ts
export const Crud =
    (options: CurdOptions) =>
    <T extends BaseController<any>>(Target: Type<T>) => {
        Reflect.defineMetadata(CRUD_OPTIONS, options, Target);
        const { id, enabled, dtos } = Reflect.getMetadata(CRUD_OPTIONS, Target) as CurdOptions;
        const changed: Array<CurdMethod> = [];
        // 添加验证DTO类
        for (const value of enabled) {
           // 添加验证DTO类
        }
        for (const key of changed) {
             // 添加序列化选项以及是否允许匿名访问等metadata
        }
        
        const fixedProperties = ['constructor', 'service', 'setService'];
        for (const key of Object.getOwnPropertyNames(BaseController.prototype)) {
            // 对于不启用的方法返回404
        }
        return Target;
    };
```

## 内容模块

现在更改一下内容模块中的服务类和控制器即可，代码会变得异常简洁，以`CategoryService`和`CategoryController`为例

```
// src/modules/content/services/category.service.ts
@Injectable()
export class CategoryService extends BaseService<CategoryEntity, CategoryRepository> {
    constructor(protected categoryRepository: CategoryRepository) {
        super(categoryRepository);
    }

    protected enable_trash = true;

    async findTrees() {
        return this.repository.findTrees();
    }

    async create(data: CreateCategoryDto) {
       // ...
    }

    async update(data: UpdateCategoryDto) {
       // ...
    }

    protected async getParent(id?: string) {
        // ...
    }
}

// src/modules/content/controllers/category.controller.ts
@Crud({
    id: 'category',
    enabled: [
        'list',
        'detail',
        'store',
        'update',
        'delete',
        'restore',
        'deleteMulti',
        'restoreMulti',
    ],
    dtos: {
        query: QueryCategoryDto,
        create: CreateCategoryDto,
        update: UpdateCategoryDto,
    },
})
@Controller('categories')
export class CategoryController extends BaseController<CategoryService> {
    constructor(protected categoryService: CategoryService) {
        super(categoryService);
    }

    @Get('tree')
    @SerializeOptions({ groups: ['category-tree'] })
    async index() {
        this.service;
        return this.service.findTrees();
    }
}
```