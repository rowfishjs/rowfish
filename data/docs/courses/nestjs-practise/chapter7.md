---
sidebar_label: 批量操作与软删除
sidebar_position: 7
---

# 批量操作与软删除
视频地址:https://www.bilibili.com/video/BV1DP411G75n/

## 学习目标

* 实现数据的批量操作
* 实现软删除和数据恢复
* 使用软删除实现回收站功能

## 核心模块

### 常量

添加一个枚举常量用于定义软删除的查询类型，以便实现回收站功能

```
// src/modules/core/constants.ts
export enum QueryTrashMode {
    ALL = 'all', // 包含已软删除和未软删除的数据
    ONLY = 'only', // 只包含软删除的数据
    NONE = 'none', // 只包含未软删除的数据
}
```

### 类型

更改原来的查询和观察者设置类型以支持软删除

```
// src/modules/core/types.ts
/**
 * 软删除DTO接口
 */
export interface TrashedDto {
    trashed?: QueryTrashMode;
}

export interface QueryParams<E extends ObjectLiteral> {
    addQuery?: (query: SelectQueryBuilder<E>) => SelectQueryBuilder<E>;
    orderBy?: OrderQueryType;
    withTrashed?: boolean;
}

export type TreeQueryParams<E extends ObjectLiteral> = FindTreeOptions & QueryParams<E>;

export type QueryListParams<E extends ObjectLiteral> = Omit<TreeQueryParams<E>, 'withTrashed'> & {
    trashed?: `${QueryTrashMode}`;
};

export type SubcriberSetting = {
    // 监听的模型是否为树模型
    tree?: boolean;
    // 是否支持软删除
    trash?: boolean;
};
```

### 存储类

更改树形存储基类`BaseTreeRepository`中的一些查询方法以支持软删除

```
// src/modules/core/crud/tree.repository.ts
export class BaseTreeRepository<E extends ObjectLiteral> extends TreeRepository<E> {
    async findTrees(params: TreeQueryParams<E> = {}): Promise<E[]> {
        params.withTrashed = params.withTrashed ?? false;
        // ...
    }

    findRoots(params: TreeQueryParams<E> = {}): Promise<E[]> {
        // ...
        if (withTrashed) qb.withDeleted();
        return qb.getMany();
    }
    
    createDtsQueryBuilder(
        closureTableAlias: string,
        entity: E,
        params: TreeQueryParams<E> = {},
    ): SelectQueryBuilder<E> {
        // ...
        return withTrashed ? qb.withDeleted() : qb;
    }

    createAtsQueryBuilder(
        closureTableAlias: string,
        entity: E,
        params: TreeQueryParams<E> = {},
    ): SelectQueryBuilder<E> {
        // ...
        return withTrashed ? qb.withDeleted() : qb;
    }
}
```

### 订阅者

修改`BaseSubscriber`的`afterLoad`方法，为每个支持软删除的模型的`trashed`只是值为前端作为判断是否处于回收站状态的依据

```
// src/modules/core/crud/subscriber.ts
@EventSubscriber()
export abstract class BaseSubscriber<E extends ObjectLiteral>
    implements EntitySubscriberInterface<E>
{
    // ...

    async afterLoad(entity: any) {
        // 是否启用树形
        if (this.setting.tree && isNil(entity.level)) entity.level = 0;
        // 是否启用软删除
        if (this.setting.trash) entity.trashed = !!entity.deletedAt;
    }
}
```

### DTO

添加几个公共的DTO用于支持控制器的批量删除，批量恢复，单个删除和单个查询实现软删除功能

```
// // src/modules/core/crud/dtos
@Injectable()
export class QueryDetailDto {
    @Transform(({ value }) => tBoolean(value))
    @IsBoolean()
    @IsOptional()
    trashed?: boolean;  // 在查询单个数据时，是否包含软删除后的数据
}

@DtoValidation()
export class DeleteDto {
    @Transform(({ value }) => tBoolean(value))
    @IsBoolean()
    @IsOptional()
    trash?: boolean;    // 在删除数据时是否软删除
}

export class DeleteMultiDto extends DeleteDto {
    @IsUUID(undefined, {
        each: true,
        message: 'ID格式错误',
    })
    @IsDefined({
        each: true,
        message: 'ID必须指定',
    })
    items: string[] = [];  // 批量删除数据的ID列表
}

export class DeleteRestoreDto {
    @IsUUID(undefined, {
        each: true,
        message: 'ID格式错误',
    })
    @IsDefined({
        each: true,
        message: 'ID必须指定',
    })
    items: string[] = [];  // 批量恢复数据的ID列表
}
```

## 内容模块

### 模型

为需要支持软删除的模型(`CategoryEntity`和`PostEntity`)添加上`deletedAt`和`trashed`字段以支持软删除

以`CategoryEntity`为例

```
// src/modules/content/entities/category.entity.ts
@Exclude()
@Tree('materialized-path')
@Entity('content_categories')
export class CategoryEntity extends BaseEntity {
    // ...

    @Expose()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: '创建时间',
    })
    deletedAt!: Date;

    @Expose()
    trashed!: boolean;
}
```

### 观察者

为`CategorySubscriber`和`PostSubscriber`的`setting`属性添加上`trash: true`

### DTO

修改`QueryCategoryDTO`和`QueryPostDto`以支持软删除，添加`DeleteCommentMultiDto `以支持评论的批量删除

> 因为评论不需要软删除，所以没有使用前面在核心模块中添加的`DeleteMultiDto`

```
// src/modules/content/dtos
@DtoValidation({ type: 'query' })
export class QueryCategoryDto implements PaginateDto, TrashedDto {
    // ...

    @IsEnum(QueryTrashMode)
    @IsOptional()
    trashed?: QueryTrashMode;
}

@DtoValidation({ type: 'query' })
export class QueryPostDto implements PaginateDto, TrashedDto {
    //...
    
    @IsEnum(QueryTrashMode)
    @IsOptional()
    trashed?: QueryTrashMode;
}

@DtoValidation()
export class DeleteCommentMultiDto {
    @IsUUID(undefined, {
        each: true,
        message: '评论ID格式错误',
        groups: ['delete-multi'],
    })
    @IsDefined({
        each: true,
        groups: ['delete-multi'],
        message: '评论ID必须指定',
    })
    items: string[] = [];
}
```

### 服务类

为`CategoryService`和`PostService`添加上以下函数功能

* 支持软删除
* 支持批量删除
* 支持软删除后恢复
* 支持软删除后批量恢复
* 支持查询树或列表数据时可查询回收站(软删除后)的数据，正常数据，全部数据(包含软删除)
* 支持查询单条数据时可以包含软删除处于软删除状态中的数据
* 分类软删除时与硬删除一样直接把其子分类的`parent`设置成`null`，同时其自身的`parent`也设置成`null`

为`CommentService`添加批量删除方法

以`PostService`为例

```
// src/modules/content/services/post.service.ts
protected async buildListQuery(
        queryBuilder: SelectQueryBuilder<PostEntity>,
        options: FindParams,
        callback?: QueryHook<PostEntity>,
    ) {
        // ...
        const { trashed } = options;
        // 是否查询回收站
        if (trashed === QueryTrashMode.ALL || trashed === QueryTrashMode.ONLY) {
            qb.withDeleted();
            if (trashed === QueryTrashMode.ONLY) {
                qb.where(`${queryName}.deletedAt = :deleted`, { deleted: Not(IsNull()) });
            }
        }
        if (callback) return callback(qb);
        return qb;
}

async detail(id: string, trashed?: boolean, callback?: QueryHook<PostEntity>) {
       // ...
        if (trashed) qb.withDeleted();
        const item = await qb.getOne();
        if (!item)
            throw new NotFoundException(`${this.postRepository.getQBName()} ${id} not exists!`);
        return item;
}

 async delete(id: string, trash = true) {
        const item = await this.postRepository.findOneOrFail({
            where: { id } as any,
            withDeleted: true,
        });
        if (trash && isNil(item.deletedAt)) {
            // await this.repository.softRemove(item);
            (item as any).deletedAt = new Date();
            await (this.postRepository as any).save(item);
            return this.detail(id, true);
        }
        return this.postRepository.remove(item);
    }

    /**
     * 批量删除文章
     */
    async deleteList(
        data: string[],
        params?: FindParams,
        trash?: boolean,
        callback?: QueryHook<PostEntity>,
    ) {
        const isTrash = trash === undefined ? true : trash;
        for (const id of data) {
            await this.delete(id, isTrash);
        }
        return this.list(params, callback);
    }

    /**
     * 批量删除文章(分页)
     */
    async deletePaginate(
        data: string[],
        options: PaginateDto & FindParams,
        trash?: boolean,
        callback?: QueryHook<PostEntity>,
    ) {
        const isTrash = trash === undefined ? true : trash;
        for (const id of data) {
            await this.delete(id, isTrash);
        }
        return this.paginate(options, callback);
    }

    /**
     * 恢复回收站中的文章
     */
    async restore(id: string, callback?: QueryHook<PostEntity>) {
        const item = await this.postRepository.findOneOrFail({
            where: { id },
            withDeleted: true,
        });
        if (item.deletedAt) {
            await this.postRepository.restore(item.id);
        }
        return this.detail(item.id, false, callback);
    }

    /**
     * 批量恢复回收站中的文章
     */
    async restoreList(data: string[], params?: FindParams, callback?: QueryHook<PostEntity>) {
        for (const id of data) {
            await this.restore(id);
        }
        return this.list(params, callback);
    }

    /**
     * 批量恢复回收站中的数据(分页)
     */
    async restorePaginate(
        data: string[],
        options: PaginateDto & FindParams,
        callback?: QueryHook<PostEntity>,
    ) {
        for (const id of data) {
            await this.restore(id);
        }
        return this.paginate(options, callback);
    }
```

### 控制器

最后修改控制器中的详情查询，删除的DTO，并添加批量删除，恢复和批量恢复方法

以`PostController`为例

```

// src/modules/content/controllers/post.controller.ts
@Controller('posts')
export class PostController {
    // ...

    @Get(':item')
    async detail(
        @Query() { trashed }: QueryDetailDto,
        @Param('item', new ParseUUIDPipe())
        item: string,
    ) {
        return this.postService.detail(item, trashed);
    }

    @Delete(':item')
    async delete(
        @Param('item', new ParseUUIDPipe())
        item: string,
        @Body()
        { trash }: DeleteDto,
    ) {
        return this.postService.delete(item, trash);
    }

    @Delete()
    async deleteMulti(
        @Query()
        options: QueryPostDto,
        @Body()
        { trash, items }: DeleteMultiDto,
    ) {
        return this.postService.deletePaginate(items, options, trash);
    }

    @Patch('restore/:item')
    async restore(
        @Param('item', new ParseUUIDPipe())
        item: string,
    ) {
        return this.postService.restore(item);
    }

    @Patch('restore')
    async restoreMulti(
        @Query()
        options: QueryPostDto,
        @Body()
        { items }: DeleteRestoreDto,
    ) {
        return this.postService.restorePaginate(items, options);
    }
}
```