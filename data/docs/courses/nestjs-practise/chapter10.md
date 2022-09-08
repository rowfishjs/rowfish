---
sidebar_label: 使用BullMQ实现异步验证短信与邮件发送
sidebar_position: 11
---

# 使用BullMQ实现异步验证短信与邮件发送

## 学习目标

* 使用BullMQ+Redis构建消息队列
* 使用腾讯云SDK通过队列异步发送短信
* 使用Nodemailer通过队列异步发送邮件
* 使用email-templates制作邮件模板并整合Nodemailer

## 应用编码

### 预装类库

在开始编码之前请安装以下类库

```shell
~ pnpm add @nestjs/bullmq bullmq chalk@^4.1.2 dotenv email-templates find-up@5 nodemailer tencentcloud-sdk-nodejs
~ pnpm add @types/nodemailer @types/email-templates -D
```

## 文件结构

把原来的`src/core/helpers.ts`抽出来放到`src/helpers`目录中，否则会因为循环引用导致我们后面的`env`函数无法使用

创建一个`assets`目录用于存放静态文件，我们这节课只用来存放邮件模板

新的文件结构如下

```shell
src
├── app.module.ts
├── assets
│   └── emails  # 邮件模板
│       ├── registration
│       └── reset-password
├── config
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── index.ts
│   ├── queue.config.ts # bullmq消息队列配置
│   ├── sms.config.ts # 短信发送配置
│   ├── smtp.config.ts # smtp邮件发送配置
│   └── user.config.ts
├── helpers # 辅助函数集合
│   ├── constants.ts # 函数常量
│   ├── data.ts # 数据类函数
│   ├── env.ts # 环境类函数
│   ├── index.ts
│   ├── time.ts # 时间函数
│   ├── types.ts # 函数类型
│   └── utils.ts # 工具类函数
├── main.ts
└── modules
    ├── content
    ├── core
    └── user
```

核心模块

```shell
src/modules/core
├── constants.ts
├── constraints
├── core.module.ts
├── crud
├── decorators
├── filters
├── providers
├── services
│   ├── index.ts
│   ├── sms.service.ts  # 短信发送提供者
│   └── smtp.service.ts # 邮件发送提供者
└── types.ts
```

用户模块

```shell
src/modules/user
├── constants.ts
├── controllers
│   ├── account.controller.ts # 已登录账户操作
│   ├── auth.controller.ts # 未登录用户的Auth操作
│   ├── captcha.controller.ts # 验证码操作
│   ├── index.ts
│   └── user.controller.ts # 用户管理操作
├── decorators
├── dtos
│   ├── account.dto.ts # 已登录账户操作请求验证
│   ├── auth.dto.ts # 未登录用户的Auth操作请求验证
│   ├── captcha.dto.ts # 验证码类操作的请求验证
│   ├── guest.dto.ts # 基础验证类
│   ├── index.ts
│   └── manage.dto.ts # 用户管理操作的请求验证
├── entities
├── guards
├── helpers.ts
├── repositories
├── services
│   ├── ...
│   ├── captcha # 消息队列服务
│   │   ├── queue.service.ts # 添加队列和任务以及初始化消费者
│   │   └── worker.service.ts # 执行任务
│   ├── index.ts
├── strategies
├── subscribers
├── types.ts
└── user.module.ts
```

## 核心编码

### 更改CLI设置

为了在编译后能复制邮件模板到`dist`目录，需要更改一下`nest-cli.json`文件

```json
{
    "$schema": "https://json.schemastore.org/nest-cli",
    "collection": "@nestjs/schematics",
    "sourceRoot": "src",
    "deleteOutDir": true,
    "assets": ["assets"],
    "watchAssets": true
}

```

### 辅助函数

新增一个`src/helpers`目录

在目录中新增`types.ts`和`constants.ts`文件分别用于放置辅助函数的类型和常量，把原来的Core模块中的以下类型和常量给抽出来放置

```typescript
// src/helpers/types.ts
export interface TimeOptions
export type OrderQueryType
export interface PaginateDto

// src/helpers/constants.ts
export enum EnvironmentType
export enum OrderType
```

把原来`src/core/helpers.ts`中的函数搬出来放到新增目录中并按各自功能区分，分别放在`data.ts`,`time.ts`,`utils.ts`,`env.ts`中，并新增一个`deepMerge`函数用于深度合并对象,如下

```typescript
// src/helpers/utils.ts
export function tNumber(value?: string | number): string | number | undefined
export function tBoolean(value?: string | boolean): string | boolean | undefined
export function tNull(value?: string | null): string | null | undefined 

/**
 * 深度合并对象
 * @param x 初始值
 * @param y 新值
 * @param arrayMode 对于数组采取的策略,`replace`为直接替换,`merge`为合并数组
 */
export const deepMerge = <T1, T2>((
    x: Partial<T1>,
    y: Partial<T2>,
    arrayMode: 'replace' | 'merge' = 'merge',
) => { ... }

// src/helpers/time.ts
import { TimeOptions } from './types';
export const getTime = (options?: TimeOptions) => {
};

// src/helpers/data.ts
import { OrderQueryType, PaginateDto } from './types';
export function manualPaginate<T extends ObjectLiteral>
export const getOrderByQuery = <E extends ObjectLiteral>

// src/helpers/env.ts
import { EnvironmentType } from './constants';
export const setRunEnv
export const getRunEnv = (): EnvironmentType
```

在`env.ts`中增加以下函数

```typescript
/**
 * 加载.env{.当前环境}文件并合并到process.env
 */
export function loadEnvs() {
    // ...
}

/**
 * 获取环境变量
 * @param key 变量名
 * @param parseTo 转义函数
 * @param defaultValue 默认值
 */
export function env<T extends BaseType = string>(
    key?: string,
    parseTo?: ParseType<T> | T,
    defaultValue?: T,
) {
    // ...
}
```

添加一个`src/modules/user/helpers.ts`文件，把`encrypt`和`decrypt`迁移到这里

```typescript
/**
 * 加密明文密码
 * @param password
 */
export const encrypt = (password: string) => {
    return bcrypt.hashSync(password, userConfig().hash);
};

/**
 * 验证密码
 * @param password
 * @param hashed
 */
export const decrypt = (password: string, hashed: string) => {
    return bcrypt.compareSync(password, hashed);
};

```

最后删除`src/modules/core/helpers.ts`文件

#### 修改应用

把所有因为路径更改而标红的错误给修复，同时把`setRunEnv`从`src/main.ts`移动到`src/config/index.ts`顶部，并在后面加上`loadEnvs`

> 这样就能提前加载当前的环境变量文件以备在配置中使用

```typescript
// src/config/index.ts
import { loadEnvs, setRunEnv } from '@/helpers';

setRunEnv();
loadEnvs();

export * from './app.config';
export * from './database.config';
export * from './user.config';
```

新增一个`.env`或者`.env.development`文件用于存放环境变量(需要在`.gitignore`中排除)写进你的配置，同时新增一个`env.example`来设置配置模板，如下

```shell
# env.example

DB_PASSWORD=123456
SMTP_HOST=smtp.qq.com
SMTP_USER=pincman@qq.com
SMTP_PASSWORD=xxx
SMTP_SSL=true
SMTP_FROM=pincman<pincman@qq.com>
SMS_QCLOUD_ID=xxx
SMS_QCLOUD_KEY=xxx
SMS_LOGIN_CAPTCHA_QCLOUD=896643
SMS_REGISTER_CAPTCHA_QCLOUD=776692
SMS_RETRIEVEPASSWORD_CAPTCHA_QCLOUD=891841
```

把传入`CoreModule`的配置全部改成函数执行以方便读取环境变量

```typescript
// src/modules/core/types.ts

/**
 * core模块参数选项
 */
export interface CoreOptions {
    database?: () => TypeOrmModuleOptions;
}

// src/modules/core/core.module.ts
public static forRoot(options: CoreOptions = {}): DynamicModule {
        const imports: ModuleMetadata['imports'] = [];
        if (options.database) imports.push(TypeOrmModule.forRoot(options.database()));
    ...

// src/app.module.ts
@Module({
    imports: [CoreModule.forRoot({ database }), UserModule, ContentModule],
})
export class AppModule {}
```

### 短信发送

#### 类型

新增两个类型设置腾讯云短信驱动配置和发送接口参数并在`CoreOptions`类型中加上`sms`

```typescript
// src/modules/core/types.ts

/**
 * core模块参数选项
 */
export interface CoreOptions {
    database?: () => TypeOrmModuleOptions;
    sms?: () => SmsOptions;
}

/**
 * 腾讯云短信驱动配置
 */
export type SmsOptions<T extends NestedRecord = RecordNever> = {
    ...
} & T;

/**
 * 发送接口参数
 */
export interface SmsSendParams {
    ...
}
```

#### 驱动配置

新增一个SMS的驱动配置文件

> 别忘了在`src/config/index.ts`中导出

```typescript
// src/config/sms.config.ts
export const sms: () => SmsOptions = () => ({
    sign: env('SMS_QCLOUD_SING', '极客科技'),
    region: env('SMS_QCLOUD_REGION', 'ap-guangzhou'),
    appid: env('SMS_QCLOUD_APPID', '1400437232'),
    secretId: env('SMS_QCLOUD_ID', 'your-secret-id'),
    secretKey: env('SMS_QCLOUD_KEY', 'your-secret-key'),
});
```

#### 服务类

新增一个`src/modules/core/services/sms.service.ts`文件用于编写短信服务

其方法列表如下

```typescript
const SmsClient = tencentcloud.sms.v20210111.Client;

/**
 * 腾讯云短信驱动
 */
@Injectable()
export class SmsService {
    /**
     * 初始化配置
     * @param options 短信发送选项
     */
    constructor(protected readonly options: SmsOptions) {}

    /**
     * 合并配置并发送短信
     * @param params 短信发送参数
     * @param options 自定义驱动选项(可用于临时覆盖默认选项)
     */
    async send<T>(params: SmsSendParams & T, options?: SmsOptions)

    /**
     * 创建短信发送驱动实例
     * @param options 驱动选项
     */
    protected makeClient(options: SmsOptions)

    /**
     * 转义通用发送参数为腾讯云短信服务发送参数
     * @param params 发送参数
     * @param options 驱动选项
     */
    protected transSendParams(params: SmsSendParams, options: SmsOptions): SendSmsRequest
}

```

#### CoreModule

修改`CoreModule`添加短信服务为提供者以及导出

```typescript
// src/modules/core/core.module.ts
    public static forRoot(options: CoreOptions = {}): DynamicModule {
        let imports: ModuleMetadata['imports'] = [];

        let providers: ModuleMetadata['providers'] = [
           ...
        ];

        const exps: ModuleMetadata['exports'] = [];

        if (options.database) {
            ...
        }

        if (options.sms) {
            providers.push({
                provide: SmsService,
                useFactory: () => new SmsService(options.sms()),
            });
            exps.push(SmsService);
        }
        return {
            global: true,
            imports,
            providers,
            exports: exps,
            module: CoreModule,
        };
    }
```

### 邮件发送

与短信类似的编写流程

添加类型->驱动配置->服务类->修改CoreModule

```typescript
// src/modules/core/types.ts

/**
 * core模块参数选项
 */
export interface CoreOptions {
    database?: () => TypeOrmModuleOptions;
    sms?: () => SmsOptions;
    smtp?: () => SmtpOptions;
}
/**
 * SMTP邮件发送配置
 */
export type SmtpOptions<T extends NestedRecord = RecordNever> = {
    ...
} & T;

/**
 * 公共发送接口配置
 */
export interface SmtpSendParams {
    ...
}

// src/config/smtp.config.ts
export const smtp: () => SmtpOptions = () => ({
    host: env('SMTP_HOST', 'localhost'),
    user: env('SMTP_USER', 'test'),
    password: env('SMTP_PASSWORD', ''),
    from: env('SMTP_FROM', '平克小站<support@localhost>'),
    port: env('SMTP_PORT', (v) => Number(v), 25),
    secure: env('SMTP_SSL', (v) => JSON.parse(v), false),
    // Email模板路径
    resource: path.resolve(__dirname, '../../assets/emails'),
});

// src/modules/core/services/smtp.service.ts
/**
 * SMTP邮件发送驱动
 */
@Injectable()
export class SmtpService {
    /**
     * 初始化配置
     * @param options
     */
    constructor(protected readonly options: SmtpOptions) {}

    /**
     * 合并配置并发送邮件
     * @param params
     * @param options
     */
    async send<T>(params: SmtpSendParams & T, options?: SmtpOptions)

    /**
     * 创建NodeMailer客户端
     * @param options
     */
    protected makeClient(options: SmtpOptions)

    /**
     * 转义通用发送参数为NodeMailer发送参数
     * @param client
     * @param params
     * @param options
     */
    protected async makeSend(client: Mail, params: SmtpSendParams, options: SmtpOptions)
}

// src/modules/core/core.module.ts
 if (options.smtp) {
    providers.push({
        provide: SmtpService,
            useFactory: () => new SmtpService(options.smtp()),
        });
    exps.push(SmtpService);
}
```

### 消息队列

消息队列使用BullMQ+Redis实现

添加配置类型

```typescript
// src/modules/core/types.ts

/**
 * core模块参数选项
 */
export interface CoreOptions {
    database?: () => TypeOrmModuleOptions;
    queue?: () => QueueConfig;
    sms?: () => SmsOptions;
    smtp?: () => SmtpOptions;
}

/**
 * 队列配置
 */
export type QueueConfig = QueueOptions | Array<{ name: string } & QueueOptions>;
```

添加配置与注册`BullMQ`模块

```typescript
// src/config/queue.config.ts
export const queue: () => QueueConfig = () => ({
    connection: {
        host: 'localhost',
        port: 6379,
    },
});

// src/modules/core/core.module.ts
if (options.queue) {
    const queue = options.queue();
    if (isArray(queue)) {
        imports = queue.map((v) => BullModule.forRoot(v.name, omit(v, ['name'])));
    } else {
        imports.push(BullModule.forRoot(queue));
    }
}
```

## 用户模块

### 模型

新增`CaptchaEntity`模型用于存储验证码

```typescript
// src/modules/user/entities/captcha.entity.ts
@Entity('user_captchas')
export class CaptchaEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: '验证码' })
    code!: string;

    @Column({
        type: 'enum',
        enum: CaptchaActionType,
        comment: '验证操作类型',
    })
    action!: CaptchaActionType;

    @Column({
        type: 'enum',
        enum: CaptchaType,
        comment: '验证码类型',
    })
    type!: CaptchaType;

    @Column({ comment: '手机号/邮箱地址' })
    value!: string;

    @CreateDateColumn({
        comment: '创建时间',
    })
    created_at!: Date;

    @UpdateDateColumn({
        comment: '更新时间',
    })
    updated_at!: Date;
}

```

在`UserEntity`中添加一个`actived`字段用于判断用户是否处于激活状态以及一个`phone`字段用于存储手机号

```typescript
// src/modules/user/entities/user.entity.ts
export class UserEntity extends BaseEntity {
    ...
    @Column({ comment: '手机号', nullable: true, unique: true })
    phone?: string;
    @Column({ comment: '用户状态,是否激活', default: true })
    actived?: boolean;
}
```

### 常量

新增一个`constants.ts`文件用于存放一些常量和枚举

```typescript
.// src/modules/user/constants.ts

/**
 * 用户列表查询排序方式
 */
export enum UserOrderType {
    CREATED = 'createdAt',
    UPDATED = 'updatedAt',
}

/**
 * 用户请求DTO验证组
 */
export enum UserDtoGroups {
    REGISTER = 'user-register',
    CREATE = 'user-create',
    UPDATE = 'user-update',
    BOUND = 'account-bound',
}

/**
 * 验证码发送数据DTO验证组
 */
export enum CaptchaDtoGroups {
    // 发送短信登录验证码
    PHONE_LOGIN = 'phone-login',
    // 发送邮件登录验证码
    EMAIL_LOGIN = 'email-login',
    ...
}

/**
 * 验证码操作类别
 */
export enum CaptchaActionType {
    // 登录操作
    LOGIN = 'login',
    ...
}

/**
 * 验证码类型
 */
export enum CaptchaType {
    SMS = 'sms',
    EMAIL = 'email',
}

/**
 * 发送验证码异步列队名称
 */
export const SEND_CAPTCHA_QUEUE = 'send-captcha-queue';

/**
 * 发送短信验证码任务处理名称
 */
export const SMS_CAPTCHA_JOB = 'sms-captcha-job';

/**
 * 发送邮件验证码任务处理名称
 */
export const EMAIL_CAPTCHA_JOB = 'mail-captcha-job';
```

### 类型

添加一些类型并修改`UserConfig`类型

- UserConfig: 为其添加`captcha`选项用于配置验证码
- DefaultUserConfig: 默认用户模块配置
- SmsCaptchaOption:手机验证码选项
- EmailCaptchaOption: 邮件验证码选项
- CustomCaptchaConfig: 自定义验证码配置
- DefaultCaptchaConfig: 默认验证码配置
- CaptchaOption: 通用验证码选项
- SmsCaptchaOption:手机验证码选项
- EmailCaptchaOption:邮件验证码选项
- SendCaptchaQueueJob:任务传给消费者的数据类型
- CaptchaValidate:验证码正确性验证

```typescript
// src/modules/user/types.ts

export interface UserConfig {
    hash?: number;
    jwt: JwtConfig;
    captcha?: CustomCaptchaConfig;
}
export interface DefaultUserConfig
export interface CustomCaptchaConfig
export interface DefaultCaptchaConfig
export interface CaptchaOption
export interface SmsCaptchaOption extends CaptchaOption
export interface EmailCaptchaOption extends CaptchaOption
export interface SendCaptchaQueueJob
export type CaptchaValidate<T extends Record<string, any> = RecordNever>
```

### 辅助函数

在`src/modules/user/helpers.ts`中为新增功能添加一些辅助函数

- getDefaultCaptcha: 获取默认的验证码配置
- `defaultConfig: DefaultUserConfig`:  默认用户配置
- getUserConfig: 获取用户模块配置的值
- generateCatpchaCode: 生成随机验证码

### 修改配置

修改用户模块配置如下

```typescript
import { env, getRunEnv } from '@/helpers';
import { EnvironmentType } from '@/helpers/constants';
import { UserConfig } from '@/modules/user/types';

const expiredTime = getRunEnv() === EnvironmentType.DEVELOPMENT ? 3600 * 10000 : 3600;

/**
 * 用户模块配置
 */
export const userConfig: () => UserConfig = () => ({
    hash: 10,
    jwt: {
        secret: 'my-secret',
        token_expired: expiredTime,
        refresh_secret: 'my-refresh-secret',
        refresh_token_expired: expiredTime * 30,
    },
    captcha: {
        sms: {
            login: {
                template: env('SMS_LOGIN_CAPTCHA_QCLOUD', 'your-id'),
            },
            register: {
                template: env('SMS_REGISTER_CAPTCHA_QCLOUD', 'your-id'),
            },
            'retrieve-password': {
                template: env('SMS_RETRIEVEPASSWORD_CAPTCHA_QCLOUD', 'your-id'),
            },
        },
        email: {
            register: {},
            'retrieve-password': {},
        },
    },
});
```

### 数据验证

重新设计DTO类的结构

`GuestDto`用于存放存放一些公共的验证字段

```typescript
// src/modules/user/dtos/guest.dto.ts
@Injectable()
export class GuestDto {
    readonly credential!: string;
    username!: string;
    nickname?: string;
    phone: string;
    email: string;
    readonly password!: string;
    trash?: boolean;
    
    // 设置密码时的重复输入以防输入错误
    @IsMatch('password', { message: '两次输入密码不同', always: true })
    @IsNotEmpty({ message: '请再次输入密码以确认', always: true })
    readonly plainPassword!: string;
    
    // 验证码
    readonly code!: string;
    
    // 发送验证码的类型
    @IsEnum(CaptchaType)
    type: CaptchaType;
}

```

`captcha.dto.ts`用于存放验证码操作的数据验证

```typescript
// src/modules/user/dtos/captcha.dto.ts
/**
 * 发送邮件或短信验证码消息
 */
export class CaptchaMessage extends PickType(GuestDto, ['phone', 'email']) {}

/**
 * 发送短信验证码DTO类型
 */
export class PhoneCaptchaMessageDto extends PickType(CaptchaMessage, ['phone'] as const) {}

/**
 * 发送邮件验证码DTO类型
 */
export class EmailCaptchaMessageDto extends PickType(CaptchaMessage, ['email'] as const) {}

/**
 * 通过已登录账户发送验证码消息
 */
export class UserCaptchaMessageDto extends PickType(GuestDto, ['type']) {}

/**
 * 通过用户凭证发送验证码消息
 */
export class CredentialCaptchaMessageDto extends PickType(GuestDto, ['credential']) {}

/**
 * 发送登录验证码短信
 */
@DtoValidation({ groups: [CaptchaDtoGroups.PHONE_LOGIN] })
export class LoginPhoneCaptchaDto extends PhoneCaptchaMessageDto {}

/**
 * 发送登录验证码邮件
 */
@DtoValidation({ groups: [CaptchaDtoGroups.EMAIL_LOGIN] })
export class LoginEmailCaptchaDto extends EmailCaptchaMessageDto {}

/**
 * 发送注册验证码短信
 */
@DtoValidation({ groups: [CaptchaDtoGroups.PHONE_REGISTER] })
export class RegisterPhoneCaptchaDto extends PhoneCaptchaMessageDto {}

/**
 * 发送注册验证码邮件
 */
@DtoValidation({ groups: [CaptchaDtoGroups.PHONE_REGISTER] })
export class RegisterEmailCaptchaDto extends EmailCaptchaMessageDto {}

/**
 * 发送找回密码短信
 */
@DtoValidation({ groups: [CaptchaDtoGroups.EMAIL_RETRIEVE_PASSWORD] })
export class RetrievePasswordPhoneCaptchaDto extends PhoneCaptchaMessageDto {}

/**
 * 发送找回密码邮件
 */
@DtoValidation({ groups: [CaptchaDtoGroups.EMAIL_RETRIEVE_PASSWORD] })
export class RetrievePasswordEmailCaptchaDto extends EmailCaptchaMessageDto {}

/**
 * 发送手机绑定短信
 */
@DtoValidation({ groups: [CaptchaDtoGroups.BOUND_PHONE] })
export class BoundPhoneCaptchaDto extends PhoneCaptchaMessageDto {}

/**
 * 发送邮箱绑定邮件
 */
@DtoValidation({ groups: [CaptchaDtoGroups.BOUND_EMAIL] })
export class BoundEmailCaptchaDto extends EmailCaptchaMessageDto {}
```

`auth.dto.ts`用户存放未登录用户Auth操作的数据验证

```typescript
// src/modules/user/dtos/auth.dto.ts
/**
 * 用户正常方式登录
 */
export class CredentialDto extends PickType(GuestDto, ['credential', 'password']) {}

/**
 * 通过手机验证码登录
 */
@DtoValidation({ groups: [CaptchaDtoGroups.PHONE_LOGIN] })
export class PhoneLoginDto extends PickType(GuestDto, ['phone', 'code'] as const) {}

/**
 * 通过邮箱验证码登录
 */
@DtoValidation({ groups: [CaptchaDtoGroups.EMAIL_LOGIN] })
export class EmailLoginDto extends PickType(GuestDto, ['email', 'code'] as const) {}

/**
 * 普通方式注册用户
 */
@DtoValidation({ groups: [UserDtoGroups.REGISTER] })
export class RegisterDto extends PickType(GuestDto, [
    'username',
    'nickname',
    'password',
    'plainPassword',
] as const) {}

/**
 * 通过手机验证码注册
 */
@DtoValidation({ groups: [CaptchaDtoGroups.PHONE_REGISTER] })
export class PhoneRegisterDto extends PickType(GuestDto, ['phone', 'code'] as const) {}

/**
 * 通过邮件验证码注册
 */
@DtoValidation({ groups: [CaptchaDtoGroups.EMAIL_REGISTER] })
export class EmailRegisterDto extends PickType(GuestDto, ['email', 'code'] as const) {}

/**
 * 通过登录凭证找回密码
 */
export class RetrievePasswordDto extends PickType(GuestDto, [
    'credential',
    'code',
    'password',
    'plainPassword',
] as const) {}

/**
 * 通过手机号找回密码
 */
@DtoValidation({ groups: [CaptchaDtoGroups.EMAIL_RETRIEVE_PASSWORD] })
export class PhoneRetrievePasswordDto extends PickType(GuestDto, [
    'phone',
    'code',
    'password',
    'plainPassword',
] as const) {}

/**
 * 通过邮箱地址找回密码
 */
@DtoValidation({ groups: [CaptchaDtoGroups.EMAIL_RETRIEVE_PASSWORD] })
export class EmailRetrievePasswordDto extends PickType(GuestDto, [
    'email',
    'code',
    'password',
    'plainPassword',
] as const) {}
```

`account.dto.ts`用于存放已登录用户进行账户操作的数据验证

```typescript
// src/modules/user/dtos/account.dto.ts
/**
 * 对手机/邮箱绑定验证码进行验证
 */
export class AccountBoundDto extends PickType(GuestDto, ['code', 'phone', 'email']) {
    @IsNumberString(undefined, { message: '验证码必须为数字', always: true })
    @Length(6, 6, { message: '验证码长度错误', always: true })
    @IsOptional({ always: true })
    readonly oldCode?: string;
}

/**
 * 绑定或更改手机号验证
 */
@DtoValidation({ groups: [CaptchaDtoGroups.BOUND_PHONE] })
export class PhoneBoundDto extends OmitType(AccountBoundDto, ['email'] as const) {}

/**
 * 绑定或更改邮箱验证
 */
@DtoValidation({ groups: [CaptchaDtoGroups.BOUND_EMAIL] })
export class EmailBoundDto extends OmitType(AccountBoundDto, ['phone'] as const) {}

/**
 * 更新用户信息
 */
@DtoValidation({ groups: [UserDtoGroups.BOUND] })
export class UpdateAccountDto extends PickType(GuestDto, ['username', 'nickname']) {}

/**
 * 更改用户密码
 */
export class UpdatePassword extends PickType(GuestDto, ['password', 'plainPassword']) {
    @Length(8, 50, {
        message: '密码长度至少为$constraint1个字符',
    })
    oldPassword!: string;
}
```

`manage.dto.ts`用于对用户管理和用户查询操作的数据验证

```typescript
// src/modules/user/dtos/manage.dto.ts
@DtoValidation({
    type: 'query',
    skipMissingProperties: true,
})
export class QueryUserDto {
    /**
     * 过滤激活状态
     */
    @Transform(({ value }) => tBoolean(value))
    @IsBoolean()
    actived?: boolean;
    orderBy?: UserOrderType;
    trashed?: boolean;
    page = 1;
    limit = 10;
}
```

### 服务

不要忘记在`index.ts`中导出新增的服务类

#### 修改原服务类

对于`UserService`新增以下方法

- updatePassword: 更新用户密码
- getListQuery: 根据参数构建查询用户列表的Query

对于`AuthService`新增以下方法

- loginByCaptcha: 用户手机号/邮箱+验证码登录用户
- register: 使用用户名密码注册用户
- registerByCaptcha: 通过验证码注册
- retrievePassword: 通过验证码重置密码
- boundCaptcha: 绑定或更改手机号/邮箱
- checkCodeExpired: 检测验证码是否过期

### 发信队列

在`UserModule`上注册发信队列

```typescript
```



#### 发信消费者

消费者服务通过注入`SmsService`和`SmtpService`来处理发信任务

```typescript
// src/modules/user/services/captcha/worker.service.ts
@Injectable()
export class CaptchaWorkerService {
    constructor(
        @InjectRepository(CaptchaEntity)
        private captchaRepository: Repository<CaptchaEntity>,
        private readonly sms: SmsService,
        private readonly mailer: SmtpService,
    ) {}

    async addWorker() {
        return new Worker(
            SEND_CAPTCHA_QUEUE,
            async (job: Job<SendCaptchaQueueJob>) => this.sendCode(job),
            // 开启10个并发进行发送
            { concurrency: 10 },
        );
    }

    /**
     * 发送验证码
     * @param job
     */
    protected async sendCode(job: Job<SendCaptchaQueueJob>) {
        const { captcha } = job.data;
        try {
            if (job.name === SMS_CAPTCHA_JOB || job.name === EMAIL_CAPTCHA_JOB) {
                if (job.name === SMS_CAPTCHA_JOB) {
                    await this.sendSms(job.data);
                } else if (job.name === EMAIL_CAPTCHA_JOB) {
                    await this.sendEmail(job.data);
                }
                return await this.captchaRepository.save(
                    omit(captcha, ['created_at', 'updated_at']),
                );
            }
            return false;
        } catch (err) {
            console.log(chalk.red(err));
            throw new Error(err as string);
        }
    }

    /**
     * 发送短信验证码
     * @param data
     */
    protected async sendSms(data: SendCaptchaQueueJob) {
        return this.sms.send(...)
    }

    /**
     * 发送邮件验证码
     * @param data
     */
    protected async sendEmail(data: SendCaptchaQueueJob) {
        return this.mailer.send(...)
    }
}
```

#### 发信任务

在列队服务的构造函数中第一时间调用`CaptchaWorkerService`以添加消费者

```typescript
// src/modules/user/services/captcha/queue.service.ts

/**
 * 验证码发送服务
 */
@Injectable()
export class CaptchaQueueService {
    protected config: UserConfig;

    constructor(
        @InjectRepository(CaptchaEntity)
        protected captchaRepository: Repository<CaptchaEntity>,
        @InjectQueue(SEND_CAPTCHA_QUEUE) protected captchaQueue: Queue,
        protected userService: UserService,
        protected workerService: CaptchaWorkerService,
    ) {
        this.config = userConfig();
        this.workerService.addWorker();
    }

    /**
     * 根据消息类型(短信/邮件)添加发送任务
     */
    async sendByType(params: TypeSendParams)

    /**
     * 通过登录凭证添加发送任务
     */
    async sendByCredential(params: CredentialSendParams) {
        const { credential, ...others } = params;
        const user = await this.userService.findOneByCredential(credential);
        if (!user) {
            throw new BadRequestException(`user ${credential} not exists`);
        }
        return this.sendByUser({ user, ...others });
    }

    /**
     * 通过用户对象发送验证码
     */
    async sendByUser(params: UserSendParams)

    /**
     * 添加验证码发送任务
     */
    async send(params: SendParams): Promise<{ result: boolean; log: any }>

    /**
     * 创建验证码模型对象
     */
    protected async createCaptcha(
        data: PhoneCaptchaMessageDto | EmailCaptchaMessageDto,
        action: CaptchaActionType,
        type: CaptchaType,
        config: CaptchaOption,
        code?: string,
    )
}
```

### 控制器

`UserController`不需要改动，删除原来的`AccountController`，新增三个控制器，它们的功能如下

#### CaptchaController

这是一个用于验证码发送方法的抽象父类，方法如下

- sendLoginSms: 发送登录验证码短信
- sendLoginEmail: 发送登录验证码邮件
- sendRegisterSms: 发送用户注册验证码短信
- sendRegisterEmail: 发送用户注册验证码邮件
- sendRetrievePasswordSms: 发送找回密码的验证码短信
- sendRetrievePasswordEmail: 发送找回密码的验证码邮件
- sendRetrievePasswordCaptcha: 通过登录凭证找回密码时同时发送短信和邮件
- sendBoundPhone: 发送手机绑定验证码
- sendEmailBound: 发送邮件绑定验证码
- sendOldBoundCaptcha: 发送原手机或原邮箱验证码

#### AuthController

用于未登录用户的一些操作，方法如下

- login: 凭证+密码登录
- loginByPhone: 通过短信验证码登录
- loginByEmail: 通过邮件验证码登录
- logout: 注销登录
- register: 用户名+密码注册
- registerByPhone: 通过手机号验证注册用户
- registerByEmail: 通过邮箱验证注册用户
- retrievePassword: 通过用户凭证(用户名,短信,邮件)发送邮件和短信验证码后找回密码
- retrievePasswordByPhone: 通过短信验证码找回密码
- retrievePasswordByEmail: 通过邮件验证码找回密码

#### AccountController

用于已登录用户对账户的操作，方法如下

- init: 生成一个初始账户
- update: 更新账户信息
- resetPassword: 更改密码
- boundPhone: 绑定或更改手机号
- boundEmail: 绑定或更改邮箱