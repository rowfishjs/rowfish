---
sidebar_label: 模型关联与树形嵌套
sidebar_position: 4
---

# 模型关联与树形嵌套

视频地址: [https://www.bilibili.com/video/BV1Ha411Q7iu?share_source=copy_web&vd_source=00f2b7e5f03bd39b4d8c477ef0bd8b1b](https://www.bilibili.com/video/BV1Ha411Q7iu?share_source=copy_web&vd_source=00f2b7e5f03bd39b4d8c477ef0bd8b1b)

[nestjs]: https://docs.nestjs.com/	"nestjs"

## 学习目标

这次教程在上一节的基础上实现一个简单的CMS系统,实现如下功能

- 文章与分类多对多关联
- 文章与评论一对多关联
- 分类与评论的树形无限级嵌套

##  文件结构

这次的更改集中于`ContentModule`模块,编写好之后的目录结构如下

```shell
src/modules/content
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
└── services
    ├── category.service.ts
    ├── comment.service.ts
    ├── index.ts
    └── post.service.ts
```

```shell
cd src/modules/content && \
touch controllers/category.controller.ts \
controllers/comment.controller.ts \
dtos/create-category.dto.ts \
dtos/create-comment.dto.ts \
dtos/update-category.dto.ts \
entities/category.entity.ts \
entities/comment.entity.ts \
repositories/category.repository.ts \
services/category.service.ts \
services/comment.service.ts \
&& cd ../../../
```

## 应用编码

编码流程与上一节一样,entity->repository->dto->service->controller,最后注册

### 模型类

#### 模型关联

分别创建分类模型(`CategoryEntity`)和评论模型(`CommentEntity`),并和`PostEntity`进行[关联](https://typeorm.io/#/relations)

分类模型

```typescript
// src/modules/content/entities/category.entity.ts
@Entity('content_categories')
export class CategoryEntity extends BaseEntity {
  ...
    // 分类与文章多对多关联
    @ManyToMany((type) => PostEntity, (post) => post.categories)
    posts!: PostEntity[];
}
```

评论模型

```typescript
// src/modules/content/entities/comment.entity.ts
@Entity('content_comments')
export class CommentEntity extends BaseEntity {
  ...
   // 评论与文章多对一,并触发`CASCADE`
    @ManyToOne(() => PostEntity, (post) => post.comments, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    post!: PostEntity;
}
```

文章模型

```typescript
@Entity('content_posts')
export class PostEntity extends BaseEntity {
    // 评论数量
    // 虚拟字段,在Repository中通过QueryBuilder设置
    commentCount!: number;

    // 文章与分类反向多对多关联
    @ManyToMany((type) => CategoryEntity, (category) => category.posts, {
        cascade: true,
    })
    @JoinTable()
    categories!: CategoryEntity[];
    // 文章与评论一对多关联
    @OneToMany(() => CommentEntity, (comment) => comment.post, {
        cascade: true,
    })
    comments!: CommentEntity[];
}
```

#### 树形嵌套

评论模型与分类模型的树形嵌套实现基本一致,唯一的区别在于在删除父分类时子分类不会删除而是提升为顶级分类,而删除评论则连带删除其后代评论

> [typeorm](https://typeorm.io/#/tree-entities)有三种方案实现树形嵌套模型,我们使用综合来说最好用的一种,即物理路径(Materialized Path),原因在于Adjacency list的缺点是无法一次加载整个树,而closure则无法自动触发`Cascade`

```typescript
// src/modules/content/entities/category.entity.ts
@Entity('content_categories')
// 物理路径嵌套树需要使用`@Tree`装饰器并以'materialized-path'作为参数传入
@Tree('materialized-path')
export class CategoryEntity extends BaseEntity {
  ...
    // 子分类
    @TreeChildren({ cascade: true })
    children!: CategoryEntity[];
    // 父分类
    @TreeParent({ onDelete: 'SET NULL' })
    parent?: CategoryEntity | null;
}
    
// src/modules/content/entities/comment.entity.ts
@Entity('content_comments')
@Tree('materialized-path')
export class CommentEntity extends BaseEntity {
    ...
    @TreeChildren({ cascade: true })
    children!: CommentEntity[];
    @TreeParent({ onDelete: 'CASCADE' })
    parent?: CommentEntity | null;
}

```

### 存储类

创建一个空的`CategoryRepository`用于操作`CategoryEntity`模型

**注意**:树形的存储类必须通过`getTreeRepository`获取或者通过`getCustomRepository`加载一个继承自`TreeRepository`的类来获取

在[nestjs][]中注入树形模型的存储库使用以下方法

- 使用该模型的存储库类是继承自`TreeRepository`类的自定义类,则直接注入即可
- 如果没有存储库类就需要在注入的使用`TreeRepository<Entity>`作为类型提示

> 为了简单,`CommentRepository`暂时不需要创建,直接注入服务即可

```typescript
// src/modules/content/repositories/category.repository.ts
@EntityRepository(CategoryEntity)
export class CategoryRepository extends TreeRepository<CategoryEntity> {}
```

修改`PostRepository`添加`buildBaseQuery`用于服务查询,代码如下

```typescript
// src/modules/content/repositories/post.repository.ts
buildBaseQuery() {
        return this.createQueryBuilder('post')
            // 加入分类关联
            .leftJoinAndSelect('post.categories', 'categories')
            // 建立子查询用于查询评论数量
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(c.id)', 'count')
                    .from(CommentEntity, 'c')
                    .where('c.post.id = post.id');
            }, 'commentCount')
            // 把评论数量赋值给虚拟字段commentCount
            .loadRelationCountAndMap('post.commentCount', 'post.comments');
    }
```

### DTO验证

DTO类与前面的`CreatePostDto`和`UpdatePostDto`写法是一样的

> 评论无需更新所以没有`update`的DTO

- `create-category.dto.ts`用于新建分类
- `update-category.dto.ts`用于更新分类
- `create-comment.dto.ts`用于添加评论

在代码中可以看到我这里对分类和评论的DTO添加了一个`parent`字段用于在创建和更新时设置他们的父级

` @Transform`装饰器是用于转换数据的,基于`class-transformer`这个类库实现,此处的作用在于把请求中传入的值为`null`字符串的`parent`的值转换成真实的`null`类型

`@ValidateIf`的作用在于**只在请求的`parent`字段不为`null`且存在值的时候进行验证**,这样做的目的在于如果在更新时设置`parent`为`null`把当前分类设置为顶级分类,如果不传值则不改变

```typescript
// src/modules/content/dtos/create-category.dto.ts
    @IsUUID(undefined, { always: true, message: '父分类ID格式不正确' })
    @ValidateIf((p) => p.parent !== null && p.parent)
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    parent?: string;
```

在`CreatePostDto`中添加分类IDS验证

```typescript
// src/modules/content/dtos/create-post.dto.ts
   @IsUUID(undefined, { each: true, always: true, message: '分类ID格式错误' })
   @IsOptional({ always: true })
   categories?: string[];
```

在`CreateCommentDto`中添加一个文章ID验证

```typescript
// src/modules/content/dtos/create-comment.dto.ts
    @IsUUID(undefined, { message: '文章ID格式错误' })
    @IsDefined({ message: '评论文章ID必须指定' })
    post!: string;
```

### 服务类

#### `Category/Comment`

服务的编写基本与`PostService`一致,我们新增了以下几个服务

- `CategoryService`用于分类操作
- `CommentService`用于评论操作

分类服务通过`TreeRepository`自带的`findTrees`方法可直接查询出树形结构的数据,但是此方法无法添加查询条件和排序等,所以后续章节我们需要自己添加这些

```typescript
// src/modules/content/services/category.service.ts
export class CategoryService {
    constructor(
        private entityManager: EntityManager,
        private categoryRepository: CategoryRepository,
    ) {}

    async findTrees() {
        return this.categoryRepository.findTrees();
    }
    ...
```

`getParent`方法用于根据请求的`parent`字段的`ID`值获取分类和评论下的父级

```typescript
protected async getParent(id?: string) {
        let parent: CommentEntity | undefined;
        if (id !== undefined) {
            if (id === null) return null;
            parent = await this.commentRepository.findOne(id);
            if (!parent) {
                throw new NotFoundException(`Parent comment ${id} not exists!`);
            }
        }
        return parent;
    }
```

#### `PostService`

现在为了读取和操作文章与分类和评论的关联,使用`QueryBuilder`来构建查询器

在此之前,在`core/types`(新增)中定义一个用于额外传入查询回调参数的方法类型

```typescript
// src/core/types.ts

/**
 * 为query添加查询的回调函数接口
 */
export type QueryHook<Entity> = (
    hookQuery: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>;
```

`PostService`更改

> 对于评论的嵌套展示在后续教程会重新定义一个新的专用接口来实现

- `create`时通过`findByIds`为新增文章出查询关联的分类
- `update`时通过`addAndRemove`更新文章关联的分类
- 查询时通过`.buildBaseQuery().leftJoinAndSelect`为文章数据添加上关联的评论

### 控制器

新增两个控制器,分别用于处理分类和评论的请求操作

#### `CategoryContoller`

方法与`PostController`一样,`index`,`show`,`store`,`update`,`destory`

暂时直接用`findTrees`查询出树形列表即可

```typescript
export class CategoryController {
  ...
    @Get()
    async index() {
        return this.categoryService.findTrees();
    }
}
```

#### `CommentController`

目前评论控制器只有两个方法`store`和`destory`,分别用于新增和删除评论

### 注册代码

分别在`entities`,`repositories`,`dtos`,`services`,`controllers`等目录的`index.ts`文件中导出新增代码以给`ContentModule`进行注册

```typescript
const entities = Object.values(EntityMaps);
const repositories = Object.values(RepositoryMaps);
const dtos = Object.values(DtoMaps);
const services = Object.values(ServiceMaps);
const controllers = Object.values(ControllerMaps);
@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
        // 注册自定义Repository
        CoreModule.forRepository(repositories),
    ],
    controllers,
    providers: [...dtos, ...services],
    exports: [
        // 导出自定义Repository,以供其它模块使用
        CoreModule.forRepository(repositories),
        ...services,
    ],
})
export class ContentModule {}
```

