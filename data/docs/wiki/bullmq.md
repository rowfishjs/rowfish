---
title: BullMQ使用教程
sidebar_label: BullMQ使用教程[做]
sidebar_position: 32
---
# BullMQ使用教程

## 概念

异步消息列队处理的基本原则是

1. 创建队列(queue)
2. 在队列中创建任务(job)，可以在任务中传递一些payload数据，任务创建后会被添加到redis中
3. 运行消费者(work)处理任务并且可以运行一些逻辑，如果在任务中有传递的payload数据则可以读取
4. 消费者可以并发或并行(同时执行)多个耗时任务
5. 消费者执行任务失败则抛出异常

### 生命周期

普通队列

![](https://img.pincman.com/media202209070543152.png)

嵌套队列![](https://img.pincman.com/media202209070544327.png)

## 连接

bullmq通过Redis进行异步队列处理，所以需要无论在队列还是消费者中都需要传入连接

```typescript
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis();

// Reuse the ioredis instance
const myQueue = new Queue('myqueue', { connection });
const myWorker = new Worker('myworker', async (job)=>{}, { connection });
```

## 队列

队列是一群同类型任务的集合，比如发送多条短信等

### 添加任务

添加队列之后就可以往里面加任务了

```typescript
const queue = new Queue('Cars');
await queue.add('paint', { colour: 'red' });
// 设置延时执行,当消费者消费此任务时会过5秒再执行
await queue.add('paint', { colour: 'blue' }, { delay: 5000 });
```

批量添加任务

```typescript
import { Queue } from 'bullmq';

const queue = new Queue('paint');

const jobs = await queue.addBulk([
  { name, data: { paint: 'car' } },
  { name, data: { paint: 'house' } },
  { name, data: { paint: 'boat' } },
]);
```

### 移除任务

如果一个任务有父级任务，那么移除它之后，它的父任务在没有其它子任务的情况下会一并移除，否则父任务不会移除

删除所有等待或延迟但不活动、已完成或失败的作业使用`drain`

```typescript
import { Queue } from 'bullmq';
const queue = new Queue('paint');
await queue.drain();
```

清空整个队列的所有任务(包括队列本身)，使用`obliterate`

```typescript
import { Queue } from 'bullmq';
const queue = new Queue('paint');
await queue.obliterate();
```

## 消费者

消费者是用来执行任务的，比如我们需要对用户发送验证短信，那么需要

1. 读取用户数据获取用户的手机号
2. 添加队列，在队列中添加一个任务，并在此任务中传入用户的手机号数据
3. 消费者执行队列时拿到手机号进行耗时的发送任务

消费者可以报告执行进度

```typescript
import { Worker, Job } from 'bullmq';

const worker = new Worker(queueName, async (job: Job) => {
  await job.updateProgress(42);
  await job.updateProgress({ foo: 'bar' });
  return 'some value';
});
```

消费者的返回值(比如上面代码中的`some value`)可通过`complete`监听器获取

```typescript
worker.on('completed', (job: Job, returnvalue: any) => {
});
```

消费者有多个监听器，比如上面的`complete`或者进行中的`progress`可以获取通过`updateProgress`报告的进度,`failed`可以获取处理失败事件

> 注意: `error`事件是用于`node`本身错误的监听器,`failed`是执行失败(比如发送短信时无法连接云平台等)的异常,两者是有区别的

```typescript
worker.on('progress', (job: Job, progress: number | object) => {
});
worker.on('failed', (job: Job, error: Error) => {
});
worker.on('error', err => {
  console.error(err);
});
```

消费者默认在实例化后就自动执行，我们也可以设置成手动执行，以便我们需要时去执行

```typescript
import { Worker, Job } from 'bullmq';

const worker = new Worker(
  queueName,
  async (job: Job) => {
  },
  { autorun: false },
);

worker.run();
```

可以通过泛型来指定通过Job传入消费者的类型和消费者的返回值类型

```typescript
const worker = new Worker<MyData, MyReturn>(queueName, async (job: Job) => {});
```

### 并发处理

为了同时快速的消费多个任务需要使用到并发，并发处理有多种方式

最简单的就是指定`concurrency`选项，它是通过异步处理来完成的

```typescript
import { Worker, Job } from 'bullmq';

const worker = new Worker(
  queueName,
  async (job: Job) => {
    return 'some value';
  },
  { concurrency: 50 },
);

// 或者

worker.concurrency = 50;
```

但是也可以在多个机器上运行多个工作者来实现并行

对于长耗时的任务，比如视频转码等，可以使用沙盒模式来启用单独的`ork`进程来处理以免导致其它任务被卡死

```typescript
import { SandboxedJob } from 'bullmq';

module.exports = async (job: SandboxedJob) => {
    // Do something with job
};

import { Worker } from 'bullmq'

const processorFile = path.join(__dirname, 'my_procesor.js');
worker = new Worker(queueName, processorFile);
```

### 关闭及暂停任务

关闭与暂停任务时，会把当前正在消费的任务先执行完然后再关闭和暂停，除非传入`true`参数

```typescript
// 关闭任务
await worker.close();
// 通过队列暂停
await myQueue.pause();
// 通过消费者暂停
await myWorker.pause();
// 直接结束当前任务后暂停
await myWorker.pause(true);
```

## 任务

一个队列可以用多种类型的任务，比如FIFO(先进先出)或者LIFO(后进后出)等

先进先出意味着消费者会按你添加到队列的任务顺序从头执行，后进后出意味着从尾倒序过来消费任务，默认为先进先出，可以通过指定`lifo`选项来变成后进后出**(如果是并行消费，那么顺序可能会被打乱)**

同时，在添加任务时可以指定第三个参数

比如下面的代码表示所有已完成的作业将被自动删除，最后 1000 个失败的作业将保留在队列中

```typescript
import { Queue } from 'bullmq';
const myQueue = new Queue('Paint');
await myQueue.add(
  'wall',
  { color: 'pink' },
  { removeOnComplete: true, removeOnFail: 1000 },
);
```

也可以为一个队列的所有任务指定一个默认选项

```typescript
const queue = new Queue('Paint', { defaultJobOptions: {
  removeOnComplete: true, removeOnFail: 1000
});
```

默认的任务ID是自增的数值，为了避免消费者重复消费同一个任务，可以指定一个自定义的ID，但是每个任务的ID必须是唯一的，否则无法被消费

```typescript
await myQueue.add('wall', { color: 'pink' }, {
  jobId: customJobId,
});
```

### 延迟处理

延迟处理的前提条件是你必须为一个队列添加一个同名的`QueueSchedule`实例，如下

```typescript
import { Queue, QueueScheduler } from 'bullmq';

const myQueueScheduler = new QueueScheduler('Paint');
const myQueue = new Queue('Paint');

// Add a job that will be delayed at least 5 seconds.
await myQueue.add('house', { color: 'white' }, { delay: 5000 });
```

### 可重复任务

可重复任务可以通过`cron`或直接使用对象选项的方式指定

```typescript
import { Queue, QueueScheduler } from 'bullmq';

const myQueueScheduler = new QueueScheduler('Paint');
const myQueue = new Queue('Paint');

// 每天凌晨3点15分执行
await myQueue.add(
  'submarine',
  { color: 'yellow' },
  {
    repeat: {
      pattern: '* 15 3 * * *',
    },
  },
);

// 每隔10秒执行，最多执行100次
await myQueue.add(
  'bird',
  { color: 'bird' },
  {
    repeat: {
      every: 10000,
      limit: 100,
    },
  },
);
```

可重复任务无法通过`getJobs`获取，可以通过`getRepeatableJobs`替代

```typescript
import { Queue } from 'bullmq';
const myQueue = new Queue('Paint');
const repeatableJobs = await myQueue.getRepeatableJobs();
```

### 优选级

可以忽略`FIFO`或者`LIFO`而手动指定优先级,数值越大越先执行，没有指定的最后执行

```typescript
import { Queue } from 'bullmq';

const myQueue = new Queue('Paint');

await myQueue.add('wall', { color: 'pink' }, { priority: 10 });
await myQueue.add('wall', { color: 'brown' }, { priority: 5 });
await myQueue.add('wall', { color: 'blue' }, { priority: 7 });
```

### 删除任务

删除任务需要注意以下规则

- 无法删除正在处于激活状态的任务，否则将抛出异常
- 如果一个任务有后代任务处于活动状态将停止删除
- 如果一个任务有父任务并且父任务下没有其它后代任务处于激活状态则父任务也会删除

```typescript
import { Queue } from 'bullmq';
const queue = new Queue('paint');
const job = await queue.add('wall', { color: 1 });
await job.remove();
```

### CPU卡死

默认任务最大执行时间为30秒，如果大于30秒请使用沙盒方式开子进程来处理，否则CPU卡死会导致所有任务停滞

```typescript
// main.ts
import { Worker } from 'bullmq';

const worker = new Worker('Paint', painter);

// painter.ts
export default = (job) => {
    // Paint something
}
```

### 任务数和任务信息

要获取任务数或任务信息可以使用类似下面的代码

```typescript
import { Queue } from 'bullmq';

const myQueue = new Queue('Paint');

const counts = await myQueue.getJobCounts('wait', 'completed', 'failed');

// Returns an object like this { wait: number, completed: number, failed: number }

const completed = await myQueue.getJobs(['completed'], 0, 100, true);

// returns the oldest 100 jobs
```

### 嵌套队列

队列可以是一个嵌套的树形结构，父任务必须是在子任务全部执行完毕的情况下才会执行

```typescript
const flow = new FlowProducer({ connection });

const originalTree = await flow.add({
  name: 'root-job',
  queueName: 'topQueueName',
  data: {},
  children: [
    {
      name,
      data: { idx: 0, foo: 'bar' },
      queueName: 'childrenQueueName',
      children: [
        {
          name,
          data: { idx: 4, foo: 'baz' },
          queueName: 'grandchildrenQueueName',
        },
      ],
    },
    {
      name,
      data: { idx: 2, foo: 'foo' },
      queueName: 'childrenQueueName',
    },
    {
      name,
      data: { idx: 3, foo: 'bis' },
      queueName: 'childrenQueueName',
    },
  ],
});

```

在父任务的消费者中可以获取子任务的返回值，任务名称等信息

```typescript
import { FlowProducer } from 'bullmq';

// A FlowProducer constructor takes an optional "connection"
// object otherwise it connects to a local redis instance.
const flowProducer = new FlowProducer();

const flow = await flowProducer.add({
  name: 'renovate-interior',
  queueName: 'renovate',
  children: [
    { name: 'paint', data: { place: 'ceiling' }, queueName: 'steps' },
    { name: 'paint', data: { place: 'walls' }, queueName: 'steps' },
    { name: 'fix', data: { place: 'floor' }, queueName: 'steps' },
  ],
});


import { Worker } from 'bullmq';

const stepsQueue = new Worker('steps', async job => {
  await performStep(job.data);

  if (job.name === 'paint') {
    return 2500;
  } else if (job.name === 'fix') {
    return 1750;
  }
});

import { Worker } from 'bullmq';

const stepsQueue = new Worker('renovate', async job => {
  const childrenValues = await job.getChildrenValues();

  const totalCosts = Object(childrenValues)
    .values()
    .reduce((prev, cur) => prev + cur, 0);

  await sendInvoice(totalCosts);
});
```

通过下面的代码可以获取嵌套队列的信息

```typescript
const { job: topJob } = originalTree;

const tree = await flow.getFlow({
  id: topJob.id,
  queueName: 'topQueueName',
});

// 获取指定子任务信息
const { children, job } = tree;

// 获取依赖关系
const dependencies = await job.getDependencies();
// 获取子任务返回值的集合
const values = await job.getChildrenValues();
// 获取任务状态
const state = await job.getState();
```

### 日志收集

可以每隔一段时间收集一次任务处理日志

```typescript
import { Worker, MetricsTime } from 'bullmq';

const myWorker = new Worker('Paint', {
  connection,
  metrics: {
    maxDataPoints: MetricsTime.ONE_WEEK * 2,
  },
});

// 获取数据
import { Queue } from 'bullmq';
const myQueue = new Queue('Paint', {
  connection,
});

const metrics = await queue.getMetrics('completed');

```

### 频率限制

可以通过选项设置指定时间内处理的最大任务数

```typescript
import { Worker, QueueScheduler } from "bullmq";

const worker = new Worker('painter', async job => paintCar(job), {
  limiter: {
    max: 10,
    duration: 1000
  }
});

const scheduler = new QueueScheduler('painter');
```

对于同一个队列，一个消费者的限速设置将是全局的，也就是上述代码设置完毕后，你在创建N个`painter`的消费者，同样只能1秒内执行10个任务，如果需要不同的设置则可以分组

```typescript
import { Queue, Worker, QueueScheduler } from "bullmq";

const queue = new Queue('painter', 
{ 
  limiter: {
    groupKey: 'customerId',
  }
});

const worker = new Worker('painter', async job => paintCar(job), {
  limiter: {
    max: 10,
    duration: 1000,
    groupKey: 'customerId'
  }
});

const scheduler = new QueueScheduler('painter');


// jobs will be rate limited by the value of customerId key:
await queue.add('rate limited paint', { customerId: 'my-customer-id' });
```

### 重试设置

当消费者执行任务遇到问题时自动重试，我们可以为重试添加自定义的限制，比如延迟重试，最大重试次数等

```typescript
import { Queue, QueueScheduler } from 'bullmq';

const myQueue = new Queue('foo');
const myQueueScheduler = new QueueScheduler('foo');

await queue.add(
  'test-retry',
  { foo: 'bar' },
  {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
);
// 或者设置为队列的默认规则
import { Queue, QueueScheduler } from 'bullmq';

const myQueue = new Queue('foo', {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

const myQueueScheduler = new QueueScheduler('foo');

await queue.add('test-retry', { foo: 'bar' });
```

也可以禁用重试

```typescript
import { Worker, UnrecoverableError } from 'bullmq';

const worker = new Worker('foo', async job => {doSomeProcessing();
throw new UnrecoverableError('Unrecoverable');
}, {
  connection
  },
});

await queue.add(
  'test-retry',
  { foo: 'bar' },
  {
    attempts: 3,
    backoff: 1000,
  },
);
```

## 在Nestjs中使用

### 安装依赖

```shell
~ pnpm add @nestjs/bullmq bullmq
```

### 导入模块和配置

```typescript
 BullModule.forRoot({
     connection: {
         host: 'localhost',
         port: 6379,
     },
});

// 也可以命名连接
BullModule.forRoot('alternative-config', {
  connect: {
    port: 6381,
  },
});
```

### 注册队列

```typescript
BullModule.registerQueue({
  configKey: 'alternative-queue' // 如果有多个连接的情况下需要指定名称
  name: 'video',
});
```

在服务中注入队列

```typescript

import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class AudioService {
  constructor(@InjectQueue('audio') private audioQueue: Queue) {}
}
```

### 添加任务

```typescript

const job = await this.audioQueue.add(
  {
    foo: 'bar',
  },
  { delay: 3000,priority: 2 }, // 可指定选项
);
```

### 创建消费者类

> 消费者类需要注册成提供者

```typescript
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('audio')
export class AudioConsumer {
  @Process()
  // 方法名称随意
  async transcode(job: Job<unknown>) {
    let progress = 0;
    for (i = 0; i < 100; i++) {
      await doSomething(job.data);
      progress += 1;
      await job.updateProgress(progress);
    }
    return {};
  }
}

// 也可以指定任务名称
@Process('transcode')
```

### 请求范围

可以使用`REQUEST`的注入范围可以在每次使用消费者时创建一个新的实例以确保不影响其它消费者

```typescript
@Processor({
  name: 'audio',
  scope: Scope.REQUEST,
})
```

使用`REQUEST`范围后可以通过以下方式注入

```typescript
constructor(@Inject(JOB_REF) jobRef: Job) {
  console.log(jobRef);
}
```

### 事件监听

与bullmq的事件监听一致，具体装饰器请查看[Nestjs官方文档](https://docs.nestjs.com/techniques/queues#event-listeners)

```typescript
@Processor('audio')
export class AudioConsumer {
    @OnQueueActive()
    onActive(job: Job) {
      console.log(
        `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
      );
    }
    @OnGlobalQueueCompleted()
    async onGlobalCompleted(jobId: number, result: any) {
      const job = await this.immediateQueue.getJob(jobId);
      console.log('(Global) on completed: job ', job.id, ' -> result: ', result);
    }
}
```

### 列队管理

```typescript
@Injectable()
export class AudioService {
    //...
    await this.audioQueue.pause();
    await this.audioQueue.resume();
}
```

### 使用沙盒

在nestjs的bullmq模块中同样可以使用沙盒模式来分离进程

```typescript
BullModule.registerQueue({
    name: 'audio',
    processors: [join(__dirname, 'processor.js')],
}),
```

这是消费者是个函数

```typescript
import { Job, DoneCallback } from 'bull';

export default function (job: Job, cb: DoneCallback) {
  console.log(`[${process.pid}] ${JSON.stringify(job.data)}`);
  cb(null, 'It works');
}
```