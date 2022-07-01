---

slug: commanderjs-usage

title: commanderjs中文文档

authors: pincman

tags: [comannderjs,typescript,node,cli]

rf_summary: 继续老文章搬迁😁.commanderjs现在我基本没在用,一般都用yargs,yargs比较全面好用,但是如果是构建简单的命令行工具,commanderjs还是挺不错的.

---

  [node.js](http://nodejs.org) 命令行接口的完整解决方案，灵感来自 Ruby 的 [commander](https://github.com/commander-rb/commander)。  
  [API 文档](http://tj.github.com/commander.js/)


## 安装

    $ npm install commander

## 声明program变量

Commander为了方便快速编程导出了一个全局对象。为简洁起见，本README中的示例中使用了它。

```js
const program = require('commander');
program.version('0.0.1');
```

对于可能以多种方式使用commander的大型程序，包括单元测试，最好创建一个本地Command对象来使用。

```js
const commander = require('commander');
const program = new commander.Command();
program.version('0.0.1');
```

## 选项

`.option()` 方法用来定义带选项的 commander，同时也用于这些选项的文档。每个选项可以有一个短标识(单个字符)和一个长名字，它们之间用逗号或空格分开。

 选项会被放到 Commander 对象的属性上，多词选项如"--template-engine"会被转为驼峰法`program.templateEngine`。多个短标识可以组合为一个参数，如`-a -b -c`等价于`-abc`。

### 常用选项类型，boolean和值

最常用的两个选项类型是boolean(选项后面不跟值)和选项跟一个值（使用尖括号声明）。除非在命令行中指定，否则两者都是`undefined`。

 ```js
const program = require('commander');

program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);

if (program.debug) console.log(program.opts());
console.log('pizza details:');
if (program.small) console.log('- small pizza size');
if (program.pizzaType) console.log(`- ${program.pizzaType}`);
 ```

```
$ pizza-options -d
{ debug: true, small: undefined, pizzaType: undefined }
pizza details:
$ pizza-options -p
error: option `-p, --pizza-type <type>' argument missing
$ pizza-options -ds -p vegetarian
{ debug: true, small: true, pizzaType: 'vegetarian' }
pizza details:
- small pizza size
- vegetarian
$ pizza-options --pizza-type=cheese
pizza details:
- cheese
```

`program.parse(arguments)`会处理参数，没有被使用的选项会被存放在`program.args`数组中。

### 默认选项值

可以为选项设置一个默认值。

```js
const program = require('commander');

program
  .option('-c, --cheese <type>', 'add the specified type of cheese', 'blue');

program.parse(process.argv);

console.log(`cheese: ${program.cheese}`);
```

```
$ pizza-options
cheese: blue
$ pizza-options --cheese stilton
cheese: stilton
```

### 其他选项类型，可忽略的布尔值和标志值

选项的值为 boolean 类型时，可以在其长名字前加`no-`使默认值为true，如果传了这个选项则值为false。

```js
const program = require('commander');

program
  .option('-n, --no-sauce', 'Remove sauce')
  .parse(process.argv);

if (program.sauce) console.log('you ordered a pizza with sauce');
else console.log('you ordered a pizza without sauce');
```

```
$ pizza-options
you ordered a pizza with sauce
$ pizza-options --sauce
error: unknown option `--sauce'
$ pizza-options --no-sauce
you ordered a pizza without sauce
```

您可以指定一个用作标志的选项，它可以接受值（使用方括号声明，即传值不是必须的）。

```js
const program = require('commander');

program
  .option('-c, --cheese [type]', 'Add cheese with optional type');

program.parse(process.argv);

if (program.cheese === undefined) console.log('no cheese');
else if (program.cheese === true) console.log('add cheese');
else console.log(`add cheese type ${program.cheese}`);
```

## 自定义选项处理

你可以指定一个函数来处理选项的值，接收两个参数：用户传入的值、上一个值(previous value)，它会返回新的选项值。

你可以将选项值强制转换为所需类型，或累积值，或完全自定义处理。

你可以在函数后面指定选项的默认或初始值。

```js
const program = require('commander');

function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and an optional radix
  return parseInt(value);
}

function increaseVerbosity(dummyValue, previous) {
  return previous + 1;
}

function collect(value, previous) {
  return previous.concat([value]);
}

function commaSeparatedList(value, dummyPrevious) {
  return value.split(',');
}

program
  .option('-f, --float <number>', 'float argument', parseFloat)
  .option('-i, --integer <number>', 'integer argument', myParseInt)
  .option('-v, --verbose', 'verbosity that can be increased', increaseVerbosity, 0)
  .option('-c, --collect <value>', 'repeatable value', collect, [])
  .option('-l, --list <items>', 'comma separated list', commaSeparatedList)
;

program.parse(process.argv);

if (program.float !== undefined) console.log(`float: ${program.float}`);
if (program.integer !== undefined) console.log(`integer: ${program.integer}`);
if (program.verbose > 0) console.log(`verbosity: ${program.verbose}`);
if (program.collect.length > 0) console.log(program.collect);
if (program.list !== undefined) console.log(program.list);
```

```
$ custom -f 1e2
float: 100
$ custom --integer 2
integer: 2
$ custom -v -v -v
verbose: 3
$ custom -c a -c b -c c
[ 'a', 'b', 'c' ]
$ custom --list x,y,z
[ 'x', 'y', 'z' ]
```

### 版本选项

`version`方法会处理显示版本命令，默认选项标识为`-V`和`--version`，当存在时会打印版本号并退出。

```js
    program.version('0.0.1');
```

```
    $ ./examples/pizza -V
    0.0.1
```

你可以自定义标识，通过给`version`方法再传递一个参数，语法给`option`方法一致。版本标识名字可以是任意的，但是必须要有长名字。

```
program.version('0.0.1', '-v, --version');
```

## 指定命令选项

可以给命令绑定选项。

```js
#!/usr/bin/env node

var program = require('commander');

program
  .command('rm <dir>')
  .option('-r, --recursive', 'Remove recursively')
  .action(function (dir, cmd) {
    console.log('remove ' + dir + (cmd.recursive ? ' recursively' : ''))
  })

program.parse(process.argv)
```

使用该命令时，将验证命令的选项。任何未知选项都将报告为错误。但是，如果基于操作的命令没有定义action，则不验证选项。

## 正则表达式

```js
program
  .version('0.1.0')
  .option('-s --size <size>', 'Pizza size', /^(large|medium|small)$/i, 'medium')
  .option('-d --drink [drink]', 'Drink', /^(coke|pepsi|izze)$/i)
  .parse(process.argv);

console.log(' size: %j', program.size);
console.log(' drink: %j', program.drink);
```

注：上面代码如果size选项传入的值和正则不匹配，则值为medium(默认值)。drink选项和正则不匹配，值为true。

## 可变参数

 一个命令的最后一个参数可以是可变参数, 并且只有最后一个参数可变。为了使参数可变，你需要在参数名后面追加 `...`。 下面是个示例：

```js
#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
  .version('0.0.1')
  .command('rmdir <dir> [otherDirs...]')
  .action(function (dir, otherDirs) {
    console.log('rmdir %s', dir);
    if (otherDirs) {
      otherDirs.forEach(function (oDir) {
        console.log('rmdir %s', oDir);
      });
    }
  });

program.parse(process.argv);
```
可变参数的值以 `数组` 的形式保存。如上所示，在传递给你的 action 的参数和 `program.args` 中的值都是如此。

## 指定参数的语法

```js
#!/usr/bin/env node

var program = require('../');

program
  .version('0.0.1')
  .arguments('<cmd> [env]')
  .action(function (cmd, env) {
     cmdValue = cmd;
     envValue = env;
  });

program.parse(process.argv);

if (typeof cmdValue === 'undefined') {
   console.error('no command given!');
   process.exit(1);
}
console.log('command:', cmdValue);
console.log('environment:', envValue || "no environment given");
```
尖括号（例如 `<cmd>`）代表必填输入，方括号（例如 `[env]`）代表可选输入。

## Git 风格的子命令

```js
// file: ./examples/pm
var program = require('..');

program
  .version('0.0.1')
  .command('install [name]', 'install one or more packages')
  .command('search [query]', 'search with optional query')
  .command('list', 'list packages installed', {isDefault: true})
  .parse(process.argv);
```

当 `.command()` 带有描述参数时，不能采用 `.action(callback)` 来处理子命令，否则会出错。这告诉 commander，你将采用单独的可执行文件作为子命令，就像 `git(1)` 和其他流行的工具一样。
Commander 将会尝试在入口脚本（例如 `./examples/pm`）的目录中搜索 `program-command` 形式的可执行文件，例如 `pm-install`, `pm-search`。

你可以在调用 `.command()` 时传递选项。指定 `opts.noHelp` 为 `true` 将从生成的帮助输出中剔除该选项。指定 `opts.isDefault` 为 `true` 将会在没有其它子命令指定的情况下，执行该子命令。

如果你打算全局安装该命令，请确保可执行文件有对应的权限，例如 `755`。

### `--harmony`

您可以采用两种方式启用 `--harmony`：
* 在子命令脚本中加上 `#!/usr/bin/env node --harmony`。注意一些系统版本不支持此模式。
* 在指令调用时加上 `--harmony` 参数，例如 `node --harmony examples/pm publish`。`--harmony` 选项在开启子进程时会被保留。

## 自动化帮助信息 --help

 帮助信息是 commander 基于你的程序自动生成的，下面是 `--help` 生成的帮助信息：

```  
$ ./examples/pizza --help
Usage: pizza [options]

An application for pizzas ordering

Options:
  -h, --help           output usage information
  -V, --version        output the version number
  -p, --peppers        Add peppers
  -P, --pineapple      Add pineapple
  -b, --bbq            Add bbq sauce
  -c, --cheese <type>  Add the specified type of cheese [marble]
  -C, --no-cheese      You do not want any cheese
```

## 自定义帮助

 你可以通过监听 `--help` 来控制 `-h, --help` 显示任何信息。一旦调用完成， Commander 将自动退出，你的程序的其余部分不会展示。例如在下面的 “stuff” 将不会在执行 `--help` 时输出。

```js
#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
  .version('0.0.1')
  .option('-f, --foo', 'enable some foo')
  .option('-b, --bar', 'enable some bar')
  .option('-B, --baz', 'enable some baz');

// must be before .parse() since
// node's emit() is immediate

program.on('--help', function(){
  console.log('');
  console.log('Examples:');
  console.log('  $ custom-help --help');
  console.log('  $ custom-help -h');
});

program.parse(process.argv);

console.log('stuff');
```

下列帮助信息是运行 `node script-name.js -h` or `node script-name.js --help` 时输出的:

```
Usage: custom-help [options]

Options:
  -h, --help     output usage information
  -V, --version  output the version number
  -f, --foo      enable some foo
  -b, --bar      enable some bar
  -B, --baz      enable some baz

Examples:
  $ custom-help --help
  $ custom-help -h
```

## .outputHelp(cb)

不退出输出帮助信息。
可选的回调可在显示帮助文本后处理。
如果你想显示默认的帮助（例如，如果没有提供命令），你可以使用类似的东西：

```js
var program = require('commander');
var colors = require('colors');

program
  .version('0.0.1')
  .command('getstream [url]', 'get stream URL')
  .parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp(make_red);
  }

function make_red(txt) {
  return colors.red(txt); // 在控制台上显示红色的帮助文本
}
```

## .help(cb)

 输出帮助信息并立即退出。
 可选的回调可在显示帮助文本后处理。

## 自定义事件监听

 你可以通过监听命令和选项来执行自定义函数。

```js
// 当有选项verbose时会执行函数
program.on('option:verbose', function () {
  process.env.VERBOSE = this.verbose;
});

// 未知命令会报错
program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});
```

## 零碎知识

### TypeScript

包里包含 TypeScript 定义文件，但是需要你自己安装 node types。如：

```bash
npm install commander
npm install --save-dev @types/node
```

如果你使用 `ts-node` 和 git风格子命令编写 `.ts` 文件, 你需要使用 node 来执行程序以保证正确执行子命令。如：

```bash
node -r ts-node/register pm.ts
```
 
 ## 例子

```js
var program = require('commander');

program
  .version('0.0.1')
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook')

program
  .command('setup [env]')
  .description('run setup commands for all envs')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(env, options){
    var mode = options.setup_mode || "normal";
    env = env || 'all';
    console.log('setup for %s env(s) with %s mode', env, mode);
  });

program
  .command('exec <cmd>')
  .alias('ex')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function(cmd, options){
    console.log('exec "%s" using %s mode', cmd, options.exec_mode);
  }).on('--help', function() {
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('  $ deploy exec sequential');
    console.log('  $ deploy exec async');
  });

program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });

program.parse(process.argv);
```

 更多的 [演示](https://github.com/tj/commander.js/tree/master/examples) 可以在这里找到。

## 许可证

[MIT](https://github.com/tj/commander.js/blob/master/LICENSE)

