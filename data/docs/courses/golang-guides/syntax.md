---
sidebar_label: 语法
sidebar_position: 3
---

# 语法

:::caution

未完待续...

:::

# 语法

类型转换

映射与切片对比

## 包

包是go代码的文件组织结构

* 通过`package`定义,使用`import`导入
* 一次可以导入多个包
* 大写字母开头的属性可以被外部调用
* `main`包中的`main`函数为程序的入口,可以编译并运行

```go
// goguide/chapter2/utils/packages.go
// 定义包
package utils

// 导入包
import "fmt"
// 一次可以导入多个包
import (
	"fmt"
	"math"
)

// 大写字母开头的属性可以被外部调用
func PackageTest() {
	fmt.Println("大写字母开头的属性可以被外部调用")
}

// goguide/chapter2/main.go
package main

import (
	"pincman.com/goguide/chapter2/utils"
)
// 入口函数
func main() {
	utils.PackageTest()
}

```

## 函数

函数是go中唯一的代码逻辑包装器,go没有传统的面向对象中的类,方法等

函数定义语法

```
func {函数名}(...参数:类型) 返回值类型
```

注意

* 参数类型相同可以只写最后一个的类型
* 可以返回多个值,并且应该直接赋值而不需要初始化
* 可以把内部的变量返回出来,推荐用于内容较少的函数,否则影响阅读
* 与其它编程语言一样函数支持闭包和变量函数
* 与TS一样闭包函数可以作为返回值并支持透传

```go
// goguide/chapter2/utils/funcs.go
package utils

// 参数类型相同可以只写最后一个的类型
func add(x, y int) int {
	return x + y
}

// 可以返回多个值
func swap(x, y string) (string, string) {
	return y, x
}

// 可以把内部的变量返回出来
func split(sum int) (x, y int) {
	x = sum * 4 / 9
	y = sum - x
	return
}

// 支持闭包函数和变量函数
func do(fn func(int, int) int) int {
    total := fn(3, 4)
	return total
}

func adder() func(int) int {
	sum := 0
    // 闭包函数可以作为返回值
	return func(x int) int {
        // 支持透传
		sum += x
		return sum
	}
}

func main() {
	ngm.Hello()
	_, say := ngm.Sayname("nangongmo", "jikebianma")
	println(say)

	p := func(x, y int) int {
		return x * y
	}
	fmt.Println(do(p))

	x := adder()
	fmt.Println(x(1), x(1))
}

```

## 变量与常量

变量使用`var`或`:=`初始化,常量使用`const`定义

1. 使用`var`声明,声明时初始化的变量可自动推导类型
2. 可只初始化不赋值,如果始终不赋值则为零值(0,false,"")
3. 一行可以声明多个变量
4. `:=`可以快捷声明变量,`:=`声明方式方式只在函数内有效
5. 声明变量可以是一个语法块
6. 类型转换:把变量放入类型函数中即可(类型必须可转换)

```go
var commentCount, postCount int

var (
	isPublishied bool   = false
	categoryName string = "learn-go"
)

func Pvar() {
	commentCount = 6
	postCount = 7
	c, python, java := true, false, "no!"

  fmt.Println(float64(commentCount), postCount, isPublishied, categoryName, c, python, java)
}
```

## 逻辑

go的逻辑运算包括`if`,`else`,`for`,`switch`

* `if`与`for`的条件外围不需要加小括号`()`
* `for`初始化语句和后置语句是可选的
* 没有`while`语句,用`for`去除两端语句就是`while`
* `for` 直接加大括号就是无限循环
* `if`条件中可执行一个表达式,比如声明变量,此变量只在`if`内部有效
* `switch`不需要`case`语句
* 没有条件的 switch 同 `switch true` 一样
* 使用`defer`语句的函数会在所在函数全部执行完毕后再执行
* `defer`语句函数会按照后进先出的顺序调用

```go
package main

import "fmt"

func main() {
    defer fmt.Println("done")
	for i := 0; i < 10; i++ {
		defer fmt.Println(i)
	}
	defer fmt.Println("counting")
    
	sum := 0
	for i := 0; i < 10; i++ {
		sum += i
	}
	fmt.Println(sum)

	sum = 1
	for sum < 100 {
		sum += sum
	}
	fmt.Println(sum)
	// for {
	   // 无限循环
	// }
	
	fmt.Println(
		pow(3, 2, 10),
		pow(3, 3, 20),
	)
    
    fmt.Println("When's Saturday?")
	today := time.Now().Weekday()
	switch time.Saturday {
	case today + 0:
		fmt.Println("Today.")
	case today + 1:
		fmt.Println("Tomorrow.")
	case today + 2:
		fmt.Println("In two days.")
	default:
		fmt.Println("Too far away.")
	}

	t := time.Now()
	switch {
	case t.Hour() < 12:
		fmt.Println("Good morning!")
	case t.Hour() < 17:
		fmt.Println("Good afternoon.")
	default:
		fmt.Println("Good evening.")
	}
}

```

## 指针

指针是一个变量的内存地址

* 使用`&{变量}`赋值一个指针,比如`p = &i`,`p`就是`i`的内存地址
* 通过`*{指针变量}`获取这个变量的值
* 使用`var p *{类型}`可以初始化一个指针类型的变量

```
package main

import (
	"fmt"
)

func main() {
	x, y := 10, 15

	s := &x
	fmt.Println(*s)
	*s = 20
	fmt.Println(x)

	s = &y
	*s = *s / 5
	fmt.Println(y)
    
}

```

## 结构体与映射

结构体类似ts中的对象类型,只是使用`struct`定义的一组键值对

结构体语法:

```
// 定义结构体类型
type {结构体名称} struct {
    {变量1} {类型1}
	{变量2} {类型2}
}
// 定义零值变量
var i:{结构体名称}
// 直接初始化变量
i := {结构体名称}{{变量1值},{变量2值}}
```

映射是结构体的一个键值对集合,类似ts中的`Map`

映射语法

```
// 定义零值变量
var m map[{索引类型}]{值类型}

// 直接赋值
var m = map[索引类型]{值}

// 通过make创建一个实例
m = make(map[{索引类型}]{值类型})
```

使用`delete({映射},{键名})`方法可通过键名删除映射一个元素

通过`m[key]`来读取一个不存在的元素的时候将返回零值(`nil`)

使用`elem, ok := m[key]`读取一个不存在的键的时候`elem`为零值,`ok`为`false`，这用于判断一个元素是否存在在映射中

注意

* 创建结构体实例时没被赋值的属性会被赋零值
* 结构体的指针可以省略`*`前缀来访问,比如`*p.X`可以直接写成`p.X`
* 通过`make`函数可以初始化一个映射实例以备后续使用
* 映射的零值为 `nil`.`nil` 映射既没有键,也不能添加键
* 如果元素的值类型是个类型名则在**直接赋值**时可以省略(通过`make`创建后单个元素赋值不可省略)

```
package main

import (
	"fmt"
)

type Vertex struct {
	X int
	Y int
}

func main() {
	v := Vertex{1, 2}
	v.X = 4
	fmt.Println(v.X)

	v2 := &v
	v2.X = 6
	fmt.Println(v.X)

	p := Vertex{X: 1}
	fmt.Println(p)

	m := make(map[string]Vertex)

	m["t"] = Vertex{
		1, 2,
	}

	h := map[string]Vertex{
		"d": {
			3, 4,
		},
	}
	fmt.Println(m["t"])
	fmt.Println(h["d"])
	v, ok := m["t"]
	fmt.Println("The value:", v, "Present?", ok)
	delete(m, "t")
	v, ok = m["t"]
	fmt.Println("The value:", v, "Present?", ok)
}
```

## 数组与切片

1. 使用`var 变量名 [长度]类型`语法定义数组
2. 使用`{数组}[开始索引:结束索引]`语法从数组中截取切片(切片不包含结束索引)
3. 使用`var 变量名 []类型`语法定义切片
4. 使用`len`获取切片长度,使用`caps`获取切片容量
5. 使用`make([]{类型},{长度}?,{容量})`的语法可创建切片(动态数组)
6. 切片可以是二维数组,用法与php的二维数组差不多
7. `append`函数(语法: `func append(s []T, vs ...T) []T`)可以给切片追加元素
8. 在`for`循环中使用`range`可遍历切片或数组,每次迭代都会返回当前元素的索引和值,语法:`for {索引}, {元素值} := range {切片/映射}`

注意

* 语法: ,.。返回的切片会指向这个新分配的数组,
* 数组长度是固定不可改变的,所以一般情况下我们会用切片代替
* 相对于数组的定义切片仅仅去除了方括号中的长度
* 切片是对数组的引用,改变切片中的元素也就改变了数组中的这个元素
* 直接创建切片后go会自动创建其底层数组
* 切片默认`开始索引`为0,而`结束索引`为该切片长度,也可以都不设置`[:]`,这样就输出原切片
* 设置`结束索引`截取切片不会改变容量,设置`开始索引`截取则会改变容量
* 切片的零值为`nil`(比如定义后没有赋值),也就是长度和容量为 0 且没有底层数组
* `append`的元素参数是解构参数,可以一次给切片添加多个元素
* 使用`append`添加元素当切片的底层数组r容量不够,它就会分配一个更大的数组,这时切片长度(`len`)就是元素的总数,而容量(`cap`)是随机的
* 与es6+/ts的`map`的遍历方法非常相似的一点是`range`可以通过`_`来忽略元素的索引或值,如果只要索引则直接忽略第二个变量即可

```
package main

import (
	"fmt"
)

func main() {

	// 使用`var 变量名 [长度]类型`所以一般情况下我们会用切片代替
	s := [6]int{2, 3, 5, 7, 11}
	s[5] = 1
	var p []int = s[1:4]
	p[2] = 100
	fmt.Println(s)
	fmt.Println(p)

	i := []struct {
		x int
		y bool
	}{{1, true}, {2, false}, {2, true}}

	j := i[1:]

	fmt.Println(i)

	fmt.Println(j)

	n := []int{2, 3, 5, 7, 11, 13}
	printSlice(n)

	// 截取切片使其长度为 0
	n = n[:0]
	printSlice(n)

	// 拓展其长度
	n = n[:4]
	printSlice(n)

	// 舍弃前两个值
	n = n[2:]
	printSlice(n)

	var k []int
	fmt.Println(s, len(k), cap(k))
	if k == nil {
		fmt.Println("nil!")
	}

	a := make([]int, 5)
	printfSlice("a", a)

	b := make([]int, 0, 5)
	printfSlice("b", b)

	c := b[:2]
	printfSlice("c", c)

	d := c[2:5]
	printfSlice("d", d)

	m := [][]string{
		{"a", "b"},
		{"c", "d"},
	}

	// 两个玩家轮流打上 X 和 O
	m[0][1] = "e"
	fmt.Println(m)

	var h []int
	// 添加一个空切片
	h = append(h, 0)
	printSlice(h)

	// 这个切片会按需增长
	h = append(h, 1)
	printSlice(h)
	h = append(h, 2, 3, 4, 5, 6)
	printSlice(h)

	var pow = []int{1, 2, 4, 8, 16, 32, 64, 128}

	for i, v := range pow {
		fmt.Printf("2**%d = %d\n", i, v)
	}

	for _, value := range pow {
		fmt.Printf("%d\n", value)
	}
	for i := range pow {
		fmt.Printf("%d\n", i)
	}
}

func printSlice(s []int) {
	fmt.Printf("len=%d cap=%d %v\n", len(s), cap(s), s)
}

func printfSlice(s string, x []int) {
	fmt.Printf("%s len=%d cap=%d %v\n",
		s, len(x), cap(x), x)
}
```

## 方法与接口

> 接口,方法中指针和值的转换是比较难记的,最简单的方法是在没有特殊要求下全部统一使用指针方式

在go中没有类这个概念,方法就是一类带特殊的 **接收者** 参数的函数

1. 使用`func ({接受者} {结构体类型}) {方法名}(...参数) 返回值类型 {}`来定义方法
2. 方法就是一个函数,可以是正常函数写法,也可以通过接受者实现
3. 方法的接受者不仅可以是结构体实力,也可以是自定义类型
4. 方法的接受者可以是一个指针,这样就可以在方法内部修改它的接受者
5. 接口是由一组方法签名定义的集合,使用`type 接口名称 interface {方法列表}`语法定义
6. 接口可以作为一个普通类型使用,比如在函数中作为参数的类型
7. 使用`interface{}`定义空接口,空接口接收任何类型的值
8. `t := i.(T)`用于类型断言并把`i`赋值给`t`,类似于ts中的`as type`或`<type>`
9. 使用`switch v := i.(type) {...}`来定义类型选择器

注意

* 方法的接受者不能为内建类型
* 接收者的类型定义和方法声明必须在同一包内
* 由于方法经常需要修改它的接收者并且为了避免每次调用方法都需要复制接受者,所以指针接受者往往更加常用
* 以指针为接受者的方法可直接使用变量值`v`或指针`&v`调用,方法会根据接受者类型自动转换
* 以值为接受者的方法可使用指针`&v`或值调用,方法会根据接受者类型自动转换
* 以指针为参数的函数则必须要使用`&v`转换为指针后作为参数传入
* 接口类型中的方法其接收者如果是个指针则其调用者必须也是指针
* 接口类型中的方法其接收者如果是个值则其调用者可以是指针也可以是值,方法会自动转换
* go的接口是隐式声明的,即一个方法接收者类型实现了一个接口的所有方法,那就相当于其实现了该接口
* 接口可用于参数的类型提示
* 接收者为零值,方法仍然可被调用,可以在内部判断是否已被赋值
* 直接调用未赋值的接口实例会运行错误,因为实例并未被实际方法所实现
* 如果类型断言中`i`不一定是`T`,则需要使用`t, ok := i.(T)`语法来根据`ok`判断,如果不是则`ok`为`false`,`t`为`T`类型的零值
* 于TS一样,在类型选择器中`case`会根据`type`来缩小类型范围,使变量值在类型提示中会使用`case`到的类型,`default`则与`i`类型相同

```
package main

import (
	"fmt"
	"math"
)

type Vertex struct {
	X, Y float64
}

type MyFloat float64

type I interface {
	M()
}

type T struct {
	S string
}

// 此方法表示类型 T 实现了接口 I，但我们无需显式声明此事。
func (t *T) M() {
	fmt.Println(t.S)
}

// 方法定义
func (v Vertex) Abs() float64 {
	return v.X + v.Y
}

// 使用函数替代写法
func Abs(v Vertex) float64 {
	return v.X + v.Y
}

// 自定义类型方法
func (f MyFloat) Abs() float64 {
	if f < 0 {
		return float64(-f)
	}
	return float64(f)
}

// 指针接收者方法
func (v *Vertex) Scale(f float64) {
	v.X = v.X + f
	v.Y = v.Y + f
}

// 指针接收者函数替代写法
func Scale(v *Vertex, f float64) {
	v.X = v.X + f
	v.Y = v.Y + f
}

// 值会自动转换成指针
func (v *Vertex) Abs2() float64 {
	return v.X + v.Y
}

// 接口定义
type H interface {
	o() float64
	r() float64
}

// 定义接口方法的指针实现
func (v *Vertex) o() float64 {
	if v.X > v.Y {
		return v.X - v.Y
	}
	return v.Y - v.X
}

// 定义接口方法的变量值实现
func (v Vertex) r() float64 {
	return v.X * v.Y
}

func (v Vertex) Scale2(f float64) {
	v.X = v.X + f
	v.Y = v.Y + f
}

type F float64

func (f F) M() {
	fmt.Println(f)
}

func main() {
	v := Vertex{3, 4}
	f := MyFloat(-1)
	fmt.Println("f.Abs: ", f.Abs())
	fmt.Println("v.Abs:", v.Abs())
	fmt.Println("Abs(v):", Abs(v))

	// 方法中自动转换值为指针,以下方法的调用结果是相同的
	// p := &v
	// p.Scale(3)
	// (*p).Scale(3)
	// (&v).Scale(3)
	v.Scale(3)
	fmt.Println("v.Abs after Scale:", v.Abs())

	// 函数参数无法自动转换,必须使用指针作为参数
	Scale(&v, 3)
	fmt.Println("Abs(v) after Scale:", Abs(v))

	// 方法中自动转换指针为值
	v2 := &Vertex{3, 4}

	v2.Scale2(3)
	fmt.Println("v2.Abs after Scale:", v2.Abs2())

	// 接口类型中的方法其接收者如果是个指针则其调用者必须也是指针
	// 所以,var v3 H = Vertex{3, 4}是错误的,因为h的实现方法的接受者是个指针(v *Vertex)
	var v3 H = &Vertex{3, 4}
	fmt.Println("v3(h).h:", v3.o())
	// 接口类型中的方法其接收者如果是个值则其调用者可以是指针也可以是值,方法会自动转换
	fmt.Println("v3(h).r:", v3.r())

	// 接口是隐式声明的,只要i(值或指针)对应的类型T实现了接口I中的所有方法,那么T就实现了I接口
	var i I

	i = &T{"Hello"}
	describe(i)

	i = F(math.Pi)
	describe(i)
}

func describe(i I) {
	i.M()
}

```

## 内建接口

**Stringer**

Stringer用于打印字符串,`fmt` 包（还有很多包）都通过此接口来打印值

语法

```
type Stringer interface {
    String() string
}
```

**Error**

error用于返回返回错误值

```
type error interface {
    Error() string
}
```

**Reader**

`io` 包指定了 `io.Reader` 接口，它表示从数据流的末尾进行读取

> Go 标准库包含了该接口的[许多实现](https://go-zh.org/search?q=Read#Global)，包括文件、网络连接、压缩和加密等等

`io.Reader` 接口有一个 `Read` 方法,定义如下

```go
func (T) Read(b []byte) (n int, err error)
```

使用示例

```go
package main

import "fmt"

type Person struct {
	Name string
	Age  int
}

func (p Person) String() string {
	return fmt.Sprintf("%v (%v years)", p.Name, p.Age)
}

func main() {
	a := Person{"Arthur Dent", 42}
	z := Person{"Zaphod Beeblebrox", 9001}
	fmt.Println(a, z)
	
	
}


```

## 泛型

