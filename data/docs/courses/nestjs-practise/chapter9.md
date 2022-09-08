---
sidebar_label: JWT与守卫实现
sidebar_position: 10
---
# JWT与守卫实现

## 学习目标

* 使用用户模块表结构和数据操作
* 实现JWT登录与Token自动刷新
* 实现Auth守卫

## 应用编码

### 预装类库

在开始编码之前请安装以下类库

```
~ pnpm add @nestjs/passport passport passport-local @nestjs/jwt passport-jwt fastify uuid dayjs jsonwebtoken
~ pnpm add @types/passport-local @types/passport-jwt @types/jsonwebtoken @types/uuid @types/bcrypt -D
```

### 配置和工具函数

### 数据层

模型之间的关系如下

* `BaseToken`是`AccessTokenEntity`与`RefreshTokenEntity`两者的父类
* `AccessTokenEntity`与`RefreshTokenEntity`一对一关联
* `UserEntity`与`AccessTokenEntity`一对多关联
* `UserEntity`与内容模块的`PostEntity`一对多关联

#### `BaseToken`类

这是是一个抽象类，为`AccessTokenEntity`和`RefreshTokenEntity`提供公共字段

* `value`为`accessToken`或`refreshToken`的令牌值

```
export abstract class BaseToken extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 500, comment: '令牌字符串' })
    value!: string;

    @Column({
        comment: '令牌过期时间',
    })
    expired_at!: Date;

    @CreateDateColumn({
        comment: '令牌创建时间',
    })
    createdAt!: Date;
}

```

#### `AccessTokenEntity`

用户认证token模型

这个模型用于存储用户访问的令牌，供JWT策略判断用户请求中的令牌是否已经失效以及生成新的令牌

* 此模型与用户多对一关联，同时在删用户除时清空他的全部令牌
* 此模型与Token刷新模型一对一关联，同时在删除一个`accessToken`时删除其`refreshToken`

```
@Entity('user_access_tokens')
export class AccessTokenEntity extends BaseToken {
    @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.accessToken, {
        cascade: true,
    })
    refreshToken!: RefreshTokenEntity;

    @ManyToOne((type) => UserEntity, (user) => user.accessTokens, {
        onDelete: 'CASCADE',
    })
    user!: UserEntity;
}
```

#### `RefreshTokenEntity`

用户刷新token模型

添加此模型的目的在于如果用户的`accessToken`过期，那么根据他提供的`refreshToken`是否也失效来判定是否能刷新`accessToken`

```
@Entity('user_refresh_tokens')
export class RefreshTokenEntity extends BaseToken {
    @OneToOne(() => AccessTokenEntity, (accessToken) => accessToken.refreshToken, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    accessToken!: AccessTokenEntity;
}

```

#### `UserEntity`

用于存储用户数据，并与文章进行关联，同时用户数据支持软删除

```
@Entity('users')
export class UserEntity extends BaseEntity {
    // ...
    @OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user, {
        cascade: true,
    })
    accessTokens!: AccessTokenEntity[];

    @OneToMany(() => PostEntity, (post) => post.author, {
        cascade: true,
    })
    posts!: PostEntity[];
    
    @Expose()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: '删除时间',
    })
    deletedAt!: Date;

    @Expose()
    trashed!: boolean;
}
```

#### `UserRepository`

构建一个基础的`queryBuilder`查询器

```
@CustomRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
    protected qbName = 'user';

    /**
     * 构建基础Query
     *
     * @returns
     * @memberof UserRepository
     */
    buildBaseQuery() {
        return this.createQueryBuilder(this.qbName).orderBy(`${this.qbName}.createdAt`, 'DESC');
    }
}
```

#### `UserSubscriber`

> 这个订阅的作用在本节课程暂时不需要用到，后面课程会使用短信和邮箱注册用户时将会用到

此订阅者主要实现以下功能

* 在注册用户时没有填写用户名或密码的情况下，自动生成不重复的随机用户名以及随机字符串密码
* 当密码更改时加密密码

```
@EventSubscriber()
export class UserSubscriber extends BaseSubscriber<UserEntity> {
    protected entity = UserEntity;

    protected setting: SubcriberSetting = {
        trash: true,
    };

    constructor(protected dataSource: DataSource, protected userRepository: UserRepository) {
        super(dataSource, userRepository);
    }

    /**
     * 生成不重复的随机用户名
     *
     * @protected
     * @param {InsertEvent<UserEntity>} event
     * @return {*}  {Promise<string>}
     * @memberof UserSubscriber
     */
    protected async generateUserName(event: InsertEvent<UserEntity>): Promise<string> {
        const username = `user_${crypto.randomBytes(4).toString('hex').slice(0, 8)}`;
        const user = await event.manager.findOne(UserEntity, {
            where: { username },
        });
        return !user ? username : this.generateUserName(event);
    }

    /**
     * 自动生成唯一用户名和密码
     *
     * @param {InsertEvent<UserEntity>} event
     * @memberof UserSubscriber
     */
    async beforeInsert(event: InsertEvent<UserEntity>) {
        // 自动生成唯一用户名
        if (!event.entity.username) {
            event.entity.username = await this.generateUserName(event);
        }
        // 自动生成密码
        if (!event.entity.password) {
            event.entity.password = crypto.randomBytes(11).toString('hex').slice(0, 22);
        }

        // 自动加密密码
        event.entity.password = encrypt(event.entity.password);
    }

    /**
     * 当密码更改时加密密码
     *
     * @param {UpdateEvent<UserEntity>} event
     * @memberof UserSubscriber
     */
    async beforeUpdate(event: UpdateEvent<UserEntity>) {
        if (this.isUpdated('password', event)) {
            event.entity.password = encrypt(event.entity.password);
        }
    }

    protected isUpdated<E>(cloumn: keyof E, event: UpdateEvent<E>): any {
        return event.updatedColumns.find((item) => item.propertyName === cloumn);
    }
}
```

### 请求验证

注意用户登录验证的`credential`属性可以是用户名,手机号或邮箱地址

* `CredentialDto`: 对用户登录请求进行验证
* `UpdateAccountDto`: 用于对更新当前账户的请求验证
* `QueryUserDto`:对用户列表查询请求进行验证
* `CreateUserDto`:对创建用户请求进行验证
* `UpdateUserDto`: 对更新用户请求进行验证

### 服务

#### `TokenService`

这是操作令牌(`AccessToken`与`RefreshToken`)的服务

* `refreshToken`方法: 根据accessToken刷新AccessToken与RefreshToken
* `generateAccessToken`方法: 根据荷载签出新的AccessToken并存入数据库,且自动生成新的Refresh也存入数据库
* `generateRefreshToken`方法: 生成新的RefreshToken并存入数据库
* `checkAccessToken`方法: 检查accessToken是否存在
* `removeAccessToken`方法: 移除AccessToken且自动移除关联的RefreshToken
* `removeRefreshToken`方法: 移除RefreshToken且自动移除关联的AccessToken

```
@Injectable()
export class TokenService {
    private readonly config: JwtConfig;

    constructor(protected readonly jwtService: JwtService) {
        this.config = userConfig().jwt;
    }
    async refreshToken(accessToken: AccessTokenEntity, response: Response)
    async generateAccessToken(user: UserEntity, now: dayjs.Dayjs)
    async generateRefreshToken(
        accessToken: AccessTokenEntity,
        now: dayjs.Dayjs,
    ): Promise<RefreshTokenEntity>
    async checkAccessToken(value: string)
    async removeAccessToken(value: string)
    async removeRefreshToken(value: string)
}
```

#### `AuthService`

用于验证用户及配置`JwtModule`等

* `validateUser`方法: 用户登录验证
* `login`方法: 登录用户,并生成新的`accessToken`和`refreshToken`
* `logout`方法: 登出用户,并删除这次会话的`accessToken`和`refreshToken`
* `createToken`方法: 创建`accessToken`和`refreshToken`

```
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {}

    async validateUser(credential: string, password: string)
    async login(user: UserEntity)
    async logout(req: Request)
    async createToken(id: string)
    static jwtModuleFactory()
}
```

#### `UserService`

用户管理服务，此类继承`BaseService`，包含基类中的删除恢复和批量操作以及分页等方法

* `init`方法: 初始化管理员用户
* `create`方法: 新增用户
* `update`方法: 更新用户
* `findOneByCredential`方法: 根据用户名/email等用户凭证查询用户
* `findOneByCondition`方法: 根据条件对象查询用户

```
@Injectable()
export class UserService extends BaseService<UserEntity, UserRepository> {
    protected enable_trash = true;
    constructor(protected readonly userRepository: UserRepository) {
        super(userRepository);
    }
    async init()
    async create(data: CreateUserDto)
    async update(data: UpdateUserDto)
    async findOneByCredential(credential: string, callback?: QueryHook<UserEntity>)
    async findOneByCondition(condition: { [key: string]: any }, callback?: QueryHook<UserEntity>)
}

```

### 策略

策略是用于验证用户登录状态的一种方法，本节教程将基于`passport`的`passport-local`和`passport-jwt`策略去分别实现用户登录和通过已登录用户的token解析出用户ID的功能

#### `JWT策略`

`validate`方法通过荷载解析出用户ID，并把id放入request方便后续操作

```
Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    // 配置JWT策略
    constructor(private readonly userRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: userConfig().jwt.secret,
        });
    }
    async validate(payload: JwtPayload): Promise<RequestUser>
}
```

#### `Local策略`

`validate`方法通过`construct`获取的`credential`和`password`数据进行验证，而`credential`和`password`是通过请求上下文从请求数据中读取的. 最终`validate`将会返回当前登录的`user`对象传入到控制器中

```
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'credential',
            passwordField: 'password',
        });
    }

    async validate(credential: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(credential, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
```

### 守卫

#### `LocalAuthGuard`

用户登录守卫

这个守卫的默认作用在把请求数据赋值给`LocalStrategy`，以便它使用`validate`对用户进行验证，而我们添加一步处理，就是在把`request.body`赋值给`LocalStrategy`之前先对它尝试序列化为`CredentialDto`的对象，以便预检测请求的数据是否符合要求

```
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        try {
            await validateOrReject(plainToClass(CredentialDto, request.body), {
                validationError: { target: false },
            });
        } catch (errors) {
           // ...
        }
        return super.canActivate(context) as boolean;
    }
}
```

#### `JwtAuthGuard`

JWT守卫用于验证用户的登录状态

在编写之前首先需要添加一个自定义的装饰器用于判断是否允许游客请求

```
import { ALLOW_GUEST } from '@/modules/core/constants';
export const Guest = () => SetMetadata(ALLOW_GUEST, true);
```

另一个装饰器`ReqUser`则用于获取当前登录用户的信息

```
export const ReqUser = createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as ClassToPlain<UserEntity>;
});
```

`handleRequest`方法用于在`canActivate`返回`false`后响应的错误进行处理

```
    async canActivate(context: ExecutionContext) {
        const crudGuest = Reflect.getMetadata(
            ALLOW_GUEST,
            context.getClass().prototype,
            context.getHandler().name,
        );
        const defaultGuest = this.reflector.getAllAndOverride<boolean>(ALLOW_GUEST, [
            context.getHandler(),
            context.getClass(),
        ]);
        // 如果当前请求允许游客访问则
        const allowGuest = crudGuest ?? defaultGuest;
        if (allowGuest) return true;
        const request = this.getRequest(context);
        const response = this.getResponse(context);
        // 从请求头中获取token
        // 如果请求头不含有authorization字段则认证失败
        const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        if (!requestToken) return false;
        // 判断token是否存在,如果不存在则认证失败
        const accessToken = await this.tokenService.checkAccessToken(requestToken!);
        if (!accessToken) throw new UnauthorizedException();
        try {
            // 检测token是否为损坏或过期的无效状态,如果无效则尝试刷新token
            return (await super.canActivate(context)) as boolean;
        } catch (e) {
            // 尝试通过refreshToken刷新token
            // 刷新成功则给请求头更换新的token
            // 并给响应头添加新的token和refreshtoken
            const token = await this.tokenService.refreshToken(accessToken, response);
            if (!token) return false;
            if (token.accessToken) {
                request.headers.authorization = `Bearer ${token.accessToken.value}`;
            }
            // 刷新失败则再次抛出认证失败的异常
            return super.canActivate(context) as boolean;
        }
    }
     handleRequest(err: any, user: any, _info: Error) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
```

### 控制器

#### `AcountController`

用于用户账户的的操作

* `init`: 初始化管理员账户
* `login`: 登录账户
* `logout`: 登出账户
* `profile`: 读取个人信息
* `update`: 更新个人信息

```
@Controller('account')
export class AccountController {
    constructor(
        protected readonly userService: UserService,
        protected readonly authService: AuthService,
    ) {}

    @Guest()
    @Post('init')
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async init(): Promise<UserEntity>

    @Post('login')
    @Guest()
    @UseGuards(LocalAuthGuard)
    async login(@ReqUser() user: ClassToPlain<UserEntity>, @Body() _data: CredentialDto)
    
    @Post('logout')
    async logout(@Request() req: any)
    
    @Get('profile')
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async profile(@ReqUser() user: ClassToPlain<UserEntity>)
    
    @Patch()
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async update(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body()
        data: UpdateAccountDto,
    )
}
```

#### `UserController`

用于用户管理的操作，继承自`BaseController`

```
@Crud({
    id: 'user',
    enabled: [
        'list',
        { name: 'detail', option: { allowGuest: true } },
        'store',
        'update',
        'delete',
        'restore',
        'deleteMulti',
        'restoreMulti',
    ],
    dtos: {
        query: QueryUserDto,
        create: CreateUserDto,
        update: UpdateUserDto,
    },
})
@Controller('users')
export class UserController extends BaseController<UserService> {
    constructor(protected userService: UserService) {
        super(userService);
    }
}
```