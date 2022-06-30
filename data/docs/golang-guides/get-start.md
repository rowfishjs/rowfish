---
sidebar_label: 入门
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 入门

## 开发环境

推荐使用module组织golang代码,使用vscode编码,具体可参考[官方文档](https://golang.org/doc/code.html)

### 安装

<Tabs groupId="non-mac-operating-systems" lazy>
  <TabItem value="linux" label="Linux">
  下载二进制包

```shell
sudo wget https://go.dev/dl/go{最新版本号}.linux-amd64.tar.gz -P /usr/local/src
```

解压到库目录

```shell
cd /usr/local/src && sudo tar -zxvf go{最新版本号}.linux-amd64.tar.gz -C /usr/local
```

添加环境变量

> 根据你使用的shell环境添加,如果是`bash`则添加到`.profile`或者`.bashrc`,如果是`zsh`则添加到`.zshrc`

```shell
export PATH=/usr/local/go/bin:$PATH
```
加载环境变量

```shell
source ~/.zshrc
```

升级golang版本

```shell
sudo rm -rf /usr/local/go
```

然后用上面的方法安装最新版本即可

</TabItem>
  <TabItem value="mac" label="Mac">
  通过brew安装golang

```shell
brew install go
```

升级golang版本

```shell
brew upgrade go
```
  </TabItem>
</Tabs>

查看版本

```shell
go version
```

设置仓库代理

> 除了以下方法,你也可以通过socket进行本地代理

```shell
# 设置 Go Proxy 代理
go env -w GOPROXY=https://goproxy.io,direct
```

### 编译

> 通过`go help`可以查看所有go支持的命令

**示例代码**

初始化一个golang模块

```shell
$ cd ~/Code
$ mkdir go-guide && cd $_
$ go mod init github.com/pincman/go-guide
$ touch hello.go && vi hello.go
```

在`hello.go`中写入以下代码

```go
package main

import "fmt"

func main() {
    fmt.Println("go语言开发指南.")
}
```

**基本命令**

* `go build`用于编译go代码并在当前目录产出二进制可执行文件
* `go run`用于直接运行go源代码而不生成二进制文件
* `go install`用于编译并生成二进制文件放入指定目录中

运行安装命令

```shell
go install github.com/pincman/go-guide
```

或者通过当前目录安装

```shell
go install .
```

或者

```shell
go install 
```

以上命令会编译出一个`go-guide`二进制可执行文件,此文件的文件名根据`go.mod`中指定的模块名生成,此文件的位置由`GOPATH`和`GOPATH`控制，通过以下顺序来确定`go-guide`的位置

1. 如果设置了`GOBIN`,则直接放入`GOBIN`路径下
2. 如果设置了`GOPATH`,则放入`GOPATH`列表的第一个路径下的`bin`目录下
3. 如果都没有设置,则放入`GOPATH`的默认路径`$HOME/go`下的`bin`目录下

配置以上环境变量可以通过`~/.zhsrc`,`~/.bashrc`等方式进行本地化配置,也可以使用以下命令直接配置(**推荐**)

```shell
go env -w GOBIN=/somewhere/else/bin
```

查看所有golang的环境变量

```shell
go env
```

取消一个环境变量的设置

```shell
go env -u GOBIN
```

在`shell`下尝试执行一下`go-guide`命令

> 如果只是临时执行一下编译后的文件只需要在shell中使用`export PATH=$PATH:$(dirname $(go list -f '{{.Target}}' .))`设置一下环境变量即可

```shell
go-guide
# 得到如下输出
go语言开发指南.
```

使用`go build`或者`go build.`命令会在当前目录下直接构建出一个`go-guide`的二进制文件,可以用来测试编译是否通过,并且此二进制文件就是用于部署的文件

构建之后通过`./go-guide`命令即可执行并且得到的结果与`go install`之后通过环境变量执行的结果是一样的

如果使用`go run .`命令可直接运行源代码而不生成编译文件,结果与`go install`和`go build`后运行可执行文件一样

### vscode

使用vscode打开`hello.go`文件后会自动下载一些开发工具到`GOBIN`中,更改一下format工具,打开设置面板,搜索`format`,把`go`选项的`Format Tool`改成`goformat`

打开一个`hello.go`后按`F5`创建调试文件后即可进行调试

## 代码组织

golang项目的层次为 repository(仓库)->module(模块)->package(包)->source file(源代码文件)

### 模块

模块是一个独立的库,它的作用与nodejs的npm和php的composer类似,约定俗成的命名规则是{供应商地址}:{包名称},例如: `github.com/pincman/go-guide`

模块通过`init`初始化,模块可以是一堆包的集合也可以是一个主应用程序,也就是说任何go应用本身就是一个模块

**示例代码**

> 注意: 如果使用vscode,则需要在不同的窗口打开下面两个模块,否则会报错,这个问题在下面的[多工作空间](#多工作空间)部分解决

清空刚才的`go-guide`目录,并创建一个子模块

```shell
rm -rf goguide/* && mkdir goguide/greetings && cd $_
go mod init github.com/pincman/greetings
```

在`greetings`目录下随意创建一个go文件,比如`greetings.go`,然后放入以下代码

```go
package greetings

import "fmt"

// Hello returns a greeting for the named person.
func Hello(name string) string {
    // Return a greeting that embeds the name in a message.
    message := fmt.Sprintf("你好, %v.,欢迎学习go开发指南!", name)
    return message
}
```

然后创建一个主模块

```shell
cd .. && mkdir hello && cd $_
go mod init github.com/pincman/hello
```

在`hello`目录下创建一个go文件,比如`hello.go`,在代码中导入并调用`greetings`模块的`greetings`包的`Hello`方法

```go
package main

import (
    "fmt"
    "github.com/pincman/greetings"
)

func main() {
    message := greetings.Hello("pincman")
    fmt.Println(message)
}
```

#### 模块映射

在导入第三方远程模块或者我们自己发布到远程的模块时,运行`go get`,go会自动根据模块的地址下载这些模块,比如`go get github.com/pincman/greetings/v1`,但是我们的子模块还在本地并没有发布,这时候要导入这个模块,需要做一下本地的模块映射,否则go将不知道在哪里找到它

有两种方法可以添加模块映射,效果是一样的:

直接使用命令

```shell
go mod edit -replace github.com/pincman/greetings=../greetings
```

或者手动编辑`go.mod`文件,在尾部追加(上面的命令会自动在`go.mod`中生成以下内容)

```shell
replace github.com/pincman/greetings => ../greetings
```

添加映射后可以使用`tidy`命令同步(下载)依赖到缓存目录`{GOPATH}/pkg/mod`

> 此命令会自动同步代码中导入但本地缓存中缺失的包

```shell
go mod tidy
```

此命令会在`go.mod`中自动添加以下内容

```shell
require github.com/pincman/greetings v0.0.0-00010101000000-000000000000
```

其中`v0.0.0-00010101000000-000000000000`是一个伪版本号,这是因为本地依赖的模块没有指定版本号,当我们发布这个子模块到它的仓库地址并打上标签后就可以在依赖中指定一个标签作为版本号了,例如

> 更多关于版本号的规则请查看[官方文档](https://go.dev/doc/modules/version-numbers)

```shell
require github.com/pincman/greetings v1.1.0
```

现在尝试运行一下代码

```shell
go run .

# 输出
你好, pincman.,欢迎学习go开发指南!
```

#### 清除缓存

模块的依赖(包括本地模块)会自动下载到`GOPATH`目录下的`pkg/mod`子目录,这些文件被标记成只读,可以使用下面的命令进行清除

```shell
go clean -modcache
```

### 包

包是一堆go源文件的归类,每个包在一个模块中代表了不同功能的集合,我们可以理解为包是模块的子集,和模块是多对一的关系

与typescript一样,本地模块包和第三方远程模块的包均可通过`import`关键字导入,也同样支持通过模块名为前缀的绝对路径导入,如果是处于同一模块的包也可以相对路径导入

虽然包名不是必须和目录名一样,甚至可以在模块的根目录下(参考上面示例的`greetings`模块),但是一般的情况下,为了代码结构更清晰,可以通过文件夹形式来命名包,比如在项目中创建一个`hello`目录,同时把`hello`包下的所有源文件的go文件都放置到此目录中.

**包名使用`package`关键字定义**

> 需要注意的是一些go底层包,如`fmt`等是不需要带模块前缀来导入的

#### 同模块包

**示例代码**

在上面的`hello`模块中创建一个`morestrings`目录作为`morestrings`包.添加一个go文件`reverse.go`,代码如下

```go
package morestrings
// 反转字符串
func ReverseRunes(s string) string {
    r := []rune(s)
    for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
        r[i], r[j] = r[j], r[i]
    }
    return string(r)
}
```

写好代码后编译一下,看看是否有错误(这一步不是必需的)

```shell
go build # 这不会产生输出文件,是将已编译的程序包保存在本地构建缓存中。
```

编辑`hello.go`,在`main`包中导入并在`main`函数中调用

```go
package main

import (
    "fmt"
    "github.com/pincman/hello/morestrings"
    // 因为在同一个模块下,所以可以也通过相对路径 ./morestrings 来导入
)

func main() {
    fmt.Println(morestrings.ReverseRunes("!南指发开og习学迎欢"))
}
```

查看效果

```shell
go run .

# 输出
欢迎学习go开发指南!
```

#### 异模块包

与调用程序处于不同模块的包需要先导入添加这个包所处的模块作为依赖.

导入不同模块的包(无论本地或远程包)必须使用绝对路径,使用异模块包的方式有两种

> 使用预下载的方式在一开始导入时会报错,因为这时候远程模块还没有下载,不用去管它

- 预下载: 先在代码中导入,然后使用`go mod tidy`同步下来即可
- 自动下载: 通过`go get`命令自动添加所需依赖并下载,依赖会自动写入`go.mod`,运行go命令即可(推荐)

**示例代码**

以使用gofiber启动一个web服务为例

下载gofiber

```shell
go get -u github.com/gofiber/fiber/v2
```

编辑`hello.go`

```go
package main

import "github.com/gofiber/fiber/v2"

func main() {
    app := fiber.New()

    app.Get("/", func(c *fiber.Ctx) error {
        return c.SendString("Hello, World 👋!")
    })

    app.Listen(":3000")
}
```

直接启动

```shell
go run .
```

打开`https://localhost:3000`即可看到效果

### 工作空间

前面提到vscode在一个窗口打开多个go模块时会报错,不仅如此,在每次导入一个本地模块时必须先映射这是非常麻烦的事,但是go1.18之后解决了这个问题

使用`workspaces`特性就可以在一个项目中同时开发多个模块,`go workspaces`通过`go.work`文件来配置,其配置写法与`go.mod`类似

*虽然整体概念上go workspace类似于monorepo,但有根本区别--monorepo的目的是把多个组件或应用包含在仓库里一起发布,而go workspace是每个模块独立发布,`go.work`只在本地使用*

接下来我们把go工程和pnpm开发monorepo工程做一个形象的类比,这样就比较好理解了

- go.mod -> package.json 用于指定依赖
- go.sum -> pnpm-lock.yaml 用于锁定依赖
- go的workspaces -> pnpm的workspace 一个多库同时开发的概念
- go.work -> pnpm-workspace.yaml 用于配置工作空间

#### 痛点解决

> 再次提醒,请把每个模块设置成单个仓库,不要提交整个工作空间和`go.work`

工作空间解决的最大的问题就是多模块协作工程.以前每次因为本地模块映射的原因,所以每次提交`go.mod`都需要修改一下依赖,并且要同时写多个模块的代码必须开多个vscode窗口,有了工作空间以上的问题迎刃而解

#### 使用方法

到父目录创建一个工作空间

```shell
cd ..
go work init ./hello
```

这时候多了一个`go.work`文件

下载`gofiber`源码

```shell
git clone https://github.com/gofiber/fiber
```

把`fiber`目录添加到工作空间

```shell
go work use ./fiber
```

编辑`fiber/app.go`,修改`New`函数,在顶部添加一个打印

```go
func New(config ...Config) *App {
	fmt.Println("start fiber")
	// Create a new app
	app := &App{
        // ...
```

通过模块名运行应用

```shell
go run github.com/pincman/hello
```

这时候可以看到我们的实时修改生效了,控制台打印出了`start fiber`



里面指定了这个工程用到的模块,因为我们需要用到`greetings`模块,所以加入

```shell
go work use ./greetings
```

现在`go.work`的内容如下

```shell
go {版本}

use (
	./greetings
	./hello
)
```

通过`go run 模块名`命令就可以运行`hello`模块了

```shell
go run github.com/pincman/hello
```

#### 最佳实践

1, 在本地开发的模块还没有提交到仓库并打上标签时不要把它添加到使用它的模块的`go.mod`依赖中,直接添加到`go.work`的`use`中即可使用

比如`go work ./greetings`就可以,如果在`go.mod`中添加依赖就会在`go mod tidy`或者`go work sync`时自动去下载这个模块,因为没提交,所以下载地址不存在就运行不起来了

2.本地模块提交仓库后,请立即在调用它的模块中添加它作为依赖,因为已经在workspace中加载了,所以等需要修改模块代码时修改本地代码即可生效,因为这时候不再运行下载的旧代码了

例如

在`hello/go.mod`添加

```shell
require github.com/pincman/greetings v1.0.0
```

执行`go mod tidy`

在`go.work`文件中这样设置

```shell
use (
	./greetings
	./hello
)
```

修改本地的`greetings`模块会实时生效

#### 命令解析

- `go work init {...dirs}`: 初始化时指定工作空间中需要用到的模块目录
- `go work use {...dirs}`: 用于添加工作空间中需要用到的模块目录
- `go work edit`: 类似于`go mod edit`,用于编辑`go.work`文件,一般用于开发工具
- `go work sync`: 同步构建列表中的依赖到`go.mod`中,防止`go.mod`提交到仓库后缺少一些依赖



