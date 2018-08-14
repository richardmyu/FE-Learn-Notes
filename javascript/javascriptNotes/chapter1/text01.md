# JavaScript 学习笔记

> by richardyu

<!-- TOC -->

- [JavaScript 学习笔记](#javascript-学习笔记)
  - [一. JavaScript 语言](#一-javascript-语言)
    - [广泛的使用领域](#广泛的使用领域)
        - [1.浏览器的平台化](#1浏览器的平台化)
        - [2.Node](#2node)
        - [3.数据库操作](#3数据库操作)
        - [4.跨移动平台](#4跨移动平台)
        - [5.内嵌脚本语言](#5内嵌脚本语言)
        - [6.跨平台的桌面应用程序](#6跨平台的桌面应用程序)
    - [与主流语言的相似性](#与主流语言的相似性)
    - [强大的性能](#强大的性能)
        - [1.灵活的语法，表达力强。](#1灵活的语法表达力强)
        - [2.支持编译运行。](#2支持编译运行)
        - [3.事件驱动和非阻塞式设计。](#3事件驱动和非阻塞式设计)
    - [开放性](#开放性)
  - [二.一些基础概念](#二一些基础概念)
    - [1.单线程](#1单线程)
    - [2.同步(*Synchronous*)](#2同步synchronous)
    - [3.异步(*Asynchronous*)](#3异步asynchronous)
    - [4.javascript运行机制](#4javascript运行机制)
    - [5.延迟脚本](#5延迟脚本)
    - [6.异步脚本](#6异步脚本)
    - [7.将js引入的方式](#7将js引入的方式)
    - [8.js页面输出方式](#8js页面输出方式)
      - [1.`alert()`](#1alert)
      - [2.`confirm()`](#2confirm)
      - [3.`document.write()`](#3documentwrite)
      - [4.`console.log()`](#4consolelog)
      - [5.`innerHTML/innerText`](#5innerhtmlinnertext)
    - [9.语句和表达式](#9语句和表达式)
    - [10.变量](#10变量)
    - [11.标识符](#11标识符)
    - [12.区块](#12区块)

<!-- /TOC -->

## 一. JavaScript 语言

JavaScript 是一种轻量级的脚本语言。所谓“**脚本语言**”，指的是它不具备开发操作系统的能力，而是只用来编写控制其他大型应用程序的“脚本”。

JavaScript 是一种**嵌入式（embedded）**语言。它本身提供的核心语法不算很多，只能用来做一些数学和逻辑运算。JavaScript 本身不提供任何与 I/O（输入/输出）相关的 API，都要靠**宿主环境（host）**提供，所以 JavaScript 只合适嵌入更大型的应用程序环境，去调用宿主环境提供的底层 API。

目前，已经嵌入 JavaScript 的宿主环境有多种，最常见的环境就是浏览器，另外还有服务器环境，也就是 Node 项目。

从语法角度看，JavaScript语言是一种“**对象模型**”语言。各种宿主环境通过这个模型，描述自己的功能和操作接口，从而通过 JavaScript 控制这些功能。但是，JavaScript 并不是纯粹的“面向对象语言”，还支持其他编程范式（比如**函数式编程**）。这导致几乎任何一个问题，JavaScript 都有多种解决方法。阅读本书的过程中，你会震惊地发现，JavaScript 语法是多么的灵活。

JavaScript 的核心语法部分相当精简，只包括两个部分：基本的语法构造（比如操作符、控制结构、语句）和标准库（就是一系列具有各种功能的对象比如`Array`、`Date`、`Math`等）。除此之外，各种宿主环境提供额外的 `API`（即只能在该环境使用的接口），以便 JavaScript 调用。以浏览器为例，它提供的额外 `API` 可以分成三大类。

> 浏览器控制类：操作浏览器

> DOM 类：操作网页的各种元素

> Web 类：实现互联网的各种功能

如果宿主环境是服务器，则会提供各种操作系统的 `API`，比如文件操作 `API`、网络通信 `API`等等。这些你都可以在 Node 环境中找到。

### 广泛的使用领域

近年来，JavaScript 的使用范围，慢慢超越了浏览器，正在向通用的系统语言发展。

##### 1.浏览器的平台化

随着 HTML5 的出现，浏览器本身的功能越来越强，不再仅仅能浏览网页，而是越来越像一个平台，JavaScript 因此得以调用许多系统功能，比如操作本地文件、操作图片、调用摄像头和麦克风等等。这使得 JavaScript 可以完成许多以前无法想象的事情。

##### 2.Node

Node 项目使得 JavaScript 可以用于开发服务器端的大型项目，网站的前后端都用 JavaScript 开发已经成为了现实。有些嵌入式平台能够安装 Node，于是 JavaScript 就能为这些平台开发应用程序。

##### 3.数据库操作

JavaScript 甚至也可以用来操作数据库。NoSQL 数据库这个概念，本身就是在 JSON格式的基础上诞生的，大部分 NoSQL 数据库允许 JavaScript 直接操作。基于 SQL 语言的开源数据库 PostgreSQL 支持 JavaScript 作为操作语言，可以部分取代 SQL 查询语言。

##### 4.跨移动平台

JavaScript 也正在成为手机应用的开发语言。一般来说，安卓平台使用 Java 语言开发，iOS 平台使用 Objective-C 或 Swift 语言开发。许多人正在努力，让 JavaScript 成为各个平台的通用开发语言。

> PhoneGap 项目就是将 JavaScript 和 HTML5 打包在一个容器之中，使得它能同时在 iOS 和安卓上运行。Facebook 公司的 React Native 项目则是将 JavaScript 写的组件，编译成原生组件，从而使它们具备优秀的性能。

##### 5.内嵌脚本语言

越来越多的应用程序，将 JavaScript 作为内嵌的脚本语言，比如 Adobe 公司的著名 PDF 阅读器 Acrobat、Linux 桌面环境 GNOME 3。

##### 6.跨平台的桌面应用程序

Chromium OS、Windows 8 等操作系统直接支持 JavaScript 编写应用程序。Mozilla 的 Open Web Apps 项目、Google 的 Chrome App 项目、Github 的 Electron 项目、以及 TideSDK 项目，都可以用来编写运行于 Windows、Mac OS 和 Android 等多个桌面平台的程序，不依赖浏览器。

### 与主流语言的相似性

JavaScript 的语法很类似 C/C++ 和 Java，如果学过这些语言（事实上大多数学校都教），JavaScript 的入门会非常容易。

必须说明的是，虽然核心语法不难，但是 JavaScript 的复杂性体现在另外两个方面。

首先，它涉及大量的外部 API。JavaScript 要发挥作用，必须与其他组件配合，这些外部组件五花八门，数量极其庞大，几乎涉及网络应用的各个方面，掌握它们绝非易事。

其次，JavaScript 语言有一些设计缺陷。某些地方相当不合理，另一些地方则会出现怪异的运行结果。学习 JavaScript，很大一部分时间是用来搞清楚哪些地方有陷阱。Douglas Crockford 写过一本有名的书，名字就叫《JavaScript: The Good Parts》，言下之意就是这门语言不好的地方很多，必须写一本书才能讲清楚。另外一些程序员则感到，为了更合理地编写 JavaScript 程序，就不能用 JavaScript 来写，而必须发明新的语言，比如 CoffeeScript、TypeScript、Dart 这些新语言的发明目的，多多少少都有这个因素。

### 强大的性能

##### 1.灵活的语法，表达力强。

JavaScript 既支持类似 C 语言清晰的过程式编程，也支持灵活的函数式编程。可以用来写**并发处理（concurrent）**。这些语法特性已经被证明非常强大，可以用于许多场合，尤其适用异步编程。

JavaScript 的所有值都是对象，这为程序员提供了灵活性和便利性。因为你可以很方便地、按照需要随时创造数据结构，不用进行麻烦的预定义。

JavaScript 的标准还在快速进化中，并不断合理化，并添加更适用的语法特性。

##### 2.支持编译运行。

JavaScript 语言本身，虽然是一种解释型语言，但是在现代浏览器中，JavaScript 都是编译后运行。程序会被高度优化，运行效率接近二进制程序。而且，JavaScript 引擎正在快速发展，性能将越来越好。

##### 3.事件驱动和非阻塞式设计。

JavaScript 程序可以采用**事件驱动（event-driven）**和**非阻塞式（non-blocking）**设计，在服务器端适合高并发环境，普通的硬件就可以承受很大的访问量。

### 开放性

JavaScript 是一种开放的语言。它的标准 ECMA-262 是 ISO 国际标准，写得非常详尽明确；该标准的主要实现（比如 V8 和 SpiderMonkey 引擎）都是开放的，而且质量很高。这保证了这门语言不属于任何公司或个人，不存在版权和专利的问题。

语言标准由 TC39 委员会负责制定，该委员会的运作是透明的，所有讨论都是开放的，会议记录都会对外公布。

不同公司的 JavaScript 运行环境，兼容性很好，程序不做调整或只做很小的调整，就能在所有浏览器上运行。

## 二.一些基础概念

### 1.单线程

Javascript语言的执行环境是**单线程（single thread）**，这种模式的好处是实现起来比较简单，执行环境相对单纯；坏处是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。

常见的浏览器无响应（假死），往往就是因为某一段Javascript代码长时间运行（比如死循环），导致整个页面卡在这个地方，其他任务无法执行。

HTML5 提出 Web Worker 标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。

为了解决这个问题，JavaScript语言将任务的执行模式分成两种：同步和异步。

### 2.同步(*Synchronous*)

同步指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务。

### 3.异步(*Asynchronous*)

异步任务指的是，不进入主线程、而进入**任务队列（task queue**）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

"**异步模式**"非常重要。在浏览器端，耗时很长的操作都应该异步执行，避免浏览器失去响应，最好的例子就是 `Ajax` 操作。在服务器端，"异步模式"甚至是唯一的模式，因为执行环境是单线程的，如果允许同步执行所有 `http` 请求，服务器性能会急剧下降，很快就会失去响应。

HTML 页面从上往下依次渲染，当遇到`<style>`或`<link>`标签就会去请求或者加载样式，但是不会阻碍页面的继续加载（异步）；当页面 HTML 加载完成时，对应的样式也渲染完成；然而`<script>`标签是直接加载的，会阻塞页面 HTML 标签的加载，只有`<script>`标签对之间的代码加载完了才能加载`<script>`后面的 HTML 代码；


### 4.javascript运行机制

具体来说，异步执行的运行机制如下。

（1）所有同步任务都在主线程上执行，形成一个**执行栈（execution context stack）**。

（2）主线程之外，还存在一个**事件(/任务)队列（Event queue）**。只要异步任务有了运行结果，就在"事件队列"之中放置一个事件。

（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"事件队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。

（4）主线程不断重复上面的第三步。

![Alt text](./sync-async.jpg)

只要主线程空了，就会去读取"任务队列"，这就是 JavaScript 的运行机制。这个过程会不断重复。

### 5.延迟脚本

1).`<script src="url" defer></script>` 先加载 HTML & CSS，完成后再加载js文件；局限：只能作用于外部式；

HTML4.01 为`<script>`标签定义了`defer`属性，脚本会被延迟到整个页面都解析完毕后在运行，即立即下载，延迟执行。

HML5规范要求在现实中脚本按照他们出现的先后顺序执行但在实际现实中，延迟脚本并不一定会按照顺序执行，也不一定会在`DOMContentLoaded`事件触发前执行，因此最好只包括一个延迟脚本。

2).`window.onload` 当静态资源加载完后再执行这个函数中的代码；局限：只能待页面加载完才能执行命令，不能及时加载效果；

3).在jQuery中可以使用`ready`这个方法来实现，只有 HTML 标签加载完成后就执行js代码；

```javascript
window.onload=function({
    var oBox=document.getElementById("box");
})

$(document).ready(function(){
    $(".btn1").click(function(){
        $("p").slideToggle();
    });
});
```

### 6.异步脚本

HTML5为`<script>`元素定义了`async`属性。这个属性类似`defer`，都用于改变处理脚本的行为。同样也只适用于外部脚本，并告诉浏览器立即下载文件。但与`defer`不同的是，标记为`async`的脚本并不保证按照指定它们的顺序执行。

因此，确保不同脚本互不依赖很重要。指定`async`属性的目的是不让页面等待脚本下载和执行，从而异步加载页面其他内容。为此，建议异步脚本不要在加载期间修改DOM。

异步脚本一定会在页面的`load`事件前执行，但可能会在`DOMContentLoaded`事件触发之前后之后执行。

### 7.将js引入的方式

1.行内式：（不推荐：安全性能低，可被修改）；

2.内嵌式：写在`<script></script>`中；

3.外部式：通过`<script></script>`将js文件夹引入；

> 在外部式中的`<script>`标签对之间的代码不会被执行；

CSS和js可以放在HTML中任意位置，但是实际会将CSS样式放在`<head>`之中，JavaScript样式放在`<body>`的最后面（HTML页面从上往下加载，先加载`<HTML>`标签，才能进行样式效应设计），这与其功能作用有关；而把CSS放在`<head>`，是为了先加载CSS样式再加载HTML。

### 8.js页面输出方式

#### 1.`alert()`  

1).在浏览器的弹出框显示内容，但会阻碍页面加载；
2).输出内容皆为字符串，默认调用`toString()`方法变成字符串；
3).没有返回值；

#### 2.`confirm()`

带确定和取消两个选择键的弹出框；
1).在浏览器的弹出框显示内容，但会阻碍页面加载；
2).输出内容皆为字符串，默认调用`toString()`方法变成字符串；
3).有返回值，返回值为true（确定）或false（取消）；

#### 3.`document.write()`  

在页面中输出显示内容；

#### 4.`console.log()`  

1).在控制台输出内容（最常用的一种方式）；经常用来调试；
2).常用：
`console.log()`  简单打印；
`console.dir()`  详细打印；

#### 5.`innerHTML/innerText`

`innerHTML`  

- 获取/添加对应标签对内的所有内容，包括其他标签；

`innerText`  

- 只能获取/添加内容，不包括标签；

向指定元素中动态添加内容

|语法|功能|
|--|--|
|`ele.innerHTML` |获取|
|`ele.innerHTML='';`|修改|
|`ele.innerHTML+='';`|增加|

### 9.语句和表达式

JavaScript 程序的执行单位为**行（line）**，也就是一行一行地执行。一般情况下，每一行就是一个语句。

**语句（statement）**是为了完成某种任务而进行的操作，比如下面就是一行赋值语句。

`var a = 1 + 3;`

其中`1 + 3`叫做**表达式（expression）**，指一个为了得到返回值的计算式。

语句和表达式的区别在于，前者主要为了进行某种操作，一般情况下不需要返回值；后者则是为了得到返回值，一定会返回一个值。

> 凡是 JavaScript 语言中预期为值的地方，都可以使用表达式。

语句以分号结尾，一个分号就表示一个语句结束。多个语句可以写在一行内。分号前面可以没有任何内容，JavaScript引擎将其视为空语句。

表达式不需要分号结尾。一旦在表达式后面添加分号，则 JavaScript 引擎就将表达式视为语句，这样会产生一些没有任何意义的语句。

### 10.变量

变量是对“值”的具名引用。变量就是为“值”起名，然后引用这个名字，就等同于引用这个值。变量的名字就是变量名。

JavaScript 是一种动态类型语言，也就是说，变量的类型没有限制，变量可以随时更改类型。

ECMAScript的变量是松散类型的，即可以用保存任何类型的数据。换句话说，每个变量仅仅是一个用于保存值的占位符而已。

### 11.标识符

**标识符（identifier）**指的是用来识别各种值的合法名称。最常见的标识符就是变量名，以及函数名。JavaScript 语言的标识符对大小写敏感，所以`a`和`A`是两个不同的标识符。

标识符有一套命名规则，不符合规则的就是非法标识符。JavaScript 引擎遇到非法标识符，就会报错。

简单说，标识符命名规则如下。

- --
- 第一个字符，可以是任意 `Unicode` 字母（包括英文字母和其他语言的字母），以及美元符号（`$`）和下划线（`_`）。
- 第二个字符及后面的字符，除了 `Unicode` 字母、美元符号和下划线，还可以用数字`0-9`。
- --

> JavaScript有一些保留字和关键字，不能用作标识符。

### 12.区块

JavaScript 使用大括号(`{}`)，将多个相关的语句组合在一起，称为**“区块”（block）**。

对于`var`命令来说，JavaScript 的区块不构成单独的**作用域（scope）**。