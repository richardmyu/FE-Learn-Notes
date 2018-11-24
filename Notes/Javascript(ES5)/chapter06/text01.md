## 七.DOM 模型

### 1.DOM 模型概述

#### 1.1.基本概念

##### 1.1.1 DOM

DOM 是 JavaScript 操作网页的接口，全称为“文档对象模型”（Document Object Model）。它的作用是将网页转为一个 JavaScript 对象，从而可以用脚本进行各种操作（比如增删内容）。

浏览器会根据 DOM 模型，将结构化文档（比如 HTML 和 XML）解析成一系列的节点，再由这些节点组成一个**树状结构（DOM Tree）**。所有的节点和最终的树状结构，都有规范的对外接口。

DOM 只是一个接口规范，可以用各种语言实现。所以严格地说，DOM 不是 JavaScript 语法的一部分，但是 DOM 操作是 JavaScript 最常见的任务，离开了 DOM，JavaScript 就无法控制网页。另一方面，JavaScript 也是最常用于 DOM 操作的语言。后面介绍的就是 JavaScript 对 DOM 标准的实现和用法。

##### 1.1.2 节点

DOM 的最小组成单位叫做**节点（node）**。文档的树形结构（DOM 树），就是由各种不同类型的节点组成。每个节点可以看作是文档树的一片叶子。

节点的类型有七种。

---

- `Document`：整个文档树的顶层节点
- `DocumentType`：doctype 标签（比如`<!DOCTYPE html>`）
- `Element`：网页的各种 HTML 标签（比如`<body>`、`<a>`等）
- `Attribute`：网页元素的属性（比如`class="right"`）
- `Text`：标签之间或标签包含的文本
- `Comment`：注释
- `DocumentFragment`：文档的片段

---

浏览器提供一个原生的节点对象`Node`，上面这七种节点都继承了`Node`，因此具有一些共同的属性和方法。

##### 1.1.3 节点树

一个文档的所有节点，按照所在的层级，可以抽象成一种树状结构。这种树状结构就是 DOM 树。它有一个顶层节点，下一层都是顶层节点的子节点，然后子节点又有自己的子节点，就这样层层衍生出一个金字塔结构，倒过来就像一棵树。

浏览器原生提供`document`节点，代表整个文档。

文档的第一层只有一个节点，就是 HTML 网页的第一个标签`<html>`，它构成了树结构的**根节点（root node）**，其他 HTML 标签节点都是它的下级节点。

除了根节点，其他节点都有三种层级关系。

---

- 父节点关系（parentNode）：直接的那个上级节点
- 子节点关系（childNodes）：直接的下级节点
- 同级节点关系（sibling）：拥有同一个父节点的节点

---

DOM 提供操作接口，用来获取这三种关系的节点。比如，子节点接口包括`firstChild`（第一个子节点）和`lastChild`（最后一个子节点）等属性，同级节点接口包括`nextSibling`（紧邻在后的那个同级节点）和`previousSibling`（紧邻在前的那个同级节点）属性。

#### 1.2.Node 接口的属性

所有 DOM 节点都继承了 `Node` 接口，拥有一些共同的属性和方法。这是 DOM 操作的基础。

##### 1.2.1 Node.nodeType

`nodeType`属性返回一个整数值，表示节点的类型。

`document.nodeType // 9`

Node 对象定义了几个常量，对应这些类型值。

`document.nodeType === Node.DOCUMENT_NODE // true`

不同节点的`nodeType`属性值和对应的常量如下。

---

- a.文档节点（document）：9，对应常量`Node.DOCUMENT_NODE`
- b.元素节点（element）：1，对应常量`Node.ELEMENT_NODE`
- c.属性节点（attr）：2，对应常量`Node.ATTRIBUTE_NODE`
- d.文本节点（text）：3，对应常量`Node.TEXT_NODE`
- e.文档片断节点（DocumentFragment）：11，对应常量`Node.DOCUMENT_FRAGMENT_NODE`
- f.文档类型节点（DocumentType）：10，对应常量`Node.DOCUMENT_TYPE_NODE`
- g.注释节点（Comment）：8，对应常量`Node.COMMENT_NODE`

---

确定节点类型时，使用`nodeType`属性是常用方法。

```javascript
var node = document.documentElement.firstChild;
if (node.nodeType !== Node.ELEMENT_NODE) {
  console.log("该节点是元素节点");
}
```

##### 1.2.2 Node.nodeName

`nodeName`属性返回节点的名称。

```javascript
// HTML 代码如下
// <div id="d1">hello world</div>
var div = document.getElementById("d1");
div.nodeName; // "DIV"
```

不同节点的`nodeName`属性值如下。

---

- a.文档节点（document）：`#document`
- b.元素节点（element）：大写的标签名
- c.属性节点（attr）：属性的名称
- d.文本节点（text）：`#text`
- e.文档片断节点（DocumentFragment）：`#document-fragment`
- f.文档类型节点（DocumentType）：文档的类型
- g.注释节点（Comment）：`#comment`

---

##### 1.2.3 Node.nodeValue

`nodeValue`属性返回一个字符串，表示当前节点本身的文本值，该属性可读写。

只有文本节点（text）和注释节点（comment）有文本值，因此这两类节点的`nodeValue`可以返回结果，其他类型的节点一律返回`null`。同样的，也只有这两类节点可以设置`nodeValue`属性的值，其他类型的节点设置无效。

```javascript
// HTML 代码如下
// <div id="d1">hello world</div>
var div = document.getElementById("d1");
div.nodeValue; // null
div.firstChild.nodeValue; // "hello world"
```

##### 1.2.4 Node.textContent

`textContent`属性返回当前节点和它的所有后代节点的文本内容。

```javascript
// HTML 代码为
// <div id="divA">This is <span>some</span> text</div>

document.getElementById("divA").textContent;
// This is some text
```

> `textContent`属性自动忽略当前节点内部的 HTML 标签，返回所有文本内容。

该属性是可读写的，设置该属性的值，会用一个新的文本节点，替换所有原来的子节点。它还有一个好处，就是自动对 HTML 标签转义。这很适合用于用户提供的内容。

`document.getElementById('foo').textContent = '<p>GoodBye!</p>';`

上面代码在插入文本时，会将`<p>`标签解释为文本，而不会当作标签处理。

对于文本节点（text）和注释节点（comment），`textContent`属性的值与`nodeValue`属性相同。对于其他类型的节点，该属性会将每个子节点的内容连接在一起返回，但是不包括注释节点。如果一个节点没有子节点，则返回空字符串。

文档节点（document）和文档类型节点（doctype）的`textContent`属性为`null`。如果要读取整个文档的内容，可以使用`document.documentElement.textContent`。

##### 1.2.5 Node.baseURI

`baseURI`属性返回一个字符串，表示当前网页的绝对路径。浏览器根据这个属性，计算网页上的相对路径的 URL。该属性为只读。

```javascript
// 当前网页的网址为
// http://www.example.com/index.html
document.baseURI;
// "http://www.example.com/index.html"
```

如果无法读到网页的 URL，`baseURI`属性返回`null`。

该属性的值一般由当前网址的 URL（即`window.location`属性）决定，但是可以使用 HTML 的`<base>`标签，改变该属性的值。

`<base href="http://www.example.com/page.html">`

设置了以后，`baseURI`属性就返回`<base>`标签设置的值。

##### 1.2.6 Node.ownerDocument

`Node.ownerDocument`属性返回当前节点所在的顶层文档对象，即`document`对象。

```javascript
var d = p.ownerDocument;
d === document; // true
```

`document`对象本身的`ownerDocument`属性，返回`null`。

##### 1.2.7 Node.nextSibling

`Node.nextSibling`属性返回紧跟在当前节点后面的第一个同级节点。如果当前节点后面没有同级节点，则返回`null`。

```javascript
// HTML 代码如下
// <div id="d1">hello</div><div id="d2">world</div>
var div1 = document.getElementById("d1");
var div2 = document.getElementById("d2");

d1.nextSibling === d2; // true
```

上面代码中，d1.nextSibling 就是紧跟在 d1 后面的同级节点 d2。

注意，该属性还包括文本节点和评论节点。因此如果当前节点后面有空格，该属性会返回一个文本节点，内容为空格。

`nextSibling`属性可以用来遍历所有子节点。

```javascript
var el = document.getElementById("div1").firstChild;

while (el !== null) {
  console.log(el.nodeName);
  el = el.nextSibling;
}
```

##### 1.2.8 Node.previousSibling

`previousSibling`属性返回当前节点前面的、距离最近的一个同级节点。如果当前节点前面没有同级节点，则返回`null`。

```javascript
// HTML 代码如下
// <div id="d1">hello</div><div id="d2">world</div>
var div1 = document.getElementById("d1");
var div2 = document.getElementById("d2");

d2.nextSibling === d1; // true
```

上面代码中，d2.nextSibling 就是 d2 前面的同级节点 d1。

注意，该属性还包括文本节点和评论节点。因此如果当前节点前面有空格，该属性会返回一个文本节点，内容为空格。

##### 1.2.9 Node.parentNode

`parentNode`属性返回当前节点的父节点。对于一个节点来说，它的父节点只可能是三种类型：元素节点（element）、文档节点（document）和文档片段节点（documentfragment）。

```javascript
if (node.parentNode) {
  node.parentNode.removeChild(node);
}
```

上面代码中，通过`node.parentNode`属性将`node`节点从文档里面移除。

文档节点（document）和文档片段节点（documentfragment）的父节点都是`null`。另外，对于那些生成后还没插入 DOM 树的节点，父节点也是`null`。

##### 1.2.10 Node.parentElement

`parentElement`属性返回当前节点的父元素节点。如果当前节点没有父节点，或者父节点类型不是元素节点，则返回`null`。

```javascript
if (node.parentElement) {
  node.parentElement.style.color = "red";
}
```

由于父节点只可能是三种类型：元素节点、文档节点（document）和文档片段节点（documentfragment）。`parentElement`属性相当于把后两种父节点都排除了。

##### 1.2.11 Node.firstChild，Node.lastChild

`firstChild`属性返回当前节点的第一个子节点，如果当前节点没有子节点，则返回`null`。

```javascript
// HTML 代码如下
// <p id="p1"><span>First span</span></p>
var p1 = document.getElementById("p1");
p1.firstChild.nodeName; // "SPAN"
```

上面代码中，p 元素的第一个子节点是 span 元素。

注意，`firstChild`返回的除了元素节点，还可能是文本节点或评论节点。

```javascript
// HTML 代码如下
// <p id="p1">
//   <span>First span</span>
//  </p>
var p1 = document.getElementById("p1");
p1.firstChild.nodeName; // "#text"
```

上面代码中，`p`元素与`span`元素之间有空白字符，这导致`firstChild`返回的是文本节点。

`lastChild`属性返回当前节点的最后一个子节点，如果当前节点没有子节点，则返回`null`。用法与`firstChild`属性相同。

##### 1.2.12 Node.childNodes

`childNodes`属性返回一个类似数组的对象（`NodeList`集合），成员包括当前节点的所有子节点。

`var children = document.querySelector('ul').childNodes;`

上面代码中，children 就是 ul 元素的所有子节点。

使用该属性，可以遍历某个节点的所有子节点。

```javascript
var div = document.getElementById("div1");
var children = div.childNodes;

for (var i = 0; i < children.length; i++) {
  // ...
}
```

文档节点（document）就有两个子节点：文档类型节点（docType）和 HTML 根元素节点。

```javascript
var children = document.childNodes;
for (var i = 0; i < children.length; i++) {
  console.log(children[i].nodeType);
}
// 10
// 1
```

上面代码中，文档节点的第一个子节点的类型是 10（即文档类型节点），第二个子节点的类型是 1（即元素节点）。

注意，除了元素节点，`childNodes`属性的返回值还包括文本节点和注释节点。如果当前节点不包括任何子节点，则返回一个空的`NodeList`集合。由于`NodeList`对象是一个动态集合，一旦子节点发生变化，立刻会反映在返回结果之中。

##### 1.2.13 Node.isConnected

`isConnected`属性返回一个布尔值，表示当前节点是否在文档之中。

```javascript
var test = document.createElement("p");
test.isConnected; // false

document.body.appendChild(test);
test.isConnected; // true
```

上面代码中，`test`节点是脚本生成的节点，没有插入文档之前，`isConnected`属性返回 false，插入之后返回 true。

#### 1.3.Node 接口的方法

##### 1.3.1 Node.appendChild()

`appendChild`方法接受一个节点对象作为参数，将其作为最后一个子节点，插入当前节点。该方法的返回值就是插入文档的子节点。

```javascript
var p = document.createElement("p");
document.body.appendChild(p);
```

上面代码新建一个`<p>`节点，将其插入`document.body`的尾部。

如果参数节点是 DOM 已经存在的节点，`appendChild`方法会将其从原来的位置，移动到新位置。

```javascript
var element = document
  .createElement("div")
  .appendChild(document.createElement("b"));
```

上面代码的返回值是`<b></b>`，而不是`<div></div>`。

如果`appendChild`方法的参数是`DocumentFragment`节点，那么插入的是`DocumentFragment`的所有子节点，而不是`DocumentFragment`节点本身。返回值是一个空的`DocumentFragment`节点。

##### 1.3.2 Node.hasChildNodes()

`hasChildNodes`方法返回一个布尔值，表示当前节点是否有子节点。

```javascript
var foo = document.getElementById("foo");

if (foo.hasChildNodes()) {
  foo.removeChild(foo.childNodes[0]);
}
```

上面代码表示，如果 foo 节点有子节点，就移除第一个子节点。

注意，子节点包括所有节点，哪怕节点只包含一个空格，`hasChildNodes`方法也会返回 true。

判断一个节点有没有子节点，有许多种方法，下面是其中的三种。

---

- `node.hasChildNodes()`
- `node.firstChild !== null`
- `node.childNodes && node.childNodes.length > 0`

---

`hasChildNodes`方法结合`firstChild`属性和`nextSibling`属性，可以遍历当前节点的所有后代节点。

```javascript
function DOMComb(parent, callback) {
  if (parent.hasChildNodes()) {
    for (var node = parent.firstChild; node; node = node.nextSibling) {
      DOMComb(node, callback);
    }
  }
  callback(parent);
}

// 用法
DOMComb(document.body, console.log);
```

上面代码中，DOMComb 函数的第一个参数是某个指定的节点，第二个参数是回调函数。这个回调函数会依次作用于指定节点，以及指定节点的所有后代节点。

##### 1.3.3 Node.cloneNode()

`cloneNode`方法用于克隆一个节点。它接受一个布尔值作为参数，表示是否同时克隆子节点。它的返回值是一个克隆出来的新节点。

`var cloneUL = document.querySelector('ul').cloneNode(true);`

该方法有一些使用注意点。

---

1).克隆一个节点，会拷贝该节点的所有属性，但是会丧失 addEventListener 方法和 on-属性（即 node.onclick = fn），添加在这个节点上的事件回调函数。

---

2).该方法返回的节点不在文档之中，即没有任何父节点，必须使用诸如 Node.appendChild 这样的方法添加到文档之中。

---

3).克隆一个节点之后，DOM 有可能出现两个有相同 id 属性（即 id="xxx"）的网页元素，这时应该修改其中一个元素的 id 属性。如果原节点有 name 属性，可能也需要修改。

---

##### 1.3.4 Node.insertBefore()

`insertBefore`方法用于将某个节点插入父节点内部的指定位置。

`var insertedNode = parentNode.insertBefore(newNode, referenceNode);`

`insertBefore`方法接受两个参数，第一个参数是所要插入的节点`newNode`，第二个参数是父节点`parentNode`内部的一个子节点`referenceNode`。`newNode`将插在`referenceNode`这个子节点的前面。返回值是插入的新节点`newNode`。

```javascript
var p = document.createElement("p");
document.body.insertBefore(p, document.body.firstChild);
```

上面代码中，新建一个`<p>`节点，插在`document.body.firstChild`的前面，也就是成为`document.body`的第一个子节点。

如果`insertBefore`方法的第二个参数为`null`，则新节点将插在当前节点内部的最后位置，即变成最后一个子节点。

```javascript
var p = document.createElement("p");
document.body.insertBefore(p, null);
```

上面代码中，`p`将成为`document.body`的最后一个子节点。这也说明`insertBefore`的第二个参数不能省略。

注意，如果所要插入的节点是当前 DOM 现有的节点，则该节点将从原有的位置移除，插入新的位置。

由于不存在`insertAfter`方法，如果新节点要插在父节点的某个子节点后面，可以用`insertBefore`方法结合`nextSibling`属性模拟。

`parent.insertBefore(s1, s2.nextSibling);`

上面代码中，`parent`是父节点，s1 是一个全新的节点，s2 是可以将 s1 节点，插在 s2 节点的后面。如果 s2 是当前节点的最后一个子节点，则 s2.nextSibling 返回`null`，这时 s1 节点会插在当前节点的最后，变成当前节点的最后一个子节点，等于紧跟在 s2 的后面。

如果要插入的节点是`DocumentFragment`类型，那么插入的将是`DocumentFragment`的所有子节点，而不是`DocumentFragment`节点本身。返回值将是一个空的`DocumentFragment`节点。

##### 1.3.5 Node.removeChild()

`removeChild`方法接受一个子节点作为参数，用于从当前节点移除该子节点。返回值是移除的子节点。

```javascript
var divA = document.getElementById("A");
divA.parentNode.removeChild(divA);
```

上面代码移除了 divA 节点。注意，这个方法是在 divA 的父节点上调用的，不是在 divA 上调用的。

下面是如何移除当前节点的所有子节点。

```javascript
var element = document.getElementById("top");
while (element.firstChild) {
  element.removeChild(element.firstChild);
}
```

被移除的节点依然存在于内存之中，但不再是 DOM 的一部分。所以，一个节点移除以后，依然可以使用它，比如插入到另一个节点下面。

如果参数节点不是当前节点的子节点，`removeChild`方法将报错。

##### 1.3.6 Node.replaceChild()

`replaceChild`方法用于将一个新的节点，替换当前节点的某一个子节点。

`var replacedNode = parentNode.replaceChild(newChild, oldChild);`

上面代码中，`replaceChild`方法接受两个参数，第一个参数`newChild`是用来替换的新节点，第二个参数`oldChild`是将要替换走的子节点。返回值是替换走的那个节点`oldChild`。

```javascript
var divA = document.getElementById("divA");
var newSpan = document.createElement("span");
newSpan.textContent = "Hello World!";
divA.parentNode.replaceChild(newSpan, divA);
```

上面代码是如何将指定节点 divA 替换走。

##### 1.3.7 Node.contains()

`contains`方法返回一个布尔值，表示参数节点是否满足以下三个条件之一。

---

- 参数节点为当前节点。
- 参数节点为当前节点的子节点。
- 参数节点为当前节点的后代节点。

---

`document.body.contains(node)`

上面代码检查参数节点 node，是否包含在当前文档之中。

注意，当前节点传入`contains`方法，返回 true。

`nodeA.contains(nodeA) // true`

##### 1.3.8 Node.compareDocumentPosition()

`compareDocumentPosition`方法的用法，与`contains`方法完全一致，返回一个七个比特位的二进制值，表示参数节点与当前节点的关系。

| 二进制值 | 十进制值 | 含义                                               |
| -------- | :------: | -------------------------------------------------- |
| 000000   |    0     | 两个节点相同                                       |
| 000001   |    1     | 两个节点不在同一个文档（即有一个节点不在当前文档） |
| 000010   |    2     | 参数节点在当前节点的前面                           |
| 000100   |    4     | 参数节点在当前节点的后面                           |
| 001000   |    8     | 参数节点包含当前节点                               |
| 010000   |    16    | 当前节点包含参数节点                               |
| 100000   |    32    | 浏览器内部使用                                     |

```javascript
// HTML 代码如下
// <div id="mydiv">
//   <form><input id="test" /></form>
// </div>

var div = document.getElementById("mydiv");
var input = document.getElementById("test");

div.compareDocumentPosition(input); // 20
input.compareDocumentPosition(div); // 10
```

上面代码中，节点 div 包含节点`input`（二进制 010000），而且节点`input`在节点 div 的后面（二进制 000100），所以第一个`compareDocumentPosition`方法返回 20（二进制 010100，即 010000 + 000100），第二个`compareDocumentPosition`方法返回 10（二进制 001010）。

由于`compareDocumentPosition`返回值的含义，定义在每一个比特位上，所以如果要检查某一种特定的含义，就需要使用比特位运算符。

```javascript
var head = document.head;
var body = document.body;
if (head.compareDocumentPosition(body) & 4) {
  console.log("文档结构正确");
} else {
  console.log("<body> 不能在 <head> 前面");
}
```

上面代码中，`compareDocumentPosition`的返回值与 4（又称掩码）进行与运算（`&`），得到一个布尔值，表示`<head>`是否在`<body>`前面。

##### 1.3.9 Node.isEqualNode()，Node.isSameNode()

`isEqualNode`方法返回一个布尔值，用于检查两个节点是否相等。所谓相等的节点，指的是两个节点的类型相同、属性相同、子节点相同。

```javascript
var p1 = document.createElement("p");
var p2 = document.createElement("p");

p1.isEqualNode(p2); // true
```

`isSameNode`方法返回一个布尔值，表示两个节点是否为同一个节点。

```javascript
var p1 = document.createElement("p");
var p2 = document.createElement("p");

p1.isSameNode(p2); // false
p1.isSameNode(p1); // true
```

##### 1.3.10 Node.normalize()

`normailize`方法用于清理当前节点内部的所有文本节点（text）。它会去除空的文本节点，并且将毗邻的文本节点合并成一个，也就是说不存在空的文本节点，以及毗邻的文本节点。

```javascript
var wrapper = document.createElement("div");

wrapper.appendChild(document.createTextNode("Part 1 "));
wrapper.appendChild(document.createTextNode("Part 2 "));

wrapper.childNodes.length; // 2
wrapper.normalize();
wrapper.childNodes.length; // 1
```

上面代码使用`normalize`方法之前，wrapper 节点有两个毗邻的文本子节点。使用`normalize`方法之后，两个文本子节点被合并成一个。

该方法是`Text.splitText`的逆方法。

##### 1.3.11 Node.getRootNode()

`getRootNode`方法返回当前节点所在文档的根节点。

`document.body.firstChild.getRootNode() === document // true`

#### 1.4.NodeList 接口

节点都是单个对象，有时需要一种数据结构，能够容纳多个节点。DOM 提供两种节点集合，用于容纳多个节点：`NodeList`和`HTMLCollection`。

这两种集合都属于接口规范。许多 DOM 属性和方法，返回的结果是`NodeList`实例或`HTMLCollection`实例。

##### 1.4.1 概述

`NodeList`实例是一个类似数组的对象，它的成员是节点对象。通过以下方法可以得到`NodeList`实例。

- `Node.childNodes`
- `document.querySelectorAll()、document.getElementsByTagName()`等节点搜索方法

`document.body.childNodes instanceof NodeList // true`

`NodeList`实例很像数组，可以使用`length`属性和`forEach`方法。但是，它不是数组，不能使用`pop`或`push`之类数组特有的方法。

```javascript
var children = document.body.childNodes;

Array.isArray(children); // false

children.length; // 34
children.forEach(console.log);
```

上面代码中，`NodeList` 实例`children`不是数组，但是具有`length`属性和`forEach`方法。

如果`NodeList`实例要使用数组方法，可以将其转为真正的数组。

```javascript
var children = document.body.childNodes;
var nodeArr = Array.prototype.slice.call(children);
```

除了使用`forEach`方法遍历 `NodeList` 实例，还可以使用`for`循环。

```javascript
var children = document.body.childNodes;

for (var i = 0; i < children.length; i++) {
  var item = children[i];
}
```

注意，`NodeList` 实例可能是动态集合，也可能是静态集合。所谓动态集合就是一个活的集合，DOM 删除或新增一个相关节点，都会立刻反映在 `NodeList` 实例。目前，只有`Node.childNodes`返回的是一个动态集合，其他的 `NodeList` 都是静态集合。

```javascript
var children = document.body.childNodes;
children.length; // 18
document.body.appendChild(document.createElement("p"));
children.length; // 19
```

上面代码中，文档增加一个子节点，`NodeList` 实例`children`的`length`属性就增加了 1。

##### 1.4.2 NodeList.prototype.length

`length`属性返回 `NodeList` 实例包含的节点数量。

`document.getElementsByTagName('xxx').length// 0`

上面代码中，`document.getElementsByTagName`返回一个 `NodeList` 集合。对于那些不存在的 HTML 标签，`length`属性返回 0。

##### 1.4.3 NodeList.prototype.forEach()

`forEach`方法用于遍历 `NodeList` 的所有成员。它接受一个回调函数作为参数，每一轮遍历就执行一次这个回调函数，用法与数组实例的`forEach`方法完全一致。

```javascript
var children = document.body.childNodes;
children.forEach(function f(item, i, list) {
  // ...
}, this);
```

上面代码中，回调函数 f 的三个参数依次是当前成员、位置和当前 `NodeList` 实例。`forEach`方法的第二个参数，用于绑定回调函数内部的`this`，该参数可省略。

##### 1.4.4 NodeList.prototype.item()

`item`方法接受一个整数值作为参数，表示成员的位置，返回该位置上的成员。

`document.body.childNodes.item(0)`

如果参数值大于实际长度，或者索引不合法（比如负数），`item`方法返回`null`。如果省略参数，`item`方法会报错。

所有类似数组的对象，都可以使用方括号运算符取出成员。一般情况下，都是使用方括号运算符，而不使用`item`方法。

`document.body.childNodes[0]`

##### 1.4.5 NodeList.prototype.keys()，NodeList.prototype.values()，NodeList.prototype.entries()

这三个方法都返回一个 ES6 的遍历器对象，可以通过`for...of`循环遍历获取每一个成员的信息。区别在于，`keys()`返回键名的遍历器，`values()`返回键值的遍历器，`entries()`返回的遍历器同时包含键名和键值的信息。

```javascript
var children = document.body.childNodes;

for (var key of children.keys()) {
  console.log(key);
}
// 0
// 1
// 2
// ...

for (var value of children.values()) {
  console.log(value);
}
// #text
// <script>
// ...

for (var entry of children.entries()) {
  console.log(entry);
}
// Array [ 0, #text ]
// Array [ 1, <script> ]
// ...
```

#### 1.5.HTMLCollection 接口

##### 1.5.1 概述

`HTMLCollection`是一个节点对象的集合，只能包含元素节点（element），不能包含其他类型的节点。它的返回值是一个类似数组的对象，但是与`NodeList`接口不同，`HTMLCollection`没有`forEach`方法，只能使用`for`循环遍历。

返回`HTMLCollection`实例的，主要是一些`Document`对象的集合属性，比如`document.links、docuement.forms、document.images`等。

`document.links instanceof HTMLCollection // true`

`HTMLCollection`实例都是动态集合，节点的变化会实时反映在集合中。

如果元素节点有`id`或`name`属性，那么`HTMLCollection`实例上面，可以使用`id`属性或`name`属性引用该节点元素。如果没有对应的节点，则返回`null`。

```javascript
// HTML 代码如下
// <img id="pic" src="http://example.com/foo.jpg">

var pic = document.getElementById("pic");
document.images.pic === pic; // true
```

上面代码中，`document.images`是一个`HTMLCollection`实例，可以通过`<img>`元素的`id`属性值，从`HTMLCollection`实例上取到这个元素。

##### 1.5.2 HTMLCollection.prototype.length

`length`属性返回`HTMLCollection`实例包含的成员数量。

`document.links.length // 18`

##### 1.5.3 HTMLCollection.prototype.item()

`item`方法接受一个整数值作为参数，表示成员的位置，返回该位置上的成员。

```javascript
var c = document.images;
var img0 = c.item(0);
```

上面代码中，`item(0)`表示返回 0 号位置的成员。由于方括号运算符也具有同样作用，而且使用更方便，所以一般情况下，总是使用方括号运算符。

如果参数值超出成员数量或者不合法（比如小于 0），那么`item`方法返回`null`。

##### 1.5.4 HTMLCollection.prototype.namedItem()

`namedItem`方法的参数是一个字符串，表示`id`属性或`name`属性的值，返回对应的元素节点。如果没有对应的节点，则返回`null`。

```javascript
// HTML 代码如下
// <img id="pic" src="http://example.com/foo.jpg">

var pic = document.getElementById("pic");
document.images.namedItem("pic") === pic; // true
```

#### 1.6.ParentNode 接口

节点对象除了继承 Node 接口以外，还会继承其他接口。`ParentNode`接口表示当前节点是一个父节点，提供一些处理子节点的方法。`ChildNode`接口表示当前节点是一个子节点，提供一些相关方法。

如果当前节点是父节点，就会继承`ParentNode`接口。由于只有元素节点（element）、文档节点（document）和文档片段节点（documentFragment）拥有子节点，因此只有这三类节点会继承`ParentNode`接口。

##### 1.6.1 ParentNode.children

`children`属性返回一个`HTMLCollection`实例，成员是当前节点的所有元素子节点。该属性只读。

下面是遍历某个节点的所有元素子节点的示例。

```javascript
for (var i = 0; i < el.children.length; i++) {
  // ...
}
```

注意，`children`属性只包括元素子节点，不包括其他类型的子节点（比如文本子节点）。如果没有元素类型的子节点，返回值`HTMLCollection`实例的`length`属性为 0。

另外，`HTMLCollection`是动态集合，会实时反映 DOM 的任何变化。

##### 1.6.2 ParentNode.firstElementChild

`firstElementChild`属性返回当前节点的第一个元素子节点。如果没有任何元素子节点，则返回`null`。

`document.firstElementChild.nodeName// "HTML"`

##### 1.6.3 ParentNode.lastElementChild

`lastElementChild`属性返回当前节点的最后一个元素子节点，如果不存在任何元素子节点，则返回`null`。

`document.lastElementChild.nodeName// "HTML"`

上面代码中，`document`节点的最后一个元素子节点是`<HTML>`（因为`document`只包含这一个元素子节点）。

##### 1.6.4 ParentNode.childElementCount

`childElementCount`属性返回一个整数，表示当前节点的所有元素子节点的数目。如果不包含任何元素子节点，则返回 0。

`document.body.childElementCount // 13`

##### 1.6.5 ParentNode.append()，ParentNode.prepend()

`append`方法为当前节点追加一个或多个子节点，位置是最后一个元素子节点的后面。

该方法不仅可以添加元素子节点，还可以添加文本子节点。

```javascript
var parent = document.body;

// 添加元素子节点
var p = document.createElement("p");
parent.append(p);

// 添加文本子节点
parent.append("Hello");

// 添加多个元素子节点
var p1 = document.createElement("p");
var p2 = document.createElement("p");
parent.append(p1, p2);

// 添加元素子节点和文本子节点
var p = document.createElement("p");
parent.append("Hello", p);
```

注意，该方法没有返回值。

`prepend`方法为当前节点追加一个或多个子节点，位置是第一个元素子节点的前面。它的用法与`append`方法完全一致，也是没有返回值。

#### 1.7.ChildNode 接口

如果一个节点有父节点，那么该节点就继承了`ChildNode`接口。

##### 1.7.1 ChildNode.remove()

`remove`方法用于从父节点移除当前节点。

`el.remove()`

##### 1.7.2 ChildNode.before()，ChildNode.after()

`before`方法用于在当前节点的前面，插入一个或多个同级节点。两者拥有相同的父节点。

注意，该方法不仅可以插入元素节点，还可以插入文本节点。

```javascript
var p = document.createElement("p");
var p1 = document.createElement("p");

// 插入元素节点
el.before(p);

// 插入文本节点
el.before("Hello");

// 插入多个元素节点
el.before(p, p1);

// 插入元素节点和文本节点
el.before(p, "Hello");
```

`after`方法用于在当前节点的后面，插入一个或多个同级节点，两者拥有相同的父节点。用法与`before`方法完全相同。

##### 1.7.3ChildNode.replaceWith()

`replaceWith`方法使用参数节点，替换当前节点。参数可以是元素节点，也可以是文本节点。

```javascript
var span = document.createElement("span");
el.replaceWith(span);
```

### 2.document 对象

#### 2.1.概述

`document`对象是文档的根节点，每张网页都有自己的`document`对象。`window.document`属性就指向这个对象。只要浏览器开始载入 HTML 文档，该对象就存在了，可以直接使用。

`document`对象有不同的办法可以获取。

---

- a.正常的网页，直接使用`document`或`window.document`。
- b.`iframe`框架里面的网页，使用`iframe`节点的`contentDocument`属性。
- c.Ajax 操作返回的文档，使用`XMLHttpRequest`对象的`responseXML`属性。
- d.内部节点的`ownerDocument`属性。

---

`document`对象继承了`EventTarget`接口、`Node`接口、`ParentNode`接口。这意味着，这些接口的方法都可以在`document`对象上调用。除此之外，`document`对象还有很多自己的属性和方法。

#### 2.2.属性

##### 2.2.1 快捷方式属性

以下属性是指向文档内部的某个节点的快捷方式。

1).document.defaultView

`document.defaultView`属性返回`document`对象所属的`window`对象。如果当前文档不属于`window`对象，该属性返回`null`。

`document.defaultView === window // true`

2).document.doctype

对于 HTML 文档来说，`document`对象一般有两个子节点。第一个子节点是`document.doctype`，指向`<DOCTYPE>`节点，即文档类型（Document Type Declaration，简写 DTD）节点。HTML 的文档类型节点，一般写成`<!DOCTYPE html>`。如果网页没有声明 DTD，该属性返回`null`。

```javascript
var doctype = document.doctype;
doctype; // "<!DOCTYPE html>"
doctype.name; // "html"
```

`document.firstChild`通常就返回这个节点。

3).document.documentElement

`document.documentElement`属性返回当前文档的根节点（root）。它通常是`document`节点的第二个子节点，紧跟在`document.doctype`节点后面。HTML 网页的该属性，一般是`<html>`节点。

4).document.body，document.head

`document.body`属性指向`<body>`节点，`document.head`属性指向`<head>`节点。

这两个属性总是存在的，如果网页源码里面省略了`<head>`或`<body>`，浏览器会自动创建。另外，这两个属性是可写的，如果改写它们的值，相当于移除所有子节点。

5).document.scrollingElement

`document.scrollingElement`属性返回文档的滚动元素。也就是说，当文档整体滚动时，到底是哪个元素在滚动。

标准模式下，这个属性返回的文档的根元素`document.documentElement`（即`<html>`）。**兼容（quirk）**模式下，返回的是`<body>`元素，如果该元素不存在，返回`null`。

```javascript
// 页面滚动到浏览器顶部
document.scrollingElement.scrollTop = 0;
```

6).document.activeElement

`document.activeElement`属性返回获得当前**焦点（focus）**的 DOM 元素。通常，这个属性返回的是`<input>`、`<textarea>`、`<select>`等表单元素，如果当前没有焦点元素，返回`<body>`元素或`null`。

7).document.fullscreenElement

`document.fullscreenElement`属性返回当前以全屏状态展示的 DOM 元素。如果不是全屏状态，该属性返回`null`。

```javascript
if (document.fullscreenElement.nodeName == "VIDEO") {
  console.log("全屏播放视频");
}
```

上面代码中，通过`document.fullscreenElement`可以知道`<video>`元素有没有处在全屏状态，从而判断用户行为。

##### 2.2.2 节点集合属性

以下属性返回一个`HTMLCollection`实例，表示文档内部特定元素的集合。这些集合都是动态的，原节点有任何变化，立刻会反映在集合中。

1).document.links

`document.links`属性返回当前文档所有设定了`href`属性的`<a>`及`<area>`节点。

```javascript
// 打印文档所有的链接
var links = document.links;
for (var i = 0; i < links.length; i++) {
  console.log(links[i]);
}
```

2).document.forms

`document.forms`属性返回所有`<form>`表单节点。

`var selectForm = document.forms[0];`

3).document.images

`document.images`属性返回页面所有`<img>`图片节点。

```javascript
var imglist = document.images;

for (var i = 0; i < imglist.length; i++) {
  if (imglist[i].src === "banner.gif") {
    // ...
  }
}
```

4).document.embeds，document.plugins

`document.embeds`属性和`document.plugins`属性，都返回所有`<embed>`节点。

5).document.scripts

`document.scripts`属性返回所有`<script>`节点。

```javascript
var scripts = document.scripts;
if (scripts.length !== 0) {
  console.log("当前网页有脚本");
}
```

6).document.styleSheets

`document.styleSheets`属性返回文档内嵌或引入的样式表集合。

7).小结

除了`document.styleSheets`，以上的集合属性返回的都是`HTMLCollection`实例。

```javascript
document.links instanceof HTMLCollection; // true
document.images instanceof HTMLCollection; // true
document.forms instanceof HTMLCollection; // true
document.embeds instanceof HTMLCollection; // true
document.scripts instanceof HTMLCollection; // true
```

`HTMLCollection`实例是类似数组的对象，所以这些属性都有`length`属性，都可以使用方括号运算符引用成员。如果成员有`id`或`name`属性，还可以用这两个属性的值，在`HTMLCollection`实例上引用到这个成员。

```javascript
// HTML 代码如下
// <form name="myForm">
document.myForm === document.forms.myForm; // true
```

##### 2.2.3 文档静态信息属性

以下属性返回文档信息。

1).document.documentURI，document.URL

`document.documentURI`属性和`document.URL`属性都返回一个字符串，表示当前文档的网址。不同之处是它们继承自不同的接口，`documentURI`继承自`Document`接口，可用于所有文档；URL 继承自`HTMLDocument`接口，只能用于 HTML 文档。

```javascript
document.URL;
// http://www.example.com/about

document.documentURI === document.URL;
// true
```

如果文档的**锚点（#anchor）**变化，这两个属性都会跟着变化。

2).document.domain

`document.domain`属性返回当前文档的域名，不包含协议和接口。比如，网页的网址是`http://www.example.com:80/hello.html`，那么`domain`属性就等于`www.example.com`。如果无法获取域名，该属性返回`null`。

`document.domain`基本上是一个只读属性，只有一种情况除外。次级域名的网页，可以把`document.domain`设为对应的上级域名。比如，当前域名是`a.sub.example.com`，则`document.domain`属性可以设置为`sub.example.com`，也可以设为`example.com`。修改后，`document.domain`相同的两个网页，可以读取对方的资源，比如设置的 `Cookie`。

另外，设置`document.domain`会导致端口被改成`null`。因此，如果通过设置`document.domain`来进行通信，双方网页都必须设置这个值，才能保证端口相同。

3).document.location

`Location`对象是浏览器提供的原生对象，提供 URL 相关的信息和操作方法。通过`window.location和document.location`属性，可以拿到这个对象。

4).document.lastModified

`document.lastModified`属性返回一个字符串，表示当前文档最后修改的时间。不同浏览器的返回值，日期格式是不一样的。

`document.lastModified// "03/07/2018 11:18:27"`

注意，`document.lastModified`属性的值是字符串，所以不能直接用来比较。`Date.parse`方法将其转为`Date`实例，才能比较两个网页。

```javascript
var lastVisitedDate = Date.parse("01/01/2018");
if (Date.parse(document.lastModified) > lastVisitedDate) {
  console.log("网页已经变更");
}
```

如果页面上有 JavaScript 生成的内容，`document.lastModified`属性返回的总是当前时间。

5).document.title

`document.title`属性返回当前文档的标题。默认情况下，返回`<title>`节点的值。但是该属性是可写的，一旦被修改，就返回修改后的值。

```javascript
document.title = "新标题";
document.title; // "新标题"
```

6).document.characterSet

`document.characterSet`属性返回当前文档的编码，比如`UTF-8`、`ISO-8859-1`等等。

7).document.referrer

`document.referrer`属性返回一个字符串，表示当前文档的访问者来自哪里。

`document.referrer// "https://example.com/path"`

如果无法获取来源，或者用户直接键入网址而不是从其他网页点击进入，`document.referrer`返回一个空字符串。

`document.referrer`的值，总是与 HTTP 头信息的`Referer`字段保持一致。但是，`document.referrer`的拼写有两个 r，而头信息的`Referer`字段只有一个 r。

8).document.dir

`document.dir`返回一个字符串，表示文字方向。它只有两个可能的值：`rtl`表示文字从右到左，阿拉伯文是这种方式；`ltr`表示文字从左到右，包括英语和汉语在内的大多数文字采用这种方式。

9).document.compatMode

`compatMode`属性返回浏览器处理文档的模式，可能的值为`BackCompat`（向后兼容模式）和`CSS1Compat`（严格模式）。

一般来说，如果网页代码的第一行设置了明确的`DOCTYPE`（比如`<!doctype html>`），`document.compatMode`的值都为`CSS1Compat`。

##### 2.2.4 文档状态属性

1).document.hidden

`document.hidden`属性返回一个布尔值，表示当前页面是否可见。如果窗口最小化、浏览器切换了 Tab，都会导致导致页面不可见，使得`document.hidden`返回 true。

这个属性是 Page Visibility API 引入的，一般都是配合这个 API 使用。

2).document.visibilityState

`document.visibilityState`返回文档的可见状态。

它的值有四种可能。

---

- a.visible：页面可见。注意，页面可能是部分可见，即不是焦点窗口，前面被其他窗口部分挡住了。
- b.hidden： 页面不可见，有可能窗口最小化，或者浏览器切换到了另一个 Tab。
- c.prerender：页面处于正在渲染状态，对于用于来说，该页面不可见。
- d.unloaded：页面从内存里面卸载了。

---

这个属性可以用在页面加载时，防止加载某些资源；或者页面不可见时，停掉一些页面功能。

（3）document.readyState

`document.readyState`属性返回当前文档的状态，共有三种可能的值。

---

- `loading`：加载 HTML 代码阶段（尚未完成解析）
- `interactive`：加载外部资源阶段
- `complete`：加载完成

---

这个属性变化的过程如下。

---

- a.浏览器开始解析 HTML 文档，`document.readyState`属性等于`loading`。
- b.浏览器遇到 HTML 文档中的`<script>`元素，并且没有`async`或`defer`属性，就暂停解析，开始执行脚本，这时`document.readyState`属性还是等于`loading`。
- c.HTML 文档解析完成，`document.readyState`属性变成`interactive`。
- d.浏览器等待图片、样式表、字体文件等外部资源加载完成，一旦全部加载完成，`document.readyState`属性变成`complete`。

---

下面的代码用来检查网页是否加载成功。

```javascript
// 基本检查
if (document.readyState === "complete") {
  // ...
}

// 轮询检查
var interval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(interval);
    // ...
  }
}, 100);
```

另外，每次状态变化都会触发一个`readystatechange`事件。

##### 2.2.5 document.cookie

`document.cookie`属性用来操作浏览器 `Cookie`。

##### 2.2.6 document.designMode

`document.designMode`属性控制当前文档是否可编辑，通常用在所见即所得编辑器。该属性只有两个值`on`和`off`，默认值为`off`。

下面代码打开`iframe`元素内部文档的`designMode`属性，就能将其变为一个所见即所得的编辑器。

```javascript
// HTML 代码如下
// <iframe id="editor" src="about:blank"></iframe>
var editor = document.getElementById("editor");
editor.contentDocument.designMode = "on";
```

##### 2.2.7 document.implementation

`document.implementation`属性返回一个`DOMImplementation`对象。该对象有三个方法，主要用于创建独立于当前文档的新的 `Document` 对象。

---

- DOMImplementation.createDocument()：创建一个 XML 文档。
- DOMImplementation.createHTMLDocument()：创建一个 HTML 文档。
- DOMImplementation.createDocumentType()：创建一个 DocumentType 对象。

---

下面是创建 HTML 文档的例子。

```javascript
var doc = document.implementation.createHTMLDocument("Title");
var p = doc.createElement("p");
p.innerHTML = "hello world";
doc.body.appendChild(p);

document.replaceChild(doc.documentElement, document.documentElement);
```

上面代码中，第一步生成一个新的 HTML 文档 doc，然后用它的根元素`document.documentElement`替换掉`document.documentElement`。这会使得当前文档的内容全部消失，变成 hello world。

#### 2.3.方法

##### 2.3.1 document.open()，document.close()

`document.open`方法清除当前文档所有内容，使得文档处于可写状态，供`document.write`方法写入内容。

`document.close`方法用来关闭`document.open()`打开的文档。

```javascript
document.open();
document.write("hello world");
document.close();
```

##### 2.3.2 document.write()，document.writeln()

`document.write`方法用于向当前文档写入内容。

在网页的首次渲染阶段，只要页面没有关闭写入（即没有执行`document.close()`），`document.write`写入的内容就会追加在已有内容的后面。

```javascript
// 页面显示“helloworld”
document.open();
document.write("hello");
document.write("world");
document.close();
```

注意，`document.write`会当作 HTML 代码解析，不会转义。

`document.write('<p>hello world</p>');`

上面代码中，`document.write`会将`<p>`当作 HTML 标签解释。

如果页面已经解析完成（`DOMContentLoaded`事件发生之后），再调用`write`方法，它会先调用`open`方法，擦除当前文档所有内容，然后再写入。

```javascript
document.addEventListener("DOMContentLoaded", function(event) {
  document.write("<p>Hello World!</p>");
});

// 等同于
document.addEventListener("DOMContentLoaded", function(event) {
  document.open();
  document.write("<p>Hello World!</p>");
  document.close();
});
```

如果在页面渲染过程中调用`write`方法，并不会自动调用`open`方法。（可以理解成，`open`方法已调用，但`close`方法还未调用。）

```javascript
<html>
  <body>
    hello
    <script type="text/javascript">document.write("world")</script>
  </body>
</html>
```

在浏览器打开上面网页，将会显示 hello world。

`document.write`是 JavaScript 语言标准化之前就存在的方法，现在完全有更符合标准的方法向文档写入内容（比如对`innerHTML`属性赋值）。所以，除了某些特殊情况，应该尽量避免使用`document.write`这个方法。

`document.writeln`方法与`write`方法完全一致，除了会在输出内容的尾部添加换行符。

```javascript
document.write(1);
document.write(2);
// 12

document.writeln(1);
document.writeln(2);
// 1
// 2
//
```

注意，`writeln`方法添加的是 `ASCII` 码的换行符，渲染成 HTML 网页时不起作用，即在网页上显示不出换行。网页上的换行，必须显式写入`<br>`。

##### 2.3.3 document.querySelector()，document.querySelectorAll()

`document.querySelector`方法接受一个 CSS 选择器作为参数，返回匹配该选择器的元素节点。如果有多个节点满足匹配条件，则返回第一个匹配的节点。如果没有发现匹配的节点，则返回`null`。

```javascript
var el1 = document.querySelector(".myclass");
var el2 = document.querySelector("#myParent > [ng-click]");
```

`document.querySelectorAll`方法与`querySelector`用法类似，区别是返回一个`NodeList`对象，包含所有匹配给定选择器的节点。

`elementList = document.querySelectorAll('.myclass');`

这两个方法的参数，可以是逗号分隔的多个 CSS 选择器，返回匹配其中一个选择器的元素节点，这与 CSS 选择器的规则是一致的。

`var matches = document.querySelectorAll('div.note, div.alert');`

这两个方法都支持复杂的 CSS 选择器。

```javascript
// 选中 data-foo-bar 属性等于 someval 的元素
document.querySelectorAll('[data-foo-bar="someval"]');

// 选中 myForm 表单中所有不通过验证的元素
document.querySelectorAll("#myForm :invalid");

// 选中div元素，那些 class 含 ignore 的除外
document.querySelectorAll("DIV:not(.ignore)");

// 同时选中 div，a，script 三类元素
document.querySelectorAll("DIV, A, SCRIPT");
```

但是，它们不支持 CSS 伪元素的选择器（比如`:first-line`和`:first-letter`）和伪类的选择器（比如`:link`和`:visited`），即无法选中伪元素和伪类。

如果`querySelectorAll`方法的参数是字符串\*，则会返回文档中的所有元素节点。另外，`querySelectorAll`的返回结果不是动态集合，不会实时反映元素节点的变化。

最后，这两个方法除了定义在`document`对象上，还定义在元素节点上，即在元素节点上也可以调用。

##### 2.3.4 document.getElementsByTagName()

`document.getElementsByTagName`方法搜索 HTML 标签名，返回符合条件的元素。它的返回值是一个类似数组对象（`HTMLCollection`实例），可以实时反映 HTML 文档的变化。如果没有任何匹配的元素，就返回一个空集。

```javascript
var paras = document.getElementsByTagName("p");
paras instanceof HTMLCollection; // true
```

HTML 标签名是大小写不敏感的，因此`getElementsByTagName`方法也是大小写不敏感的。另外，返回结果中，各个成员的顺序就是它们在文档中出现的顺序。

如果传入`*`，就可以返回文档中所有 HTML 元素。

`var allElements = document.getElementsByTagName('*');`

注意，元素节点本身也定义了`getElementsByTagName`方法，返回该元素的后代元素中符合条件的元素。也就是说，这个方法不仅可以在`document`对象上调用，也可以在任何元素节点上调用。

```javascript
var firstPara = document.getElementsByTagName("p")[0];
var spans = firstPara.getElementsByTagName("span");
```

##### 2.3.5 document.getElementsByClassName()

`document.getElementsByClassName`方法返回一个类似数组的对象（`HTMLCollection`实例），包括了所有`class`名字符合指定条件的元素，元素的变化实时反映在返回结果中。

`var elements = document.getElementsByClassName(names);`

由于`class`是保留字，所以 JavaScript 一律使用`className`表示 CSS 的`class`。

参数可以是多个`class`，它们之间使用空格分隔。

`var elements = document.getElementsByClassName('foo bar');`

上面代码返回同时具有 foo 和 bar 两个`class`的元素，foo 和 bar 的顺序不重要。

注意，正常模式下，CSS 的`class`是大小写敏感的。（`quirks mode`下，大小写不敏感。）

与`getElementsByTagName`方法一样，`getElementsByClassName`方法不仅可以在`document`对象上调用，也可以在任何元素节点上调用。

```javascript
// 非document对象上调用
var elements = rootElement.getElementsByClassName(names);
```

##### 2.3.6 document.getElementsByName()

`document.getElementsByName`方法用于选择拥有`name`属性的 HTML 元素（比如`<form>`、`<radio>`、`<img>`、`<frame>`、`<embed>`和`<object>`等），返回一个类似数组的的对象（`NodeList`实例），因为`name`属性相同的元素可能不止一个。

```javascript
// 表单为 <form name="x"></form>
var forms = document.getElementsByName("x");
forms[0].tagName; // "FORM"
```

##### 2.3.7 document.getElementById()

`document.getElementById`方法返回匹配指定`id`属性的元素节点。如果没有发现匹配的节点，则返回`null`。

`var elem = document.getElementById('para1');`

注意，该方法的参数是大小写敏感的。比如，如果某个节点的`id`属性是 main，那么`document.getElementById('Main')`将返回`null`。

`document.getElementById`方法与`document.querySelector`方法都能获取元素节点，不同之处是`document.querySelector`方法的参数使用 CSS 选择器语法，`document.getElementById`方法的参数是元素的`id`属性。

```javascript
document.getElementById("myElement");
document.querySelector("#myElement");
```

上面代码中，两个方法都能选中`id`为 myElement 的元素，但是`document.getElementById()`比`document.querySelector()`效率高得多。

另外，这个方法只能在`document`对象上使用，不能在其他元素节点上使用。

##### 2.3.8 document.elementFromPoint()，document.elementsFromPoint()

`document.elementFromPoint`方法返回位于页面指定位置最上层的元素节点。

`var element = document.elementFromPoint(50, 50);`

上面代码选中在(50, 50)这个坐标位置的最上层的那个 HTML 元素。

`elementFromPoint`方法的两个参数，依次是相对于当前视口左上角的横坐标和纵坐标，单位是像素。如果位于该位置的 HTML 元素不可返回（比如文本框的滚动条），则返回它的父元素（比如文本框）。如果坐标值无意义（比如负值或超过视口大小），则返回`null`。

`document.elementsFromPoint()`返回一个数组，成员是位于指定坐标（相对于视口）的所有元素。

`var elements = document.elementsFromPoint(x, y);`

##### 2.3.9 document.caretPositionFromPoint()

`document.caretPositionFromPoint()`返回一个 CaretPosition 对象，包含了指定坐标点在节点对象内部的位置信息。CaretPosition 对象就是光标插入点的概念，用于确定光标点在文本对象内部的具体位置。

`var range = document.caretPositionFromPoint(clientX, clientY);`

上面代码中，`range`是指定坐标点的 CaretPosition 对象。该对象有两个属性。

---

- CaretPosition.offsetNode：该位置的节点对象
- CaretPosition.offset：该位置在`offsetNode`对象内部，与起始位置相距的字符数。

---

##### 2.3.10 document.createElement()

`document.createElement`方法用来生成元素节点，并返回该节点。

`var newDiv = document.createElement('div');`

`createElement`方法的参数为元素的标签名，即元素节点的`tagName`属性，对于 HTML 网页大小写不敏感，即参数为 div 或 DIV 返回的是同一种节点。如果参数里面包含尖括号（即`<`和`>`）会报错。

```javascript
document.createElement("<div>");
// DOMException: The tag name provided ('<div>') is not a valid name
```

注意，`document.createElement`的参数可以是自定义的标签名。

##### 2.3.11 document.createTextNode()

`document.createTextNode`方法用来生成文本节点（Text 实例），并返回该节点。它的参数是文本节点的内容。

```javascript
var newDiv = document.createElement("div");
var newContent = document.createTextNode("Hello");
newDiv.appendChild(newContent);
```

上面代码新建一个 div 节点和一个文本节点，然后将文本节点插入 div 节点。

这个方法可以确保返回的节点，被浏览器当作文本渲染，而不是当作 HTML 代码渲染。因此，可以用来展示用户的输入，避免 XSS 攻击。

```javascript
var div = document.createElement("div");
div.appendChild(document.createTextNode("<span>Foo & bar</span>"));
console.log(div.innerHTML);
// &lt;span&gt;Foo &amp; bar&lt;/span&gt;
```

上面代码中，`createTextNode`方法对大于号和小于号进行转义，从而保证即使用户输入的内容包含恶意代码，也能正确显示。

需要注意的是，该方法不对单引号和双引号转义，所以不能用来对 HTML 属性赋值。

```javascript
function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

var userWebsite = '" onmouseover="alert(\'derp\')" "';
var profileLink = '<a href="' + escapeHtml(userWebsite) + '">Bob</a>';
var div = document.getElementById("target");
div.innerHTML = profileLink;
// <a href="" onmouseover="alert('derp')" "">Bob</a>
```

上面代码中，由于`createTextNode`方法不转义双引号，导致`onmouseover`方法被注入了代码。

##### 2.3.12 document.createAttribute()

`document.createAttribute`方法生成一个新的属性节点（Attr 实例），并返回它。

`var attribute = document.createAttribute(name);`

`document.createAttribute`方法的参数`name`，是属性的名称。

```javascript
var node = document.getElementById("div1");

var a = document.createAttribute("my_attrib");
a.value = "newVal";

node.setAttributeNode(a);
// 或者
node.setAttribute("my_attrib", "newVal");
```

##### 2.3.13 document.createComment()

`document.createComment`方法生成一个新的注释节点，并返回该节点。

`var CommentNode = document.createComment(data);`

`document.createComment`方法的参数是一个字符串，会成为注释节点的内容。

##### 2.3.14 document.createDocumentFragment()

`document.createDocumentFragment`方法生成一个空的文档片段对象（`DocumentFragment`实例）。

`var docFragment = document.createDocumentFragment();`

`DocumentFragment`是一个存在于内存的 DOM 片段，不属于当前文档，常常用来生成一段较复杂的 DOM 结构，然后再插入当前文档。这样做的好处在于，因为`DocumentFragment`不属于当前文档，对它的任何改动，都不会引发网页的重新渲染，比直接修改当前文档的 DOM 有更好的性能表现。

```javascript
var docfrag = document.createDocumentFragment();

[1, 2, 3, 4].forEach(function(e) {
  var li = document.createElement("li");
  li.textContent = e;
  docfrag.appendChild(li);
});

var element = document.getElementById("ul");
element.appendChild(docfrag);
```

上面代码中，文档片断 docfrag 包含四个`<li>`节点，这些子节点被一次性插入了当前文档。

##### 2.3.15 document.createEvent()

`document.createEvent`方法生成一个事件对象（`Event`实例），该对象可以被`element.dispatchEvent`方法使用，触发指定事件。

`var event = document.createEvent(type);`

`document.createEvent`方法的参数是事件类型，比如`UIEvents`、`MouseEvents`、`MutationEvents`、`HTMLEvents`。

```javascript
var event = document.createEvent("Event");
event.initEvent("build", true, true);
document.addEventListener(
  "build",
  function(e) {
    console.log(e.type); // "build"
  },
  false
);
document.dispatchEvent(event);
```

##### 2.3.16 document.addEventListener()，document.removeEventListener()，document.dispatchEvent()

这三个方法用于处理`document`节点的事件，它们都继承自`EventTarget`接口。

```javascript
// 添加事件监听函数
document.addEventListener("click", listener, false);

// 移除事件监听函数
document.removeEventListener("click", listener, false);

// 触发事件
var event = new Event("click");
document.dispatchEvent(event);
```

##### 2.3.17 document.hasFocus()

`document.hasFocus`方法返回一个布尔值，表示当前文档之中是否有元素被激活或获得焦点。

`var focused = document.hasFocus();`

注意，有焦点的文档必定被**激活（active）**，反之不成立，激活的文档未必有焦点。比如，用户点击按钮，从当前窗口跳出一个新窗口，该新窗口就是激活的，但是不拥有焦点。

##### 2.3.18 document.adoptNode()，document.importNode()

`document.adoptNode`方法将某个节点及其子节点，从原来所在的文档或`DocumentFragment`里面移除，归属当前`document`对象，返回插入后的新节点。插入的节点对象的`ownerDocument`属性，会变成当前的`document`对象，而`parentNode`属性是`null`。

```javascript
var node = document.adoptNode(externalNode);
document.appendChild(node);
```

注意，`document.adoptNode`方法只是改变了节点的归属，并没有将这个节点插入新的文档树。所有，还要再用`appendChild`方法或`insertBefore`方法，将新节点插入当前文档树。

`document.importNode`方法则是从原来所在的文档或`DocumentFragment`里面，拷贝某个节点及其子节点，让它们归属当前`document`对象。拷贝的节点对象的`ownerDocument`属性，会变成当前的`document`对象，而`parentNode`属性是`null`。

`var node = document.importNode(externalNode, deep);`

`document.adoptNode`方法的第一个参数是外部节点，第二个参数是一个布尔值，表示对外部节点是深拷贝还是浅拷贝，默认是浅拷贝（false）。虽然第二个参数是可选的，但是建议总是保留这个参数，并设为 true。

注意，`document.importNode`方法只是拷贝外部节点，这时该节点的父节点是`null`。下一步还必须将这个节点插入当前文档树。

```javascript
var iframe = document.getElementsByTagName("iframe")[0];
var oldNode = iframe.contentWindow.document.getElementById("myNode");
var newNode = document.importNode(oldNode, true);
document.getElementById("container").appendChild(newNode);
```

##### 2.3.19 document.createNodeIterator()

`document.createNodeIterator`方法返回一个子节点遍历器。

```javascript
var nodeIterator = document.createNodeIterator(
  document.body,
  NodeFilter.SHOW_ELEMENT
);
```

上面代码返回`<body>`元素子节点的遍历器。

`document.createNodeIterator`方法第一个参数为所要遍历的根节点，第二个参数为所要遍历的节点类型，这里指定为元素节点（`NodeFilter.SHOW_ELEMENT`）。几种主要的节点类型写法如下。

---

- 所有节点：NodeFilter.SHOW_ALL
- 元素节点：NodeFilter.SHOW_ELEMENT
- 文本节点：NodeFilter.SHOW_TEXT
- 评论节点：NodeFilter.SHOW_COMMENT

---

`document.createNodeIterator`方法返回一个“遍历器”对象（`NodeFilter`实例）。该实例的`nextNode()`方法和`previousNode()`方法，可以用来遍历所有子节点。

```javascript
var nodeIterator = document.createNodeIterator(document.body);
var pars = [];
var currentNode;

while ((currentNode = nodeIterator.nextNode())) {
  pars.push(currentNode);
}
```

上面代码中，使用遍历器的`nextNode`方法，将根节点的所有子节点，依次读入一个数组。`nextNode`方法先返回遍历器的内部指针所在的节点，然后会将指针移向下一个节点。所有成员遍历完成后，返回`null`。`previousNode`方法则是先将指针移向上一个节点，然后返回该节点。

```javascript
var nodeIterator = document.createNodeIterator(
  document.body,
  NodeFilter.SHOW_ELEMENT
);

var currentNode = nodeIterator.nextNode();
var previousNode = nodeIterator.previousNode();

currentNode === previousNode; // true
```

上面代码中，`currentNode`和`previousNode`都指向同一个的节点。

注意，遍历器返回的第一个节点，总是根节点。

`pars[0] === document.body // true`

##### 2.3.20 document.createTreeWalker()

`document.createTreeWalker`方法返回一个 DOM 的子树遍历器。它与`document.createNodeIterator`方法基本是类似的，区别在于它返回的是`TreeWalker`实例，后者返回的是`NodeIterator`实例。另外，它的第一个节点不是根节点。

`document.createTreeWalker`方法的第一个参数是所要遍历的根节点，第二个参数指定所要遍历的节点类型（与`document.createNodeIterator`方法的第二个参数相同）。

```javascript
var treeWalker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT
);

var nodeList = [];

while (treeWalker.nextNode()) {
  nodeList.push(treeWalker.currentNode);
}
```

上面代码遍历`<body>`节点下属的所有元素节点，将它们插入 nodeList 数组。

##### 2.3.21 document.getSelection()

这个方法指向`window.getSelection()`。

### 3.Element 对象

`Element`对象对应网页的 HTML 元素。每一个 HTML 元素，在 DOM 树上都会转化成一个`Element`节点对象（以下简称元素节点）。

元素节点的`nodeType`属性都是 1。

```javascript
var p = document.querySelector("p");
p.nodeName; // "P"
p.nodeType; // 1
```

`Element`对象继承了`Node`接口，因此`Node`的属性和方法在`Element`对象都存在。此外，不同的 HTML 元素对应的元素节点是不一样的，浏览器使用不同的构造函数，生成不同的元素节点，比如`<a>`元素的节点对象由`HTMLAnchorElement`构造函数生成，`<button>`元素的节点对象由`HTMLButtonElement`构造函数生成。因此，元素节点不是一种对象，而是一组对象，这些对象除了继承`Element`的属性和方法，还有各自构造函数的属性和方法。

#### 3.1.实例属性

##### 3.1.1 元素特性的相关属性

1).Element.id

`Element.id`属性返回指定元素的`id`属性，该属性可读写。

```javascript
// HTML 代码为 <p id="foo">
var p = document.querySelector("p");
p.id; // "foo"
```

注意，`id`属性的值是大小写敏感，即浏览器能正确识别`<p id="foo">`和`<p id="FOO">`这两个元素的`id`属性，但是最好不要这样命名。

2).Element.tagName

`Element.tagName`属性返回指定元素的大写标签名，与`nodeName`属性的值相等。

```javascript
// HTML代码为
// <span id="myspan">Hello</span>
var span = document.getElementById("myspan");
span.id; // "myspan"
span.tagName; // "SPAN"
```

3).Element.dir

`Element.dir`属性用于读写当前元素的文字方向，可能是从左到右（"`ltr`"），也可能是从右到左（"`rtl`"）。

4).Element.accessKey

`Element.accessKey`属性用于读写分配给当前元素的快捷键。

```javascript
// HTML 代码如下
// <button accesskey="h" id="btn">点击</button>
var btn = document.getElementById("btn");
btn.accessKey; // "h"
```

上面代码中，btn 元素的快捷键是 h，按下 Alt + h 就能将焦点转移到它上面。

5).Element.draggable

`Element.draggable`属性返回一个布尔值，表示当前元素是否可拖动。该属性可读写。

6).Element.lang

`Element.lang`属性返回当前元素的语言设置。该属性可读写。

```javascript
// HTML 代码如下
// <html lang="en">
document.documentElement.lang; // "en"
```

7).Element.tabIndex

`Element.tabIndex`属性返回一个整数，表示当前元素在 Tab 键遍历时的顺序。该属性可读写。

`tabIndex`属性值如果是负值（通常是-1），则 Tab 键不会遍历到该元素。如果是正整数，则按照顺序，从小到大遍历。如果两个元素的`tabIndex`属性的正整数值相同，则按照出现的顺序遍历。遍历完所有`tabIndex`为正整数的元素以后，再遍历所有`tabIndex`等于 0、或者属性值是非法值、或者没有`tabIndex`属性的元素，顺序为它们在网页中出现的顺序。

8).Element.title

`Element.title`属性用来读写当前元素的 HTML 属性`title`。该属性通常用来指定，鼠标悬浮时弹出的文字提示框。

##### 3.1.2 元素状态的相关属性

1).Element.hidden

`Element.hidden`属性返回一个布尔值，表示当前元素的`hidden`属性，用来控制当前元素是否可见。该属性可读写。

```javascript
var btn = document.getElementById("btn");
var mydiv = document.getElementById("mydiv");

btn.addEventListener(
  "click",
  function() {
    mydiv.hidden = !mydiv.hidden;
  },
  false
);
```

注意，该属性与 CSS 设置是互相独立的。CSS 对这个元素可见性的设置，`Element.hidden`并不能反映出来。也就是说，这个属性并不难用来判断当前元素的实际可见性。

CSS 的设置高于`Element.hidden`。如果 CSS 指定了该元素不可见（`display: none`）或可见（`display: hidden`），那么`Element.hidden`并不能改变该元素实际的可见性。换言之，这个属性只在 CSS 没有明确设定当前元素的可见性时才有效。

2).Element.contentEditable，Element.isContentEditable

HTML 元素可以设置`contentEditable`属性，使得元素的内容可以编辑。

`<div contenteditable>123</div>`

上面代码中，`<div>`元素有`contenteditable`属性，因此用户可以在网页上编辑这个区块的内容。

`Element.contentEditable`属性返回一个字符串，表示是否设置了`contenteditable`属性，有三种可能的值。该属性可写。

---

- `"true"`：元素内容可编辑
- `"false"`：元素内容不可编辑
- `"inherit"`：元素是否可编辑，继承了父元素的设置

---

`Element.isContentEditable`属性返回一个布尔值，同样表示是否设置了`contenteditable`属性。该属性只读。

##### 3.1.3 Element.attributes

`Element.attributes`属性返回一个类似数组的对象，成员是当前元素节点的所有属性节点。

```javascript
var p = document.querySelector("p");
var attrs = p.attributes;

for (var i = attrs.length - 1; i >= 0; i--) {
  console.log(attrs[i].name + "->" + attrs[i].value);
}
```

##### 3.1.4 Element.className，Element.classList

`className`属性用来读写当前元素节点的`class`属性。它的值是一个字符串，每个`class`之间用空格分割。

`classList`属性返回一个类似数组的对象，当前元素节点的每个`class`就是这个对象的一个成员。

```javascript
// HTML 代码 <div class="one two three" id="myDiv"></div>
var div = document.getElementById("myDiv");

div.className;
// "one two three"

div.classList;
// {
//   0: "one"
//   1: "two"
//   2: "three"
//   length: 3
// }
```

上面代码中，`className`属性返回一个空格分隔的字符串，而`classList`属性指向一个类似数组的对象，该对象的`length`属性（只读）返回当前元素的`class`数量。

`classList`对象有下列方法。

---

- a.`add()`：增加一个 class。
- b.`remove()`：移除一个 class。
- c.`contains()`：检查当前元素是否包含某个 class。
- d.`toggle()`：将某个 class 移入或移出当前元素。
- e.`item()`：返回指定索引位置的 class。
- f.`toString()`：将 class 的列表转为字符串。

---

```javascript
var div = document.getElementById("myDiv");

div.classList.add("myCssClass");
div.classList.add("foo", "bar");
div.classList.remove("myCssClass");
div.classList.toggle("myCssClass"); // 如果 myCssClass 不存在就加入，否则移除
div.classList.contains("myCssClass"); // 返回 true 或者 false
div.classList.item(0); // 返回第一个 Class
div.classList.toString();
```

下面比较一下，`className`和`classList`在添加和删除某个 class 时的写法。

```javascript
var foo = document.getElementById("foo");

// 添加class
foo.className += "bold";
foo.classList.add("bold");

// 删除class
foo.classList.remove("bold");
foo.className = foo.className.replace(/^bold$/, "");
```

`toggle`方法可以接受一个布尔值，作为第二个参数。如果为 true，则添加该属性；如果为 false，则去除该属性。

```javascript
el.classList.toggle("abc", boolValue);

// 等同于
if (boolValue) {
  el.classList.add("abc");
} else {
  el.classList.remove("abc");
}
```

##### 3.1.5 Element.dataset

网页元素可以自定义`data-`属性，用来添加数据。

`<div data-timestamp="1522907809292"></div>`

上面代码中，`<div>`元素有一个自定义的 data-timestamp 属性，用来为该元素添加一个时间戳。

`Element.dataset`属性返回一个对象，可以从这个对象读写`data-`属性。

```javascript
// <article
//   id="foo"
//   data-columns="3"
//   data-index-number="12314"
//   data-parent="cars">
//   ...
// </article>
var article = document.getElementById("foo");
foo.dataset.columns; // "3"
foo.dataset.indexNumber; // "12314"
foo.dataset.parent; // "cars"
```

注意，`dataset`上面的各个属性返回都是字符串。

HTML 代码中，`data-`属性的属性名，只能包含英文字母、数字、连词线（`-`）、点（`.`）、冒号（`:`）和下划线（`_`）。它们转成 JavaScript 对应的`dataset`属性名，规则如下。

---

- 开头的`data-`会省略。
- 如果连词线后面跟了一个英文字母，那么连词线会取消，该字母变成大写。
- 其他字符不变。

---

因此，`data-abc-def`对应`dataset.abcDef`，`data-abc-1`对应`dataset["abc-1"]`。

除了使用`dataset`读写`data-`属性，也可以使用`Element.getAttribute()`和`Element.setAttribute()`，通过完整的属性名读写这些属性。

```javascript
var mydiv = document.getElementById("mydiv");

mydiv.dataset.foo = "bar";
mydiv.getAttribute("data-foo"); // "bar"
```

##### 3.1.6 Element.innerHTML

`Element.innerHTML`属性返回一个字符串，等同于该元素包含的所有 HTML 代码。该属性可读写，常用来设置某个节点的内容。它能改写所有元素节点的内容，包括`<HTML>`和`<body>`元素。

如果将`innerHTML`属性设为空，等于删除所有它包含的所有节点。

`el.innerHTML = '';`

上面代码等于将 el 节点变成了一个空节点，el 原来包含的节点被全部删除。

注意，读取属性值的时候，如果文本节点包含`&`、小于号（`<`）和大于号（`>`），`innerHTML`属性会将它们转为实体形式`&amp;`、`&lt;`、`&gt;`。如果想得到原文，建议使用`element.textContent`属性。

```javascript
// HTML代码如下 <p id="para"> 5 > 3 </p>
document.getElementById("para").innerHTML;
// 5 &gt; 3
```

写入的时候，如果插入的文本包含 HTML 标签，会被解析成为节点对象插入 DOM。注意，如果文本之中含有`<script>`标签，虽然可以生成`script`节点，但是插入的代码不会执行。

```javascript
var name = "<script>alert('haha')</script>";
el.innerHTML = name;
```

上面代码将脚本插入内容，脚本并不会执行。但是，`innerHTML`还是有安全风险的。

```javascript
var name = "<img src=x onerror=alert(1)>";
el.innerHTML = name;
```

上面代码中，`alert`方法是会执行的。因此为了安全考虑，如果插入的是文本，最好用`textContent`属性代替`innerHTML`。

##### 3.1.7 Element.outerHTML

`Element.outerHTML`属性返回一个字符串，表示当前元素节点的所有 HTML 代码，包括该元素本身和所有子元素。

```javascript
// HTML 代码如下
// <div id="d"><p>Hello</p></div>
var d = document.getElementById("d");
d.outerHTML;
// '<div id="d"><p>Hello</p></div>'
```

`outerHTML`属性是可读写的，对它进行赋值，等于替换掉当前元素。

```javascript
// HTML 代码如下
// <div id="container"><div id="d">Hello</div></div>
var container = document.getElementById("container");
var d = document.getElementById("d");
container.firstChild.nodeName; // "DIV"
d.nodeName; // "DIV"

d.outerHTML = "<p>Hello</p>";
container.firstChild.nodeName; // "P"
d.nodeName; // "DIV"
```

上面代码中，变量 d 代表子节点，它的`outerHTML`属性重新赋值以后，内层的 div 元素就不存在了，被 p 元素替换了。但是，变量 d 依然指向原来的 div 元素，这表示被替换的 DIV 元素还存在于内存中。

注意，如果一个节点没有父节点，设置`outerHTML`属性会报错。

```javascript
var div = document.createElement("div");
div.outerHTML = "<p>test</p>";
// DOMException: This element has no parent node.
```

##### 3.1.8 Element.clientHeight，Element.clientWidth

`Element.clientHeight`属性返回一个整数值，表示元素节点的 CSS 高度（单位像素），只对块级元素生效，对于行内元素返回 0。如果块级元素没有设置 CSS 高度，则返回实际高度。

除了元素本身的高度，它还包括`padding`部分，但是不包括`border`、`margin`。如果有水平滚动条，还要减去水平滚动条的高度。注意，这个值始终是整数，如果是小数会被四舍五入。

`Element.clientWidth`属性返回元素节点的 CSS 宽度，同样只对块级元素有效，也是只包括元素本身的宽度和`padding`，如果有垂直滚动条，还要减去垂直滚动条的宽度。

`document.documentElement`的`clientHeight`属性，返回当前视口的高度（即浏览器窗口的高度），等同于`window.innerHeight`属性减去水平滚动条的高度（如果有的话）。`document.body`的高度则是网页的实际高度。一般来说，`document.body.clientHeight`大于`document.documentElement.clientHeight`。

```javascript
// 视口高度
document.documentElement.clientHeight;

// 网页总高度
document.body.clientHeight;
```

##### 3.1.9 Element.clientLeft，Element.clientTop

`Element.clientLeft`属性等于元素节点左边框（left border）的宽度（单位像素），不包括左侧的`padding`和`margin`。如果没有设置左边框，或者是行内元素（`display: inline`），该属性返回 0。该属性总是返回整数值，如果是小数，会四舍五入。

`Element.clientTop`属性等于网页元素顶部边框的宽度（单位像素），其他特点都与`clientTop`相同。

##### 3.1.10 Element.scrollHeight，Element.scrollWidth

`Element.scrollHeight`属性返回一个整数值（小数会四舍五入），表示当前元素的总高度（单位像素），包括溢出容器、当前不可见的部分。它包括`padding`，但是不包括`border`、`margin`以及水平滚动条的高度（如果有水平滚动条的话），还包括伪元素（`::before`或`::after`）的高度。

`Element.scrollWidth`属性表示当前元素的总宽度（单位像素），其他地方都与`scrollHeight`属性类似。这两个属性只读。

整张网页的总高度可以从`document.documentElement`或`document.body`上读取。

```javascript
// 返回网页的总高度
document.documentElement.scrollHeight;
document.body.scrollHeight;
```

注意，如果元素节点的内容出现溢出，即使溢出的内容是隐藏的，`scrollHeight`属性仍然返回元素的总高度。

```javascript
// HTML 代码如下
// <div id="myDiv" style="height: 200px; overflow: hidden;">...<div>
document.getElementById("myDiv").scrollHeight; // 356
```

上面代码中，即使 myDiv 元素的 CSS 高度只有 200 像素，且溢出部分不可见，但是`scrollHeight`仍然会返回该元素的原始高度。

##### 3.1.11 Element.scrollLeft，Element.scrollTop

`Element.scrollLeft`属性表示当前元素的水平滚动条向右侧滚动的像素数量，`Element.scrollTop`属性表示当前元素的垂直滚动条向下滚动的像素数量。对于那些没有滚动条的网页元素，这两个属性总是等于 0。

如果要查看整张网页的水平的和垂直的滚动距离，要从`document.documentElement`元素上读取。

```javascript
document.documentElement.scrollLeft;
document.documentElement.scrollTop;
```

这两个属性都可读写，设置该属性的值，会导致浏览器将当前元素自动滚动到相应的位置。

##### 3.1.12 Element.offsetParent

`Element.offsetParent`属性返回最靠近当前元素的、并且 CSS 的`position`属性不等于`static`的上层元素。

```javascript
<div style="position: absolute;">
  <p>
    <span>Hello</span>
  </p>
</div>
```

上面代码中，span 元素的`offsetParent`属性就是 div 元素。

该属性主要用于确定子元素位置偏移的计算基准，`Element.offsetTop`和`Element.offsetLeft`就是`offsetParent`元素计算的。

如果该元素是不可见的（`display`属性为`none`），或者位置是固定的（`position`属性为`fixed`），则`offsetParent`属性返回`null`。

```javascript
<div style="position: absolute;">
  <p>
    <span style="display: none;">Hello</span>
  </p>
</div>
```

上面代码中，span 元素的`offsetParent`属性是`null`。

如果某个元素的所有上层节点的`position`属性都是`static`，则`Element.offsetParent`属性指向`<body>`元素。

##### 3.1.13 Element.offsetHeight，Element.offsetWidth

`Element.offsetHeight`属性返回一个整数，表示元素的 CSS 垂直高度（单位像素），包括元素本身的高度、`padding` 和 `border`，以及垂直滚动条的高度（如果存在滚动条）。

`Element.offsetWidth`属性表示元素的 CSS 水平宽度（单位像素），其他都与`Element.offsetHeight`一致。

这两个属性都是只读属性，只比`Element.clientHeight`和`Element.clientWidth`多了边框的高度或宽度。如果元素的 CSS 设为不可见（比如`display: none;`），则返回 0。

##### 3.1.14 Element.offsetLeft，Element.offsetTop

`Element.offsetLeft`返回当前元素左上角相对于`Element.offsetParent`节点的水平位移，`Element.offsetTop`返回垂直位移，单位为像素。通常，这两个值是指相对于父节点的位移。

下面的代码可以算出元素左上角相对于整张网页的坐标。

```javascript
function getElementPosition(e) {
  var x = 0;
  var y = 0;
  while (e !== null) {
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent;
  }
  return { x: x, y: y };
}
```

##### 3.1.15 Element.style

每个元素节点都有`style`用来读写该元素的行内样式信息。

##### 3.1.16 Element.children，Element.childElementCount

`Element.children`属性返回一个类似数组的对象（`HTMLCollection`实例），包括当前元素节点的所有子元素。如果当前元素没有子元素，则返回的对象包含零个成员。

```javascript
if (para.children.length) {
  var children = para.children;
  for (var i = 0; i < children.length; i++) {
    // ...
  }
}
```

这个属性与`Node.childNodes`属性的区别是，它只包括元素类型的子节点，不包括其他类型的子节点。

`Element.childElementCount`属性返回当前元素节点包含的子元素节点的个数，与`Element.children.length`的值相同。

##### 3.1.17 Element.firstElementChild，Element.lastElementChild

`Element.firstElementChild`属性返回当前元素的第一个元素子节点，`Element.lastElementChild`返回最后一个元素子节点。

如果没有元素子节点，这两个属性返回`null`。

##### 3.1.18 Element.nextElementSibling，Element.previousElementSibling

`Element.nextElementSibling`属性返回当前元素节点的后一个同级元素节点，如果没有则返回`null`。

```javascript
// HTML 代码如下
// <div id="div-01">Here is div-01</div>
// <div id="div-02">Here is div-02</div>
var el = document.getElementById("div-01");
el.nextElementSibling;
// <div id="div-02">Here is div-02</div>
```

`Element.previousElementSibling`属性返回当前元素节点的前一个同级元素节点，如果没有则返回`null`。

#### 3.2.实例方法

##### 3.2.1 属性相关方法

以下方法用来操作当前节点的属性。

1).Element.getAttribute()

`Element.getAttribute`方法接受一个字符串作为参数，返回同名属性的值。如果没有该属性，则返回`null`。

```javascript
var mydiv = document.getElementById("mydiv");
var id = mydiv.getAttribute("id");
```

2).Element.getAttributeNames()

`Element.getAttributeNames()`返回一个数组，成员是当前元素的所有属性的名字。如果当前元素没有任何属性，则返回一个空数组。使用`Element.attributes`属性，也可以拿到同样的结果，唯一的区别是它返回的是类似数组的对象。

```javascript
var mydiv = document.getElementById("mydiv");

mydiv.getAttributeNames().forEach(function(key) {
  var value = mydiv.getAttribute(key);
  console.log(key, value);
});
```

3).Element.setAttribute()

`Element.setAttribute`方法用于为当前节点设置属性。如果属性已经存在，将更新属性值，否则将添加该属性。该方法没有返回值。

```javascript
// HTML 代码为
// <button>Hello World</button>
var b = document.querySelector("button");
b.setAttribute("name", "myButton");
b.setAttribute("disabled", true);
```

上面代码中，button 元素的 name 属性被设成 myButton，`disabled`属性被设成 true。

这里有两个地方需要注意，首先，属性值总是字符串，其他类型的值会自动转成字符串，比如布尔值 true 就会变成字符串 true；其次，上例的`disable`属性是一个布尔属性，对于`<button>`元素来说，这个属性不需要属性值，只要设置了就总是会生效，因此`setAttribute`方法里面可以将`disabled`属性设成任意值。

4).Element.hasAttribute()

`Element.hasAttribute`方法返回一个布尔值，表示当前元素节点是否有指定的属性。

```javascript
var foo = document.getElementById("foo");
foo.hasAttribute("bar"); // false
```

5).Element.hasAttributes()

`Element.hasAttributes`方法返回一个布尔值，表示当前元素是否有属性，如果没有任何属性，就返回 false，否则返回 true。

```javascript
var foo = document.getElementById("foo");
foo.hasAttributes(); // true
```

6).Element.removeAttribute()

`Element.removeAttribute`方法移除指定属性。该方法没有返回值。

`document.getElementById('div1').removeAttribute('id')`

##### 3.2.2 Element.querySelector()

`Element.querySelector`方法接受 CSS 选择器作为参数，返回父元素的第一个匹配的子元素。如果没有找到匹配的子元素，就返回`null`。

```javascript
var content = document.getElementById("content");
var el = content.querySelector("p");
```

`Element.querySelector`方法可以接受任何复杂的 CSS 选择器。

`document.body.querySelector("style[type='text/css'], style:not([type])");`

注意，这个方法无法选中伪元素。

它可以接受多个选择器，它们之间使用逗号分隔。

`element.querySelector('div, p')`

上面代码返回 element 的第一个 div 或 p 子元素。

需要注意的是，浏览器执行`querySelector`方法时，是先在全局范围内搜索给定的 CSS 选择器，然后过滤出哪些属于当前元素的子元素。因此，会有一些违反直觉的结果，下面是一段 HTML 代码。

```javascript
<div>
  <blockquote id="outer">
    <p>Hello</p>
    <div id="inner">
      <p>World</p>
    </div>
  </blockquote>
</div>
```

那么，像下面这样查询的话，实际上返回的是第一个 p 元素，而不是第二个。

```javascript
var outer = document.getElementById("outer");
outer.querySelector("div p");
// <p>Hello</p>
```

##### 3.2.3 Element.querySelectorAll()

`Element.querySelectorAll`方法接受 CSS 选择器作为参数，返回一个`NodeList`实例，包含所有匹配的子元素。

```javascript
var el = document.querySelector("#test");
var matches = el.querySelectorAll("div.highlighted > p");
```

该方法的执行机制与`querySelector`方法相同，也是先在全局范围内查找，再过滤出当前元素的子元素。因此，选择器实际上针对整个文档的。

它也可以接受多个 CSS 选择器，它们之间使用逗号分隔。如果选择器里面有伪元素的选择器，则总是返回一个空的`NodeList`实例。

##### 3.2.4 Element.getElementsByClassName()

`Element.getElementsByClassName`方法返回一个`HTMLCollection`实例，成员是当前元素节点的所有具有指定 class 的子元素节点。该方法与`document.getElementsByClassName`方法的用法类似，只是搜索范围不是整个文档，而是当前元素节点。

`element.getElementsByClassName('red test');`

注意，该方法的参数大小写敏感。

由于`HTMLCollection`实例是一个活的集合，`document`对象的任何变化会立刻反应到实例，下面的代码不会生效。

```javascript
// HTML 代码如下
// <div id="example">
//   <p class="foo"></p>
//   <p class="foo"></p>
// </div>
var element = document.getElementById("example");
var matches = element.getElementsByClassName("foo");

for (var i = 0; i < matches.length; i++) {
  matches[i].classList.remove("foo");
  matches.item(i).classList.add("bar");
}
// 执行后，HTML 代码如下
// <div id="example">
//   <p></p>
//   <p class="foo bar"></p>
// </div>
```

上面代码中，matches 集合的第一个成员，一旦被拿掉 class 里面的 foo，就会立刻从 matches 里面消失，导致出现上面的结果。

##### 3.2.5 Element.getElementsByTagName()

`Element.getElementsByTagName`方法返回一个`HTMLCollection`实例，成员是当前节点的所有匹配指定标签名的子元素节点。该方法与`document.getElementsByClassName`方法的用法类似，只是搜索范围不是整个文档，而是当前元素节点。

```javascript
var table = document.getElementById("forecast-table");
var cells = table.getElementsByTagName("td");
```

注意，该方法的参数是大小写不敏感的。

##### 3.2.6 Element.closest()

`Element.closest`方法接受一个 CSS 选择器作为参数，返回匹配该选择器的、最接近当前节点的一个祖先节点（包括当前节点本身）。如果没有任何节点匹配 CSS 选择器，则返回`null`。

```javascript
// HTML 代码如下
// <article>
//   <div id="div-01">Here is div-01
//     <div id="div-02">Here is div-02
//       <div id="div-03">Here is div-03</div>
//     </div>
//   </div>
// </article>

var div03 = document.getElementById("div-03");

// div-03 最近的祖先节点
div03.closest("#div-02"); // div-02
div03.closest("div div"); // div-03
div03.closest("article > div"); //div-01
div03.closest(":not(div)"); // article
```

上面代码中，由于`closest`方法将当前节点也考虑在内，所以第二个`closest`方法返回 div-03。

##### 3.2.7 Element.matches()

`Element.matches`方法返回一个布尔值，表示当前元素是否匹配给定的 CSS 选择器。

```javascript
if (el.matches(".someClass")) {
  console.log("Match!");
}
```

##### 3.2.8 事件相关方法

以下三个方法与`Element`节点的事件相关。这些方法都继承自`EventTarget`接口，详见相关章节。

---

- `Element.addEventListener()`：添加事件的回调函数
- `Element.removeEventListener()`：移除事件监听函数
- `Element.dispatchEvent()`：触发事件

---

```javascript
element.addEventListener("click", listener, false);
element.removeEventListener("click", listener, false);

var event = new Event("click");
element.dispatchEvent(event);
```

##### 3.2.9 Element.scrollIntoView()

`Element.scrollIntoView`方法滚动当前元素，进入浏览器的可见区域，类似于设置`window.location.hash`的效果。

```javascript
el.scrollIntoView(); // 等同于el.scrollIntoView(true)
el.scrollIntoView(false);
```

该方法可以接受一个布尔值作为参数。如果为 true，表示元素的顶部与当前区域的可见部分的顶部对齐（前提是当前区域可滚动）；如果为 false，表示元素的底部与当前区域的可见部分的尾部对齐（前提是当前区域可滚动）。如果没有提供该参数，默认为 true。

##### 3.2.10 Element.getBoundingClientRect()

`Element.getBoundingClientRect`方法返回一个对象，提供当前元素节点的大小、位置等信息，基本上就是 CSS 盒状模型的所有信息。

`var rect = obj.getBoundingClientRect();`

上面代码中，`getBoundingClientRect`方法返回的 rect 对象，具有以下属性（全部为只读）。

---

- `x`：元素左上角相对于视口的横坐标
- `y`：元素左上角相对于视口的纵坐标
- `height`：元素高度
- `width`：元素宽度
- `left`：元素左上角相对于视口的横坐标，与 x 属性相等
- `right`：元素右边界相对于视口的横坐标（等于`x + width`）
- `top`：元素顶部相对于视口的纵坐标，与 y 属性相等
- `bottom`：元素底部相对于视口的纵坐标（等于`y + height`）

---

由于元素相对于**视口（viewport）**的位置，会随着页面滚动变化，因此表示位置的四个属性值，都不是固定不变的。如果想得到绝对位置，可以将`left`属性加上`window.scrollX`，`top`属性加上`window.scrollY`。

注意，`getBoundingClientRect`方法的所有属性，都把边框（`border`属性）算作元素的一部分。也就是说，都是从边框外缘的各个点来计算。因此，`width`和`height`包括了元素本身 + `padding` + `border`。

另外，上面的这些属性，都是继承自原型的属性，`Object.keys`会返回一个空数组，这一点也需要注意。

```javascript
var rect = document.body.getBoundingClientRect();
Object.keys(rect); // []
```

上面代码中，rect 对象没有自身属性，而`Object.keys`方法只返回对象自身的属性，所以返回了一个空数组。

##### 3.2.11 Element.getClientRects()

`Element.getClientRects`方法返回一个类似数组的对象，里面是当前元素在页面上形成的所有矩形（所以方法名中的 Rect 用的是复数）。每个矩形都有`bottom`、`height`、`left`、`right`、`top`和`width`六个属性，表示它们相对于视口的四个坐标，以及本身的高度和宽度。

对于盒状元素（比如`<div>`和`<p>`），该方法返回的对象中只有该元素一个成员。对于行内元素（比如`<span>`、`<a>`、`<em>`），该方法返回的对象有多少个成员，取决于该元素在页面上占据多少行。这是它和`Element.getBoundingClientRect()`方法的主要区别，后者对于行内元素总是返回一个矩形。

```javascript
<span id="inline">Hello World Hello World Hello World</span>
```

上面代码是一个行内元素`<span>`，如果它在页面上占据三行，`getClientRects`方法返回的对象就有三个成员，如果它在页面上占据一行，`getClientRects`方法返回的对象就只有一个成员。

```javascript
var el = document.getElementById("inline");
el.getClientRects().length; // 3
el.getClientRects()[0].left; // 8
el.getClientRects()[0].right; // 113.908203125
el.getClientRects()[0].bottom; // 31.200000762939453
el.getClientRects()[0].height; // 23.200000762939453
el.getClientRects()[0].width; // 105.908203125
```

这个方法主要用于判断行内元素是否换行，以及行内元素的每一行的位置偏移。

##### 3.2.12 Element.insertAdjacentElement()

`Element.insertAdjacentElement`方法在相对于当前元素的指定位置，插入一个新的节点。该方法返回被插入的节点，如果插入失败，返回`null`。

`element.insertAdjacentElement(position, element);`

`Element.insertAdjacentElement`方法一共可以接受两个参数，第一个参数是一个字符串，表示插入的位置，第二个参数是将要插入的节点。第一个参数只可以取如下的值。

---

- `beforebegin`：当前元素之前
- `afterbegin`：当前元素内部的第一个子节点前面
- `beforeend`：当前元素内部的最后一个子节点后面
- `afterend`：当前元素之后

---

注意，`beforebegin`和`afterend`这两个值，只在当前节点有父节点时才会生效。如果当前节点是由脚本创建的，没有父节点，那么插入会失败。

```javascript
var p1 = document.createElement("p");
var p2 = document.createElement("p");
p1.insertAdjacentElement("afterend", p2); // null
```

如果插入的节点是一个文档里现有的节点，它会从原有位置删除，放置到新的位置。

##### 3.2.13 Element.insertAdjacentHTML()，Element.insertAdjacentText()

`Element.insertAdjacentHTML`方法用于将一个 HTML 字符串，解析生成 DOM 结构，插入相对于当前节点的指定位置。

`element.insertAdjacentHTML(position, text);`

该方法接受两个参数，第一个是一个表示指定位置的字符串，第二个是待解析的 HTML 字符串。第一个参数只能设置下面四个值之一。

---

- beforebegin：当前元素之前
- afterbegin：当前元素内部的第一个子节点前面
- beforeend：当前元素内部的最后一个子节点后面
- afterend：当前元素之后

---

```javascript
// HTML 代码：<div id="one">one</div>
var d1 = document.getElementById("one");
d1.insertAdjacentHTML("afterend", '<div id="two">two</div>');
// 执行后的 HTML 代码：
// <div id="one">one</div><div id="two">two</div>
```

该方法只是在现有的 DOM 结构里面插入节点，这使得它的执行速度比`innerHTML`方法快得多。

注意，该方法不会转义 HTML 字符串，这导致它不能用来插入用户输入的内容，否则会有安全风险。

`Element.insertAdjacentText`方法在相对于当前节点的指定位置，插入一个文本节点，用法与`Element.insertAdjacentHTML`方法完全一致。

```javascript
// HTML 代码：<div id="one">one</div>
var d1 = document.getElementById("one");
d1.insertAdjacentText("afterend", "two");
// 执行后的 HTML 代码：
// <div id="one">one</div>two
```

##### 3.2.14 Element.remove()

`Element.remove`方法继承自 `ChildNode` 接口，用于将当前元素节点从它的父节点移除。

```javascript
var el = document.getElementById("mydiv");
el.remove();
```

##### 3.2.15 Element.focus()，Element.blur()

`Element.focus`方法用于将当前页面的焦点，转移到指定元素上。

`document.getElementById('my-span').focus();`

该方法可以接受一个对象作为参数。参数对象的`preventScroll`属性是一个布尔值，指定是否将当前元素停留在原始位置，而不是滚动到可见区域。

```javascript
function getFocus() {
  document.getElementById("btn").focus({ preventScroll: false });
}
```

上面代码会让 btn 元素获得焦点，并滚动到可见区域。

最后，从`document.activeElement`属性可以得到当前获得焦点的元素。

`Element.blur`方法用于将焦点从当前元素移除。

##### 3.2.16 Element.click()

`Element.clic`k 方法用于在当前元素上模拟一次鼠标点击，相当于触发了`click`事件。

### 4.属性的操作

HTML 元素包括标签名和若干个键值对，这个键值对就称为**属性（attribute）**。

```javascript
<a id="test" href="http://www.example.com">
  链接
</a>
```

上面代码中，a 元素包括两个属性：`id`属性和`href`属性。

属性本身是一个对象（`Attr`对象），但是实际上，这个对象极少使用。一般都是通过元素节点对象（`HTMlElement`对象）来操作属性。本章介绍如何操作这些属性。

#### 4.1.Element.attributes 属性

元素对象有一个`attributes`属性，返回一个类似数组的动态对象，成员是该元素标签的所有属性节点对象，属性的实时变化都会反映在这个节点对象上。其他类型的节点对象，虽然也有`attributes`属性，但返回的都是`null`，因此可以把这个属性视为元素对象独有的。

单个属性可以通过序号引用，也可以通过属性名引用。

```javascript
// HTML 代码如下
// <body bgcolor="yellow" onload="">
document.body.attributes[0];
document.body.attributes.bgcolor;
document.body.attributes["ONLOAD"];
```

注意，上面代码的三种方法，返回的都是属性节点对象，而不是属性值。

属性节点对象有`name`和`value`属性，对应该属性的属性名和属性值，等同于`nodeName`属性和`nodeValue`属性。

```javascript
// HTML代码为
// <div id="mydiv">
var n = document.getElementById("mydiv");

n.attributes[0].name; // "id"
n.attributes[0].nodeName; // "id"

n.attributes[0].value; // "mydiv"
n.attributes[0].nodeValue; // "mydiv"
```

下面代码可以遍历一个元素节点的所有属性。

```javascript
var para = document.getElementsByTagName("p")[0];
var result = document.getElementById("result");

if (para.hasAttributes()) {
  var attrs = para.attributes;
  var output = "";
  for (var i = attrs.length - 1; i >= 0; i--) {
    output += attrs[i].name + "->" + attrs[i].value;
  }
  result.textContent = output;
} else {
  result.textContent = "No attributes to show";
}
```

#### 4.2.元素的标准属性

HTML 元素的标准属性（即在标准中定义的属性），会自动成为元素节点对象的属性。

```javascript
var a = document.getElementById("test");
a.id; // "test"
a.href; // "http://www.example.com/"
```

上面代码中，a 元素标签的属性`id`和`href`，自动成为节点对象的属性。

这些属性都是可写的。

```javascript
var img = document.getElementById("myImage");
img.src = "http://www.example.com/image.jpg";
```

上面的写法，会立刻替换掉`img`对象的`src`属性，即会显示另外一张图片。

这种修改属性的方法，常常用于添加表单的属性。

```javascript
var f = document.forms[0];
f.action = "submit.php";
f.method = "POST";
```

上面代码为表单添加提交网址和提交方法。

注意，这种用法虽然可以读写属性，但是无法删除属性，`delete`运算符在这里不会生效。

HTML 元素的属性名是大小写不敏感的，但是 JavaScript 对象的属性名是大小写敏感的。转换规则是，转为 JavaScript 属性名时，一律采用小写。如果属性名包括多个单词，则采用骆驼拼写法，即从第二个单词开始，每个单词的首字母采用大写，比如`onClick`。

有些 HTML 属性名是 JavaScript 的保留字，转为 JavaScript 属性时，必须改名。主要是以下两个。

---

- `for`属性改为`htmlFor`
- `class`属性改为`className`

---

另外，HTML 属性值一般都是字符串，但是 JavaScript 属性会自动转换类型。比如，将字符串 true 转为布尔值，将`onClick`的值转为一个函数，将 style 属性的值转为一个`CSSStyleDeclaration`对象。因此，可以对这些属性赋予各种类型的值。

#### 4.3.属性操作的标准方法

##### 4.3.1 概述

元素节点提供四个方法，用来操作属性。

---

- `getAttribute()`
- `setAttribute()`
- `hasAttribute()`
- `removeAttribute()`

---

这有几点注意。

1).适用性

这四个方法对所有属性（包括用户自定义的属性）都适用。

2).返回值

`getAttribute()`只返回字符串，不会返回其他类型的值。

3).属性名

这些方法只接受属性的标准名称，不用改写保留字，比如`for`和`class`都可以直接使用。另外，这些方法对于属性名是大小写不敏感的。

```javascript
var image = document.images[0];
image.setAttribute("class", "myImage");
```

上面代码中，`setAttribute`方法直接使用 class 作为属性名，不用写成`className`。

##### 4.3.2 Element.getAttribute()

`Element.getAttribute`方法返回当前元素节点的指定属性。如果指定属性不存在，则返回`null`。

```javascript
// HTML代码为
// <div id="div1" align="left">
var div = document.getElementById("div1");
div.getAttribute("align"); // "left"
```

##### 4.3.3 Element.setAttribute()

`Element.setAttribute`方法用于为当前元素节点新增属性。如果同名属性已存在，则相当于编辑已存在的属性。

```javascript
var d = document.getElementById("d1");
d.setAttribute("align", "center");
```

下面是对 img 元素的 src 属性赋值的例子。

```javascript
var myImage = document.querySelector("img");
myImage.setAttribute("src", "path/to/example.png");
```

##### 4.3.4 Element.hasAttribute()

`Element.hasAttribute`方法返回一个布尔值，表示当前元素节点是否包含指定属性。

```javascript
var d = document.getElementById("div1");

if (d.hasAttribute("align")) {
  d.setAttribute("align", "center");
}
```

上面代码检查 div 节点是否含有`align`属性。如果有，则设置为居中对齐。

##### 4.3.5 Element.removeAttribute()

`Element.removeAttribute`方法用于从当前元素节点移除属性。

```javascript
// HTML 代码为
// <div id="div1" align="left" width="200px">
document.getElementById("div1").removeAttribute("align");
// 现在的HTML代码为
// <div id="div1" width="200px">
```

#### 4.4.dataset 属性

有时，需要在 HTML 元素上附加数据，供 JavaScript 脚本使用。一种解决方法是自定义属性。

`<div id="mydiv" foo="bar">`

上面代码为 div 元素自定义了 foo 属性，然后可以用`getAttribute()`和`setAttribute()`读写这个属性。

```javascript
var n = document.getElementById("mydiv");
n.getAttribute("foo"); // bar
n.setAttribute("foo", "baz");
```

这种方法虽然可以达到目的，但是会使得 HTML 元素的属性不符合标准，导致网页代码通不过校验。

更好的解决方法是，使用标准提供的`data-*`属性。

`<div id="mydiv" data-foo="bar">`

然后，使用元素节点对象的`dataset`属性，它指向一个对象，可以用来操作 HTML 元素标签的`data-*`属性。

```javascript
var n = document.getElementById("mydiv");
n.dataset.foo; // bar
n.dataset.foo = "baz";
```

上面代码中，通过 dataset.foo 读写`data-foo`属性。

删除一个`data-*`属性，可以直接使用`delete`命令。

`delete document.getElementById('myDiv').dataset.foo;`

除了`dataset`属性，也可以用`getAttribute('data-foo')`、`removeAttribute('data-foo')`、`setAttribute('data-foo')`、`hasAttribute('data-foo')`等方法操作`data-*`属性。

注意，`data-`后面的属性名有限制，只能包含字母、数字、连词线（`-`）、点（`.`）、冒号（`:`）和下划线（`_`)。而且，属性名不应该使用 A 到 Z 的大写字母，比如不能有`data-helloWorld`这样的属性名，而要写成`data-hello-world`。

转成`dataset`的键名时，连词线后面如果跟着一个小写字母，那么连词线会被移除，该小写字母转为大写字母，其他字符不变。反过来，`dataset`的键名转成属性名时，所有大写字母都会被转成连词线+该字母的小写形式，其他字符不变。比如，`dataset.helloWorld`会转成`data-hello-world`。

### 5.Text 节点和 DocumentFragment 节点

#### 5.1.Text 节点的概念

文本节点（Text）代表元素节点（Element）和属性节点（Attribute）的文本内容。如果一个节点只包含一段文本，那么它就有一个文本子节点，代表该节点的文本内容。

通常我们使用父节点的`firstChild`、`nextSibling`等属性获取文本节点，或者使用`Document`节点的`createTextNode`方法创造一个文本节点。

```javascript
// 获取文本节点
var textNode = document.querySelector("p").firstChild;

// 创造文本节点
var textNode = document.createTextNode("Hi");
document.querySelector("div").appendChild(textNode);
```

浏览器原生提供一个`Text`构造函数。它返回一个文本节点实例。它的参数就是该文本节点的文本内容。

```javascript
// 空字符串
var text1 = new Text();

// 非空字符串
var text2 = new Text("This is a text node");
```

注意，由于空格也是一个字符，所以哪怕只有一个空格，也会形成文本节点。比如，`<p> </p>`包含一个空格，它的子节点就是一个文本节点。

> 文本节点除了继承`Node`接口，还继承了`CharacterData`接口。

#### 5.2.Text 节点的属性

##### 5.2.1 data

`data`属性等同于`nodeValue`属性，用来设置或读取文本节点的内容。

```javascript
// 读取文本内容
document.querySelector("p").firstChild.data;
// 等同于
document.querySelector("p").firstChild.nodeValue;

// 设置文本内容
document.querySelector("p").firstChild.data = "Hello World";
```

##### 5.2.2 wholeText

`wholeText`属性将当前文本节点与毗邻的文本节点，作为一个整体返回。大多数情况下，`wholeText`属性的返回值，与`data`属性和`textContent`属性相同。但是，某些特殊情况会有差异。

举例来说，HTML 代码如下。

`<p id="para">A <em>B</em> C</p>`

这时，文本节点的`wholeText`属性和`data`属性，返回值相同。

```javascript
var el = document.getElementById("para");
el.firstChild.wholeText; // "A "
el.firstChild.data; // "A "
```

但是，一旦移除`<em>`节点，`wholeText`属性与`data`属性就会有差异，因为这时其实`<p>`节点下面包含了两个毗邻的文本节点。

```javascript
el.removeChild(para.childNodes[1]);
el.firstChild.wholeText; // "A C"
el.firstChild.data; // "A "
```

##### 5.2.3 length

`length`属性返回当前文本节点的文本长度。

`(new Text('Hello')).length // 5`

##### 5.2.4 nextElementSibling，previousElementSibling

`nextElementSibling`属性返回紧跟在当前文本节点后面的那个同级元素节点。如果取不到元素节点，则返回`null`。

```javascript
// HTML 为
// <div>Hello <em>World</em></div>
var tn = document.querySelector("div").firstChild;
tn.nextElementSibling;
// <em>World</em>
```

`previousElementSibling`属性返回当前文本节点前面最近的同级元素节点。如果取不到元素节点，则返回`null：`。

#### 5.3.Text 节点的方法

##### 5.3.1 appendData()，deleteData()，insertData()，replaceData()，subStringData()

以下 5 个方法都是编辑`Text`节点文本内容的方法。

---

- `appendData()`：在 Text 节点尾部追加字符串。
- `deleteData()`：删除 Text 节点内部的子字符串，第一个参数为子字符串开始位置，第二个参数为子字符串长度。
- `insertData()`：在 Text 节点插入字符串，第一个参数为插入位置，第二个参数为插入的子字符串。
- `replaceData()`：用于替换文本，第一个参数为替换开始位置，第二个参数为需要被替换掉的长度，第三个参数为新加入的字符串。
- `subStringData()`：用于获取子字符串，第一个参数为子字符串在 Text 节点中的开始位置，第二个参数为子字符串长度。

---

```javascript
// HTML 代码为
// <p>Hello World</p>
var pElementText = document.querySelector("p").firstChild;

pElementText.appendData("!");
// 页面显示 Hello World!
pElementText.deleteData(7, 5);
// 页面显示 Hello W
pElementText.insertData(7, "Hello ");
// 页面显示 Hello WHello
pElementText.replaceData(7, 5, "World");
// 页面显示 Hello WWorld
pElementText.substringData(7, 10);
// 页面显示不变，返回"World "
```

##### 5.3.2 remove()

`remove`方法用于移除当前 Text 节点。

```javascript
// HTML 代码为
// <p>Hello World</p>
document.querySelector("p").firstChild.remove();
// 现在 HTML 代码为
// <p></p>
```

##### 5.3.3 splitText()

`splitText`方法将 Text 节点一分为二，变成两个毗邻的 Text 节点。它的参数就是分割位置（从零开始），分割到该位置的字符前结束。如果分割位置不存在，将报错。

分割后，该方法返回分割位置后方的字符串，而原 Text 节点变成只包含分割位置前方的字符串。

```javascript
// html 代码为 <p id="p">foobar</p>
var p = document.getElementById("p");
var textnode = p.firstChild;

var newText = textnode.splitText(3);
newText; // "bar"
textnode; // "foo"
```

父节点的`normalize`方法可以将毗邻的两个 Text 节点合并。

接上面的例子，文本节点的`splitText`方法将一个 Text 节点分割成两个，父元素的`normalize`方法可以实现逆操作，将它们合并。

```javascript
p.childNodes.length; // 2

// 将毗邻的两个 Text 节点合并
p.normalize();
p.childNodes.length; // 1
```

#### 5.4.DocumentFragment 节点

`DocumentFragment`节点代表一个文档的片段，本身就是一个完整的 DOM 树形结构。它没有父节点，`parentNode`返回`null`，但是可以插入任意数量的子节点。它不属于当前文档，操作`DocumentFragment`节点，要比直接操作 DOM 树快得多。

它一般用于构建一个 DOM 结构，然后插入当前文档。`document.createDocumentFragment`方法，以及浏览器原生的`DocumentFragment`构造函数，可以创建一个空的`DocumentFragment`节点。然后再使用其他 DOM 方法，向其添加子节点。

```javascript
var docFrag = document.createDocumentFragment();
// 等同于
var docFrag = new DocumentFragment();

var li = document.createElement("li");
li.textContent = "Hello World";
docFrag.appendChild(li);

document.querySelector("ul").appendChild(docFrag);
```

上面代码创建了一个`DocumentFragment`节点，然后将一个`li`节点添加在它里面，最后将`DocumentFragment`节点移动到原文档。

注意，`DocumentFragment`节点本身不能被插入当前文档。当它作为`appendChild()`、`insertBefore()`、`replaceChild()`等方法的参数时，是它的所有子节点插入当前文档，而不是它自身。一旦`DocumentFragment`节点被添加进当前文档，它自身就变成了空节点（`textContent`属性为空字符串），可以被再次使用。如果想要保存`DocumentFragment`节点的内容，可以使用`cloneNode`方法。

```javascript
document.queryselector("ul").appendChild(docFrag.cloneNode(true));
```

上面这样添加`DocumentFragment`节点进入当前文档，不会清空`DocumentFragment`节点。

下面是一个例子，使用`DocumentFragment`反转一个指定节点的所有子节点的顺序。

```javascript
function reverse(n) {
  var f = document.createDocumentFragment();
  while (n.lastChild) f.appendChild(n.lastChild);
  n.appendChild(f);
}
```

`DocumentFragment`节点对象没有自己的属性和方法，全部继承自`Node`节点和`ParentNode`接口。也就是说，`DocumentFragment`节点比`Node`节点多出以下四个属性。

---

- a.`children`：返回一个动态的`HTMLCollection`集合对象，包括当前 `DocumentFragment`对象的所有子元素节点。
- b.`firstElementChild`：返回当前`DocumentFragment`对象的第一个子元素节点，如果没有则返回`null`。
- c.`lastElementChild`：返回当前`DocumentFragment`对象的最后一个子元素节点，如果没有则返回`null`。
- d.`childElementCount`：返回当前`DocumentFragment`对象的所有子元素数量。

---

### 6.事件模型

事件的本质是程序各个组成部分之间的一种通信方式，也是异步编程的一种实现。

#### 6.1.EventTarget 接口

DOM 的事件操作（监听和触发），都定义在`EventTarget`接口。所有节点对象都部署了这个接口，其他一些需要事件通信的浏览器内置对象（比如，`XMLHttpRequest`、`AudioNode`、`AudioContext`）也部署了这个接口。

该接口主要提供三个实例方法。

---

- `addEventListener`：绑定事件的监听函数
- `removeEventListener`：移除事件的监听函数
- `dispatchEvent`：触发事件

---

##### 6.1.1 EventTarget.addEventListener()

`EventTarget.addEventListener()`用于在当前节点或对象上，定义一个特定事件的监听函数。一旦这个事件发生，就会执行监听函数。该方法没有返回值。

`target.addEventListener(type, listener[, useCapture]);`

该方法接受三个参数。

---

- `type`：事件名称，大小写敏感。
- `listener`：监听函数。事件发生时，会调用该监听函数。
- `useCapture`：布尔值，表示监听函数是否在捕获阶段（capture）触发，默认为 false（监听函数只在冒泡阶段被触发）。该参数可选。

---

下面是一个例子。

```javascript
function hello() {
  console.log("Hello world");
}

var button = document.getElementById("btn");
button.addEventListener("click", hello, false);
```

上面代码中，button 节点的`addEventListener`方法绑定`click`事件的监听函数 hello，该函数只在冒泡阶段触发。

关于参数，有两个地方需要注意。

首先，第二个参数除了监听函数，还可以是一个具有`handleEvent`方法的对象。

```javascript
buttonElement.addEventListener("click", {
  handleEvent: function(event) {
    console.log("click");
  }
});
```

上面代码中，`addEventListener`方法的第二个参数，就是一个具有`handleEvent`方法的对象。

其次，第三个参数除了布尔值`useCapture`，还可以是一个属性配置对象。该对象有以下属性。

---

- `capture`：布尔值，表示该事件是否在捕获阶段触发监听函数。
- `once`：布尔值，表示监听函数是否只触发一次，然后就自动移除。
- `passive`：布尔值，表示监听函数不会调用事件的`preventDefault`方法。如果监听函数调用了，浏览器将忽略这个要求，并在监控台输出一行警告。

---

`addEventListener`方法可以为针对当前对象的同一个事件，添加多个不同的监听函数。这些函数按照添加顺序触发，即先添加先触发。如果为同一个事件多次添加同一个监听函数，该函数只会执行一次，多余的添加将自动被去除（不必使用`removeEventListener`方法手动去除）。

```javascript
function hello() {
  console.log("Hello world");
}

document.addEventListener("click", hello, false);
document.addEventListener("click", hello, false);
```

如果希望向监听函数传递参数，可以用匿名函数包装一下监听函数。

```javascript
function print(x) {
  console.log(x);
}

var el = document.getElementById("div1");
el.addEventListener(
  "click",
  function() {
    print("Hello");
  },
  false
);
```

上面代码通过匿名函数，向监听函数 print 传递了一个参数。

监听函数内部的`this`，指向当前事件所在的那个对象。

```javascript
// HTML 代码如下
// <p id="para">Hello</p>
var para = document.getElementById("para");
para.addEventListener(
  "click",
  function(e) {
    console.log(this.nodeName); // "P"
  },
  false
);
```

上面代码中，监听函数内部的`this`指向事件所在的对象 para。

##### 6.1.2 EventTarget.removeEventListener()

`EventTarget.removeEventListener`方法用来移除`addEventListener`方法添加的事件监听函数。该方法没有返回值。

```javascript
div.addEventListener("click", listener, false);
div.removeEventListener("click", listener, false);
```

`removeEventListener`方法的参数，与`addEventListener`方法完全一致。它的第一个参数“事件类型”，大小写敏感。

注意，`removeEventListener`方法移除的监听函数，必须是`addEventListener`方法添加的那个监听函数，而且必须在同一个元素节点，否则无效。

```javascript
div.addEventListener("click", function(e) {}, false);
div.removeEventListener("click", function(e) {}, false);
```

上面代码中，`removeEventListener`方法无效，因为监听函数不是同一个匿名函数。

```javascript
element.addEventListener("mousedown", handleMouseDown, true);
element.removeEventListener("mousedown", handleMouseDown, false);
```

上面代码中，`removeEventListener`方法也是无效的，因为第三个参数不一样。

##### 6.1.3 EventTarget.dispatchEvent()

`EventTarget.dispatchEvent`方法在当前节点上触发指定事件，从而触发监听函数的执行。该方法返回一个布尔值，只要有一个监听函数调用了`Event.preventDefault()`，则返回值为 false，否则为 true。

`target.dispatchEvent(event)`

`dispatchEvent`方法的参数是一个`Event`对象的实例。

```javascript
para.addEventListener("click", hello, false);
var event = new Event("click");
para.dispatchEvent(event);
```

如果`dispatchEvent`方法的参数为空，或者不是一个有效的事件对象，将报错。

下面代码根据`dispatchEvent`方法的返回值，判断事件是否被取消了。

```javascript
var canceled = !cb.dispatchEvent(event);
if (canceled) {
  console.log("事件取消");
} else {
  console.log("事件未取消");
}
```

#### 6.2.监听函数

浏览器的事件模型，就是通过监听函数（listener）对事件做出反应。事件发生后，浏览器监听到了这个事件，就会执行对应的监听函数。这是**事件驱动编程模式（event-driven）**的主要编程方式。

JavaScript 有三种方法，可以为事件绑定监听函数。

##### 6.2.1 HTML 的 on- 属性

HTML 语言允许在元素的属性中，直接定义某些事件的监听代码。

```javascript
<body onload="doSomething()">
<div onclick="console.log('触发事件')">
```

上面代码为 body 节点的`load`事件、div 节点的`click`事件，指定了监听代码。一旦事件发生，就会执行这段代码。

元素的事件监听属性，都是`on`加上事件名，比如`onload`就是`on + load`，表示`load`事件的监听代码。

注意，这些属性的值是将会执行的代码，而不是一个函数。

```javascript
<!-- 正确 -->
<body onload="doSomething()">

<!-- 错误 -->
<body onload="doSomething">
```

一旦指定的事件发生，`on-`属性的值是原样传入 JavaScript 引擎执行。因此如果要执行函数，不要忘记加上一对圆括号。

使用这个方法指定的监听代码，只会在冒泡阶段触发。

```javascript
<div onClick="console.log(2)">
  <button onClick="console.log(1)">点击</button>
</div>
```

上面代码中，`<button>`是`<div>`的子元素。`<button>`的`click`事件，也会触发`<div>`的`click`事件。由于`on-`属性的监听代码，只在冒泡阶段触发，所以点击结果是先输出 1，再输出 2，即事件从子元素开始冒泡到父元素。

直接设置`on-`属性，与通过元素节点的`setAttribute`方法设置`on-`属性，效果是一样的。

```javascript
el.setAttribute("onclick", "doSomething()");
// 等同于
// <Element onclick="doSomething()">
```

##### 6.2.2 元素节点的事件属性

元素节点对象的事件属性，同样可以指定监听函数。

```javascript
window.onload = doSomething;

div.onclick = function(event) {
  console.log("触发事件");
};
```

使用这个方法指定的监听函数，也是只会在冒泡阶段触发。

注意，这种方法与 HTML 的 on-属性的差异是，它的值是函数名（doSomething），而不像后者，必须给出完整的监听代码（doSomething()）。

##### 6.2.3 EventTarget.addEventListener()

所有 DOM 节点实例都有`addEventListener`方法，用来为该节点定义事件的监听函数。

`window.addEventListener('load', doSomething, false);`

##### 6.2.4 小结

上面三种方法，第一种“HTML 的 `on-` 属性”，违反了 HTML 与 JavaScript 代码相分离的原则，将两者写在一起，不利于代码分工，因此不推荐使用。

第二种“元素节点的事件属性”的缺点在于，同一个事件只能定义一个监听函数，也就是说，如果定义两次`onclick`属性，后一次定义会覆盖前一次。因此，也不推荐使用。

第三种`EventTarget.addEventListener`是推荐的指定监听函数的方法。它有如下优点：

---

- 同一个事件可以添加多个监听函数。
- 能够指定在哪个阶段（捕获阶段还是冒泡阶段）触发监听函数。
- 除了 DOM 节点，其他对象（比如`window`、`XMLHttpRequest`等）也有这个接口，它等于是整个 JavaScript 统一的监听函数接口。

---

#### 6.3.this 的指向

监听函数内部的`this`指向触发事件的那个元素节点。

`<button id="btn" onclick="console.log(this.id)">点击</button>`

执行上面代码，点击后会输出 btn。

其他两种监听函数的写法，`this`的指向也是如此。

```javascript
// HTML 代码如下
// <button id="btn">点击</button>
var btn = document.getElementById("btn");

// 写法一
btn.onclick = function() {
  console.log(this.id);
};

// 写法二
btn.addEventListener(
  "click",
  function(e) {
    console.log(this.id);
  },
  false
);
```

上面两种写法，点击按钮以后也是输出 btn。

#### 6.4.事件的传播

一个事件发生后，会在子元素和父元素之间**传播（propagation）**。这种传播分成三个阶段。

---

- 第一阶段：从 window 对象传导到目标节点（上层传到底层），称为**捕获阶段（capture phase）**。
- 第二阶段：在目标节点上触发，称为**目标阶段（target phase）**。
- 第三阶段：从目标节点传导回 window 对象（从底层传回上层），称为**冒泡阶段（bubbling phase）**。

---

这种三阶段的传播模型，使得同一个事件会在多个节点上触发。

```javascript
<div>
  <p>点击</p>
</div>
```

如果对这两个节点，都设置`click`事件的监听函数（每个节点的捕获阶段和监听阶段，各设置一个监听函数），共计设置四个监听函数。然后，对`<p>`点击，`click`事件会触发四次。

```javascript
var phases = {
  1: "capture",
  2: "target",
  3: "bubble"
};

var div = document.querySelector("div");
var p = document.querySelector("p");

div.addEventListener("click", callback, true);
p.addEventListener("click", callback, true);
div.addEventListener("click", callback, false);
p.addEventListener("click", callback, false);

function callback(event) {
  var tag = event.currentTarget.tagName;
  var phase = phases[event.eventPhase];
  console.log("Tag: '" + tag + "'. EventPhase: '" + phase + "'");
}

// 点击以后的结果
// Tag: 'DIV'. EventPhase: 'capture'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'DIV'. EventPhase: 'bubble'
```

上面代码表示，`click`事件被触发了四次：`<div>`节点的捕获阶段和冒泡阶段各 1 次，`<p>`节点的目标阶段触发了 2 次。

---

- 捕获阶段：事件从`<div>`向`<p>`传播时，触发`<div>`的`click`事件；
- 目标阶段：事件从`<div>`到达`<p>`时，触发`<p>`的`click`事件；
- 冒泡阶段：事件从`<p>`传回`<div>`时，再次触发`<div>`的`click`事件。

---

其中，`<p>`节点有两个监听函数（`addEventListener`方法第三个参数的不同，会导致绑定两个监听函数），因此它们都会因为`click`事件触发一次。所以，`<p>`会在`target`阶段有两次输出。

注意，浏览器总是假定`click`事件的目标节点，就是点击位置嵌套最深的那个节点（本例是`<div>`节点里面的`<p>`节点）。所以，`<p>`节点的捕获阶段和冒泡阶段，都会显示为`target`阶段。

事件传播的最上层对象是`window`，接着依次是`document`，`html（document.documentElement）`和`body（document.body）`。也就是说，上例的事件传播顺序，在捕获阶段依次为`window`、`document`、`html`、`body`、`div`、`p`，在冒泡阶段依次为`p`、`div`、`body`、`html`、`document`、`window`。

#### 6.5.事件的代理

由于事件会在冒泡阶段向上传播到父节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件。这种方法叫做事件的**代理（delegation）**。

```javascript
var ul = document.querySelector("ul");

ul.addEventListener("click", function(event) {
  if (event.target.tagName.toLowerCase() === "li") {
    // some code
  }
});
```

上面代码中，`click`事件的监听函数定义在`<ul>`节点，但是实际上，它处理的是子节点`<li>`的 click 事件。这样做的好处是，只要定义一个监听函数，就能处理多个子节点的事件，而不用在每个`<li>`节点上定义监听函数。而且以后再添加子节点，监听函数依然有效。

如果希望事件到某个节点为止，不再传播，可以使用事件对象的`stopPropagation`方法。

```javascript
// 事件传播到 p 元素后，就不再向下传播了
p.addEventListener(
  "click",
  function(event) {
    event.stopPropagation();
  },
  true
);

// 事件冒泡到 p 元素后，就不再向上冒泡了
p.addEventListener(
  "click",
  function(event) {
    event.stopPropagation();
  },
  false
);
```

上面代码中，`stopPropagation`方法分别在捕获阶段和冒泡阶段，阻止了事件的传播。

但是，`stopPropagation`方法只会阻止事件的传播，不会阻止该事件触发`<p>`节点的其他`click`事件的监听函数。也就是说，不是彻底取消`click`事件。

```javascript
p.addEventListener("click", function(event) {
  event.stopPropagation();
  console.log(1);
});

p.addEventListener("click", function(event) {
  // 会触发
  console.log(2);
});
```

上面代码中，p 元素绑定了两个`click`事件的监听函数。`stopPropagation`方法只能阻止这个事件向其他元素传播。因此，第二个监听函数会触发。输出结果会先是 1，然后是 2。

如果想要彻底阻止这个事件的传播，不再触发后面所有`click`的监听函数，可以使用`stopImmediatePropagation`方法。

```javascript
p.addEventListener("click", function(event) {
  event.stopImmediatePropagation();
  console.log(1);
});

p.addEventListener("click", function(event) {
  // 不会被触发
  console.log(2);
});
```

上面代码中，`stopImmediatePropagation`方法可以彻底阻止这个事件传播，使得后面绑定的所有`click`监听函数都不再触发。所以，只会输出 1，不会输出 2。

#### 6.6.Event 对象概述

事件发生以后，会产生一个事件对象，作为参数传给监听函数。浏览器原生提供一个`Event`对象，所有的事件都是这个对象的实例，或者说继承了`Event.prototype`对象。

`Event`对象本身就是一个构造函数，可以用来生成新的实例。

`event = new Event(type, options);`

`Event`构造函数接受两个参数。第一个参数`type`是字符串，表示事件的名称；第二个参数`options`是一个对象，表示事件对象的配置。该对象主要有下面两个属性。

---

- `bubbles`：布尔值，可选，默认为 false，表示事件对象是否冒泡。
- `cancelable`：布尔值，可选，默认为 false，表示事件是否可以被取消，即能否用`Event.preventDefault()`取消这个事件。一旦事件被取消，就好像从来没有发生过，不会触发浏览器对该事件的默认行为。

---

```javascript
var ev = new Event("look", {
  bubbles: true,
  cancelable: false
});
document.dispatchEvent(ev);
```

上面代码新建一个 look 事件实例，然后使用`dispatchEvent`方法触发该事件。

注意，如果不是显式指定`bubbles`属性为 true，生成的事件就只能在“捕获阶段”触发监听函数。

```javascript
// HTML 代码为
// <div><p>Hello</p></div>
var div = document.querySelector("div");
var p = document.querySelector("p");

function callback(event) {
  var tag = event.currentTarget.tagName;
  console.log("Tag: " + tag); // 没有任何输出
}

div.addEventListener("click", callback, false);

var click = new Event("click");
p.dispatchEvent(click);
```

上面代码中，p 元素发出一个`click`事件，该事件默认不会冒泡。`div.addEventListener`方法指定在冒泡阶段监听，因此监听函数不会触发。如果写成`div.addEventListener('click', callback, true)`，那么在“捕获阶段”可以监听到这个事件。

另一方面，如果这个事件在 div 元素上触发。

`div.dispatchEvent(click);`

那么，不管 div 元素是在冒泡阶段监听，还是在捕获阶段监听，都会触发监听函数。因为这时 div 元素是事件的目标，不存在是否冒泡的问题，div 元素总是会接收到事件，因此导致监听函数生效。

#### 6.7.Event 对象的实例属性

##### 6.7.1 Event.bubbles，Event.eventPhase

`Event.bubbles`属性返回一个布尔值，表示当前事件是否会冒泡。该属性为只读属性，一般用来了解 `Event` 实例是否可以冒泡。前面说过，除非显式声明，`Event`构造函数生成的事件，默认是不冒泡的。

`Event.eventPhase`属性返回一个整数常量，表示事件目前所处的阶段。该属性只读。

`var phase = event.eventPhase;`

`Event.eventPhase`的返回值有四种可能。

---

- 0，事件目前没有发生。
- 1，事件目前处于捕获阶段，即处于从祖先节点向目标节点的传播过程中。
- 2，事件到达目标节点，即 Event.target 属性指向的那个节点。
- 3，事件处于冒泡阶段，即处于从目标节点向祖先节点的反向传播过程中。

---

##### 6.7.2 Event.cancelable，Event.cancelBubble，event.defaultPrevented

`Event.cancelable`属性返回一个布尔值，表示事件是否可以取消。该属性为只读属性，一般用来了解 `Event` 实例的特性。

大多数浏览器的原生事件是可以取消的。比如，取消`click`事件，点击链接将无效。但是除非显式声明，`Event`构造函数生成的事件，默认是不可以取消的。

```javascript
var evt = new Event("foo");
evt.cancelable; // false
```

当`Event.cancelable`属性为 true 时，调用`Event.preventDefault()`就可以取消这个事件，阻止浏览器对该事件的默认行为。

如果事件不能取消，调用`Event.preventDefault()`会没有任何效果。所以使用这个方法之前，最好用`Event.cancelable`属性判断一下是否可以取消。

```javascript
function preventEvent(event) {
  if (event.cancelable) {
    event.preventDefault();
  } else {
    console.warn("This event couldn't be canceled.");
    console.dir(event);
  }
}
```

`Event.cancelBubble`属性是一个布尔值，如果设为 true，相当于执行`Event.stopPropagation()`，可以阻止事件的传播。

`Event.defaultPrevented`属性返回一个布尔值，表示该事件是否调用过`Event.preventDefault`方法。该属性只读。

```javascript
if (event.defaultPrevented) {
  console.log("该事件已经取消了");
}
```

##### 6.7.3 Event.currentTarget，Event.target

`Event.currentTarget`属性返回事件当前所在的节点，即正在执行的监听函数所绑定的那个节点。

`Event.target`属性返回原始触发事件的那个节点，即事件最初发生的节点。事件传播过程中，不同节点的监听函数内部的`Event.target`与`Event.currentTarget`属性的值是不一样的，前者总是不变的，后者则是指向监听函数所在的那个节点对象。

```javascript
// HTML代码为
// <p id="para">Hello <em>World</em></p>
function hide(e) {
  console.log(this === e.currentTarget); // 总是 true
  console.log(this === e.target); // 有可能不是 true
  e.target.style.visibility = "hidden";
}

para.addEventListener("click", hide, false);
```

上面代码中，如果在 para 节点的`<em>`子节点上面点击，则`e.target`指向`<em>`子节点，导致`<em>`子节点（即 World 部分）会不可见。如果点击 Hello 部分，则整个 para 都将不可见。

##### 6.7.4 Event.type

`Event.type`属性返回一个字符串，表示事件类型。事件的类型是在生成事件的时候。该属性只读。

```javascript
var evt = new Event("foo");
evt.type; // "foo"
```

##### 6.7.5 Event.timeStamp

`Event.timeStamp`属性返回一个毫秒时间戳，表示事件发生的时间。它是相对于网页加载成功开始计算的。

```javascript
var evt = new Event("foo");
evt.timeStamp; // 3683.6999999995896
```

它的返回值有可能是整数，也有可能是小数（高精度时间戳），取决于浏览器的设置。

下面是一个计算鼠标移动速度的例子，显示每秒移动的像素数量。

```javascript
var previousX;
var previousY;
var previousT;

window.addEventListener("mousemove", function(event) {
  if (
    previousX !== undefined &&
    previousY !== undefined &&
    previousT !== undefined
  ) {
    var deltaX = event.screenX - previousX;
    var deltaY = event.screenY - previousY;
    var deltaD = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

    var deltaT = event.timeStamp - previousT;
    console.log((deltaD / deltaT) * 1000);
  }

  previousX = event.screenX;
  previousY = event.screenY;
  previousT = event.timeStamp;
});
```

##### 6.7.6 Event.isTrusted

`Event.isTrusted`属性返回一个布尔值，表示该事件是否由真实的用户行为产生。比如，用户点击链接会产生一个`click`事件，该事件是用户产生的；`Event`构造函数生成的事件，则是脚本产生的。

```javascript
var evt = new Event("foo");
evt.isTrusted; // false
```

上面代码中，evt 对象是脚本产生的，所以`isTrusted`属性返回 false。

##### 6.7.7 Event.detail

`Event.detail`属性只有浏览器的 UI （用户界面）事件才具有。该属性返回一个数值，表示事件的某种信息。具体含义与事件类型相关。比如，对于`click`和`dbclick`事件，`Event.detail`是鼠标按下的次数（1 表示单击，2 表示双击，3 表示三击）；对于鼠标滚轮事件，`Event.detail`是滚轮正向滚动的距离，负值就是负向滚动的距离，返回值总是 3 的倍数。

```javascript
// HTML 代码如下
// <p>Hello</p>
function giveDetails(e) {
  console.log(e.detail);
}

document.selectQuery('p') = giveDetails;
```

#### 6.8.Event 对象的实例方法

##### 6.8.1 Event.preventDefault()

`Event.preventDefault`方法取消浏览器对当前事件的默认行为。比如点击链接后，浏览器默认会跳转到另一个页面，使用这个方法以后，就不会跳转了；再比如，按一下空格键，页面向下滚动一段距离，使用这个方法以后也不会滚动了。该方法生效的前提是，事件对象的`cancelable`属性为 true，如果为 false，调用该方法没有任何效果。

注意，该方法只是取消事件对当前元素的默认影响，不会阻止事件的传播。如果要阻止传播，可以使用`stopPropagation()`或`stopImmediatePropagation()`方法。

```javascript
// HTML 代码为
// <input type="checkbox" id="my-checkbox" />
var cb = document.getElementById("my-checkbox");

cb.addEventListener(
  "click",
  function(e) {
    e.preventDefault();
  },
  false
);
```

上面代码中，浏览器的默认行为是单击会选中单选框，取消这个行为，就导致无法选中单选框。

利用这个方法，可以为文本输入框设置校验条件。如果用户的输入不符合条件，就无法将字符输入文本框。

```javascript
// HTML 代码为
// <input type="text" id="my-input" />
var input = document.getElementById("my-input");
input.addEventListener("keypress", checkName, false);

function checkName(e) {
  if (e.charCode < 97 || e.charCode > 122) {
    e.preventDefault();
  }
}
```

上面代码为文本框的`keypress`事件设定监听函数后，将只能输入小写字母，否则输入事件的默认行为（写入文本框）将被取消，导致不能向文本框输入内容。

##### 6.8.2 Event.stopPropagation()

`stopPropagation`方法阻止事件在 DOM 中继续传播，防止再触发定义在别的节点上的监听函数，但是不包括在当前节点上其他的事件监听函数。

```javascript
function stopEvent(e) {
  e.stopPropagation();
}

el.addEventListener("click", stopEvent, false);
```

上面代码中，click 事件将不会进一步冒泡到 el 节点的父节点。

##### 6.8.3 Event.stopImmediatePropagation()

`Event.stopImmediatePropagation`方法阻止同一个事件的其他监听函数被调用，不管监听函数定义在当前节点还是其他节点。也就是说，该方法阻止事件的传播，比`Event.stopPropagation()`更彻底。

如果同一个节点对于同一个事件指定了多个监听函数，这些函数会根据添加的顺序依次调用。只要其中有一个监听函数调用了`Event.stopImmediatePropagation`方法，其他的监听函数就不会再执行了。

```javascript
function l1(e) {
  e.stopImmediatePropagation();
}

function l2(e) {
  console.log("hello world");
}

el.addEventListener("click", l1, false);
el.addEventListener("click", l2, false);
```

上面代码在 el 节点上，为 click 事件添加了两个监听函数 l1 和 l2。由于 l1 调用了`event.stopImmediatePropagation`方法，所以 l2 不会被调用。

##### 6.8.4 Event.composedPath()

`Event.composedPath()`返回一个数组，成员是事件的最底层节点和依次冒泡经过的所有上层节点。

```javascript
// HTML 代码如下
// <div>
//   <p>Hello</p>
// </div>
var div = document.querySelector("div");
var p = document.querySelector("p");

div.addEventListener(
  "click",
  function(e) {
    console.log(e.composedPath());
  },
  false
);
// [p, div, body, html, document, Window]
```

#### 6.9.CustomEvent 接口

`CustomEvent` 接口用于生成自定义的事件实例。那些浏览器预定义的事件，虽然可以手动生成，但是往往不能在事件上绑定数据。如果需要在触发事件的同时，传入指定的数据，就可以使用 `CustomEvent` 接口生成的自定义事件对象。

浏览器原生提供`CustomEvent()`构造函数，用来生成 `CustomEvent` 事件实例。

`new CustomEvent(type, options)`

`CustomEvent()`构造函数接受两个参数。第一个参数是字符串，表示事件的名字，这是必须的。第二个参数是事件的配置对象，这个参数是可选的。`CustomEvent`的配置对象除了接受 `Event` 事件的配置属性，只有一个自己的属性。

- `detail`：表示事件的附带数据，默认为`null`。

下面是一个例子。

```javascript
var event = new CustomEvent("build", { detail: "hello" });

function eventHandler(e) {
  console.log(e.detail);
}

document.body.addEventListener("build", function(e) {
  console.log(e.detail);
});

document.body.dispatchEvent(event);
```

上面代码中，我们手动定义了 build 事件。该事件触发后，会被监听到，从而输出该事件实例的`detail`属性（即字符串 hello）。

下面是另一个例子。

```javascript
var myEvent = new CustomEvent("myevent", {
  detail: {
    foo: "bar"
  },
  bubbles: true,
  cancelable: false
});

el.addEventListener("myevent", function(event) {
  console.log("Hello " + event.detail.foo);
});

el.dispatchEvent(myEvent);
```

上面代码也说明，`CustomEvent` 的事件实例，除了具有 `Event` 接口的实例属性，还具有`detail`属性。

### 7.事件类型

浏览器支持大量的事件，本章介绍其中一些主要的事件。

#### 7.1.鼠标事件

鼠标事件指与鼠标相关的事件，继承了`MouseEvent`接口。具体的事件主要有以下一些。

---

- `click`：按下鼠标（通常是按下主按钮）时触发。
- `dblclick`：在同一个元素上双击鼠标时触发。

---

- `mousedown`：按下鼠标键时触发。
- `mouseup`：释放按下的鼠标键时触发。
- `mousemove`：当鼠标在一个节点内部移动时触发。当鼠标持续移动时，该事件会连续触发。为了避免性能问题，建议对该事件的监听函数做一些限定，比如限定一段时间内只能运行一次。

---

- `mouseenter`：鼠标进入一个节点时触发，进入子节点不会触发这个事件。
- `mouseover`：鼠标进入一个节点时触发，进入子节点会再一次触发这个事件。
- `mouseout`：鼠标离开一个节点时触发，离开父节点也会触发这个事件。
- `mouseleave`：鼠标离开一个节点时触发，离开父节点不会触发这个事件。

---

- `contextmenu`：按下鼠标右键时（上下文菜单出现前）触发，或者按下“上下文菜单键”时触发。
- `wheel`：滚动鼠标的滚轮时触发，该事件继承的是 WheelEvent 接口。

---

`click`事件指的是，用户在同一个位置先完成`mousedown`动作，再完成`mouseup`动作。因此，触发顺序是，`mousedown`首先触发，`mouseup`接着触发，`click`最后触发。

`dblclick`事件则会在`mousedown`、`mouseup`、`click`之后触发。

`mouseover`事件和`mouseenter`事件，都是鼠标进入一个节点时触发。两者的区别是，`mouseenter`事件只触发一次，而只要鼠标在节点内部移动，`mouseover`事件会在子节点上触发多次。

```javascript
/* HTML 代码如下
 <ul>
   <li>item 1</li>
   <li>item 2</li>
  <li>item 3</li>
 </ul>
*/

var ul = document.querySelector("ul");

// 进入 ul 节点以后，mouseenter 事件只会触发一次
// 以后只要鼠标在节点内移动，都不会再触发这个事件
// event.target 是 ul 节点
ul.addEventListener(
  "mouseenter",
  function(event) {
    event.target.style.color = "purple";
    setTimeout(function() {
      event.target.style.color = "";
    }, 500);
  },
  false
);

// 进入 ul 节点以后，只要在子节点上移动，mouseover 事件会触发多次
// event.target 是 li 节点
ul.addEventListener(
  "mouseover",
  function(event) {
    event.target.style.color = "orange";
    setTimeout(function() {
      event.target.style.color = "";
    }, 500);
  },
  false
);
```

上面代码中，在父节点内部进入子节点，不会触发`mouseenter`事件，但是会触发`mouseover`事件。

`mouseout`事件和`mouseleave`事件，都是鼠标离开一个节点时触发。两者的区别是，在父元素内部离开一个子元素时，`mouseleave`事件不会触发，而`mouseout`事件会触发。

```javascript
/* HTML 代码如下
 <ul>
   <li>item 1</li>
   <li>item 2</li>
  <li>item 3</li>
 </ul>
*/

var ul = document.querySelector("ul");

// 先进入 ul 节点，然后在节点内部移动，不会触发 mouseleave 事件
// 只有离开 ul 节点时，触发一次 mouseleave
// event.target 是 ul 节点
ul.addEventListener(
  "mouseleave",
  function(event) {
    event.target.style.color = "purple";
    setTimeout(function() {
      event.target.style.color = "";
    }, 500);
  },
  false
);

// 先进入 ul 节点，然后在节点内部移动，mouseout 事件会触发多次
// event.target 是 li 节点
ul.addEventListener(
  "mouseout",
  function(event) {
    event.target.style.color = "orange";
    setTimeout(function() {
      event.target.style.color = "";
    }, 500);
  },
  false
);
```

上面代码中，在父节点内部离开子节点，不会触发`mouseleave`事件，但是会触发`mouseout`事件。

#### 7.2.MouseEvent 接口概述

`MouseEvent`接口代表了鼠标相关的事件，单击（click）、双击（dblclick）、松开鼠标键（mouseup）、按下鼠标键（mousedown）等动作，所产生的事件对象都是`MouseEvent`实例。此外，滚轮事件和拖拉事件也是`MouseEvent`实例。

`MouseEvent`接口继承了`Event`接口，所以拥有`Event`的所有属性和方法。它还有自己的属性和方法。

浏览器原生提供一个`MouseEvent`构造函数，用于新建一个`MouseEvent`实例。

`var event = new MouseEvent(type, options);`

`MouseEvent`构造函数接受两个参数。第一个参数是字符串，表示事件名称；第二个参数是一个事件配置对象，该参数可选。除了`Event`接口的实例配置属性，该对象可以配置以下属性，所有属性都是可选的。

---

- `screenX`：数值，鼠标相对于屏幕的水平位置（单位像素），默认值为 0，设置该属性不会移动鼠标。
- `screenY`：数值，鼠标相对于屏幕的垂直位置（单位像素），其他与`screenX`相同。

---

- `clientX`：数值，鼠标相对于程序窗口的水平位置（单位像素），默认值为 0，设置该属性不会移动鼠标。
- `clientY`：数值，鼠标相对于程序窗口的垂直位置（单位像素），其他与`clientX`相同。

---

- `ctrlKey`：布尔值，是否同时按下了 `Ctrl` 键，默认值为 false。
- `shiftKey`：布尔值，是否同时按下了 `Shift` 键，默认值为 false。
- `altKey`：布尔值，是否同时按下 `Alt` 键，默认值为 false。
- `metaKey`：布尔值，是否同时按下 `Meta` 键，默认值为 false。

---

- `button`：数值，表示按下了哪一个鼠标按键，默认值为 0，表示按下主键（通常是鼠标的左键）或者当前事件没有定义这个属性；1 表示按下辅助键（通常是鼠标的中间键），2 表示按下次要键（通常是鼠标的右键）。

---

- `buttons`：数值，表示按下了鼠标的哪些键，是一个三个比特位的二进制值，默认为 0（没有按下任何键）。1（二进制 001）表示按下主键（通常是左键），2（二进制 010）表示按下次要键（通常是右键），4（二进制 100）表示按下辅助键（通常是中间键）。因此，如果返回 3（二进制 011）就表示同时按下了左键和右键。

---

- `relatedTarget`：节点对象，表示事件的相关节点，默认为`null`。`mouseenter`和`mouseover`事件时，表示鼠标刚刚离开的那个元素节点；`mouseout`和`mouseleave`事件时，表示鼠标正在进入的那个元素节点。

---

下面是一个例子。

```javascript
function simulateClick() {
  var event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true
  });
  var cb = document.getElementById("checkbox");
  cb.dispatchEvent(event);
}
```

上面代码生成一个鼠标点击事件，并触发该事件。

#### 7.3.MouseEvent 接口的实例属性

##### 7.3.1 MouseEvent.altKey，MouseEvent.ctrlKey，MouseEvent.metaKey，MouseEvent.shiftKey

`MouseEvent.altKey`、`MouseEvent.ctrlKey`、`MouseEvent.metaKey`、`MouseEvent.shiftKey`这四个属性都返回一个布尔值，表示事件发生时，是否按下对应的键。它们都是只读属性。

---

- altKey 属性：Alt 键
- ctrlKey 属性：Ctrl 键
- metaKey 属性：Meta 键（Mac 键盘是一个四瓣的小花，Windows 键盘是 Windows 键）
- shiftKey 属性：Shift 键

---

```javascript
// HTML 代码如下
// <body onclick="showKey(event)">
function showKey(e) {
  console.log("ALT key pressed: " + e.altKey);
  console.log("CTRL key pressed: " + e.ctrlKey);
  console.log("META key pressed: " + e.metaKey);
  console.log("SHIFT key pressed: " + e.shiftKey);
}
```

上面代码中，点击网页会输出是否同时按下对应的键。

##### 7.3.2 MouseEvent.button，MouseEvent.buttons

`MouseEvent.button`属性返回一个数值，表示事件发生时按下了鼠标的哪个键。该属性只读。

---

- 0：按下主键（通常是左键），或者该事件没有初始化这个属性（比如`mousemove`事件）。
- 1：按下辅助键（通常是中键或者滚轮键）。
- 2：按下次键（通常是右键）。

---

```javascript
// HTML 代码为
// <button onmouseup="whichButton(event)">点击</button>
var whichButton = function(e) {
  switch (e.button) {
    case 0:
      console.log("Left button clicked.");
      break;
    case 1:
      console.log("Middle button clicked.");
      break;
    case 2:
      console.log("Right button clicked.");
      break;
    default:
      console.log("Unexpected code: " + e.button);
  }
};
```

`MouseEvent.buttons`属性返回一个三个比特位的值，表示同时按下了哪些键。它用来处理同时按下多个鼠标键的情况。该属性只读。

---

- 1：二进制为 001（十进制的 1），表示按下左键。
- 2：二进制为 010（十进制的 2），表示按下右键。
- 4：二进制为 100（十进制的 4），表示按下中键或滚轮键。

---

同时按下多个键的时候，每个按下的键对应的比特位都会有值。比如，同时按下左键和右键，会返回 3（二进制为 011）。

##### 7.3.3 MouseEvent.clientX，MouseEvent.clientY

`MouseEvent.clientX`属性返回鼠标位置相对于浏览器窗口左上角的水平坐标（单位像素），`MouseEvent.clientY`属性返回垂直坐标。这两个属性都是只读属性。

```javascript
// HTML 代码为
// <body onmousedown="showCoords(event)">
function showCoords(evt) {
  console.log(
    "clientX value: " +
      evt.clientX +
      "\n" +
      "clientY value: " +
      evt.clientY +
      "\n"
  );
}
```

> 这两个属性还分别有一个别名`MouseEvent.x`和`MouseEvent.y`。

##### 7.3.4 MouseEvent.movementX，MouseEvent.movementY

`MouseEvent.movementX`属性返回当前位置与上一个`mousemove`事件之间的水平距离（单位像素）。数值上，它等于下面的计算公式。

`currentEvent.movementX = currentEvent.screenX - previousEvent.screenX`

`MouseEvent.movementY`属性返回当前位置与上一个`mousemove`事件之间的垂直距离（单位像素）。数值上，它等于下面的计算公式。

`currentEvent.movementY = currentEvent.screenY - previousEvent.screenY。`

> 这两个属性都是只读属性。

##### 7.3.5 MouseEvent.screenX，MouseEvent.screenY

`MouseEvent.screenX`属性返回鼠标位置相对于屏幕左上角的水平坐标（单位像素），`MouseEvent.screenY`属性返回垂直坐标。这两个属性都是只读属性。

```javascript
// HTML 代码如下
// <body onmousedown="showCoords(event)">
function showCoords(evt) {
  console.log(
    'screenX value: ' + evt.screenX + '\n'
    'screenY value: ' + evt.screenY + '\n'
  );
}
```

##### 7.3.6 MouseEvent.offsetX，MouseEvent.offsetY

`MouseEvent.offsetX`属性返回鼠标位置与目标节点左侧的`padding`边缘的水平距离（单位像素），`MouseEvent.offsetY`属性返回与目标节点上方的`padding`边缘的垂直距离。这两个属性都是只读属性。

```javascript
/* HTML 代码如下
  <style>
    p {
      width: 100px;
      height: 100px;
      padding: 100px;
    }
  </style>
  <p>Hello</p>
*/
var p = document.querySelector("p");
p.addEventListener(
  "click",
  function(e) {
    console.log(e.offsetX);
    console.log(e.offsetY);
  },
  false
);
```

上面代码中，鼠标如果在 p 元素的中心位置点击，会返回 150 150。因此中心位置距离左侧和上方的`padding`边缘，等于`padding`的宽度（100 像素）加上元素内容区域一半的宽度（50 像素）。

##### 7.3.7 MouseEvent.pageX，MouseEvent.pageY

`MouseEvent.pageX`属性返回鼠标位置与文档左侧边缘的距离（单位像素），`MouseEvent.pageY`属性返回与文档上侧边缘的距离（单位像素）。它们的返回值都包括文档不可见的部分。这两个属性都是只读。

```javascript
/* HTML 代码如下
  <style>
    body {
      height: 2000px;
    }
  </style>
*/
document.body.addEventListener(
  "click",
  function(e) {
    console.log(e.pageX);
    console.log(e.pageY);
  },
  false
);
```

上面代码中，页面高度为 2000 像素，会产生垂直滚动条。滚动到页面底部，点击鼠标输出的`pageY`值会接近 2000。

##### 7.3.8 MouseEvent.relatedTarget

`MouseEvent.relatedTarget`属性返回事件的相关节点。对于那些没有相关节点的事件，该属性返回`null`。该属性只读。

下表列出不同事件的`target`属性值和`relatedTarget`属性值义。

|   事件名称   | `target` 属性  | `relatedTarget` 属性 |
| :----------: | -------------- | -------------------- |
|  `focusin`   | 接受焦点的节点 | 丧失焦点的节点       |
|  `focusout`  | 丧失焦点的节点 | 接受焦点的节点       |
| `mouseenter` | 将要进入的节点 | 将要离开的节点       |
| `mouseleave` | 将要离开的节点 | 将要进入的节点       |
|  `mouseout`  | 将要离开的节点 | 将要进入的节点       |
| `mouseover`  | 将要进入的节点 | 将要离开的节点       |
| `dragenter`  | 将要进入的节点 | 将要离开的节点       |
|  `dragexit`  | 将要离开的节点 | 将要进入的节点       |

下面是一个例子。

```javascript
/*
  HTML 代码如下
  <div id="outer" style="height:50px;width:50px;border-width:1px solid black;">
    <div id="inner" style="height:25px;width:25px;border:1px solid black;"></div>
  </div>
*/

var inner = document.getElementById("inner");
inner.addEventListener(
  "mouseover",
  function(event) {
    console.log("进入" + event.target.id + " 离开" + event.relatedTarget.id);
  },
  false
);
inner.addEventListener("mouseenter", function(event) {
  console.log("进入" + event.target.id + " 离开" + event.relatedTarget.id);
});
inner.addEventListener("mouseout", function() {
  console.log("离开" + event.target.id + " 进入" + event.relatedTarget.id);
});
inner.addEventListener("mouseleave", function() {
  console.log("离开" + event.target.id + " 进入" + event.relatedTarget.id);
});

// 鼠标从 outer 进入inner，输出
// 进入inner 离开outer
// 进入inner 离开outer

// 鼠标从 inner进入 outer，输出
// 离开inner 进入outer
// 离开inner 进入outer
```

#### 7.4.MouseEvent 接口的实例方法

##### 7.4.1 MouseEvent.getModifierState()

`MouseEvent.getModifierState`方法返回一个布尔值，表示有没有按下特定的功能键。它的参数是一个表示功能键的字符串。

```javascript
document.addEventListener(
  "click",
  function(e) {
    console.log(e.getModifierState("CapsLock"));
  },
  false
);
```

上面的代码可以了解用户是否按下了大写键。

#### 7.5.WheelEvent 接口

##### 7.5.1 概述

`WheelEvent` 接口继承了 `MouseEvent` 实例，代表鼠标滚轮事件的实例对象。目前，鼠标滚轮相关的事件只有一个`wheel`事件，用户滚动鼠标的滚轮，就生成这个事件的实例。

浏览器原生提供`WheelEvent()`构造函数，用来生成`WheelEvent`实例。

`var wheelEvent = new WheelEvent(type, options);`

`WheelEvent()`构造函数可以接受两个参数，第一个是字符串，表示事件类型，对于滚轮事件来说，这个值目前只能是`wheel`。第二个参数是事件的配置对象。该对象的属性除了`Event`、`UIEvent`的配置属性以外，还可以接受以下几个属性，所有属性都是可选的。

---

- `deltaX`：数值，表示滚轮的水平滚动量，默认值是 0.0。
- `deltaY`：数值，表示滚轮的垂直滚动量，默认值是 0.0。
- `deltaZ`：数值，表示滚轮的 Z 轴滚动量，默认值是 0.0。
- `deltaMode`：数值，表示相关的滚动事件的单位，适用于上面三个属性。0 表示滚动单位为像素，1 表示单位为行，2 表示单位为页，默认为 0。

---

##### 7.5.2 实例属性

`WheelEvent`事件实例除了具有`Event`和`MouseEvent`的实例属性和实例方法，还有一些自己的实例属性，但是没有自己的实例方法。

下面的属性都是只读属性。

---

- `WheelEvent.deltaX`：数值，表示滚轮的水平滚动量。
- `WheelEvent.deltaY`：数值，表示滚轮的垂直滚动量。
- `WheelEvent.deltaZ`：数值，表示滚轮的 Z 轴滚动量。
- `WheelEvent.deltaMode`：数值，表示上面三个属性的单位，0 是像素，1 是行，2 是页。

---

#### 7.6.键盘事件

键盘事件由用户击打键盘触发，主要有`keydown`、`keypress`、`keyup`三个事件，它们都继承了`KeyboardEvent`接口。

---

- `keydown`：按下键盘时触发。
- `keypress`：按下有值的键时触发，即按下 Ctrl、Alt、Shift、Meta 这样无值的键，这个事件不会触发。对于有值的键，按下时先触发`keydown`事件，再触发这个事件。
- `keyup`：松开键盘时触发该事件。

---

如果用户一直按键不松开，就会连续触发键盘事件，触发的顺序如下。

---

- a.keydown
- b.keypress
- c.keydown
- d.keypress
- e.…（重复以上过程）
- f.keyup

---

#### 7.7.KeyboardEvent 接口

`KeyboardEvent`接口用来描述用户与键盘的互动。这个接口继承了`Event`接口，并且定义了自己的实例属性和实例方法。

浏览器原生提供`KeyboardEvent`构造函数，用来新建键盘事件的实例。

`new KeyboardEvent(type, options)`

`KeyboardEvent`构造函数接受两个参数。第一个参数是字符串，表示事件类型；第二个参数是一个事件配置对象，该参数可选。除了`Event`接口提供的属性，还可以配置以下字段，它们都是可选。

---

- `key`：字符串，当前按下的键，默认为空字符串。
- `code`：字符串，表示当前按下的键的字符串形式，默认为空字符串。
- `location`：整数，当前按下的键的位置，默认为 0。

---

- `ctrlKey`：布尔值，是否按下 Ctrl 键，默认为 false。
- `shiftKey`：布尔值，是否按下 Shift 键，默认为 false。
- `altKey`：布尔值，是否按下 Alt 键，默认为 false。
- `metaKey`：布尔值，是否按下 Meta 键，默认为 false。
- `repeat`：布尔值，是否重复按键，默认为 false。

---

#### 7.8.KeyboardEvent 的实例属性

##### 7.8.1 KeyboardEvent.altKey，KeyboardEvent.metaKey.ctrlKey，KeyboardEvent.metaKey，KeyboardEvent.shiftKey

以下属性都是只读属性，返回一个布尔值，表示是否按下对应的键。

---

- `KeyboardEvent.altKey`：是否按下 Alt 键
- `KeyboardEvent.ctrlKey`：是否按下 Ctrl 键
- `KeyboardEvent.metaKey`：是否按下 meta 键（Mac 系统是一个四瓣的小花，Windows 系统是 windows 键）
- `KeyboardEvent.shiftKey`：是否按下 Shift 键

---

下面是一个示例。

```javascript
function showChar(e) {
  console.log("ALT: " + e.altKey);
  console.log("CTRL: " + e.ctrlKey);
  console.log("Meta: " + e.metaKey);
  console.log("Meta: " + e.shiftKey);
}

document.body.addEventListener("click", showChar, false);
```

##### 7.8.2 KeyboardEvent.code

`KeyboardEvent.code`属性返回一个字符串，表示当前按下的键的字符串形式。该属性只读。

下面是一些常用键的字符串形式，其他键请查文档。

---

- 数字键 0 - 9：返回`digital0 - digital9`
- 字母键 A - z：返回`KeyA - KeyZ`
- 功能键 F1 - F12：返回 `F1 - F12`
- 方向键：返回`ArrowDown、ArrowUp、ArrowLeft、ArrowRight`
- Alt 键：返回`AltLeft`或`AltRight`
- Shift 键：返回`ShiftLeft`或`ShiftRight`
- Ctrl 键：返回`ControLeft`或`ControlRight`

---

##### 7.8.3 KeyboardEvent.key

`KeyboardEvent.key`属性返回一个字符串，表示按下的键名。该属性只读。

如果按下的键代表可打印字符，则返回这个字符，比如数字、字母。

如果按下的键代表不可打印的特殊字符，则返回预定义的键值，比如 Backspace，Tab，Enter，Shift，Control，Alt，CapsLock，Esc，Spacebar，PageUp，PageDown，End，Home，Left，Right，Up，Down，PrintScreen，Insert，Del，Win，F1 ～ F12，NumLock，Scroll 等。

如果同时按下一个控制键和一个符号键，则返回符号键的键名。比如，按下 Ctrl + a，则返回 a；按下 Shift + a，则返回大写的 A。

如果无法识别键名，返回字符串`Unidentified`。

##### 7.8.4 KeyboardEvent.location

`KeyboardEvent.location`属性返回一个整数，表示按下的键处在键盘的哪一个区域。它可能取以下值。

---

- 0：处在键盘的主区域，或者无法判断处于哪一个区域。
- 1：处在键盘的左侧，只适用那些有两个位置的键（比如 Ctrl 和 Shift 键）。
- 2：处在键盘的右侧，只适用那些有两个位置的键（比如 Ctrl 和 Shift 键）。
- 3：处在数字小键盘。

---

##### 7.8.5 KeyboardEvent.repeat

`KeyboardEvent.repeat`返回一个布尔值，代表该键是否被按着不放，以便判断是否重复这个键，即浏览器会持续触发`keydown`和`keypress`事件，直到用户松开手为止。

#### 7.9.KeyboardEvent 的实例方法

##### 7.9.1 KeyboardEvent.getModifierState()

`KeyboardEvent.getModifierState()`方法返回一个布尔值，表示是否按下或激活指定的功能键。它的常用参数如下。

---

- Alt：Alt 键
- CapsLock：大写锁定键
- Control：Ctrl 键
- Meta：Meta 键
- NumLock：数字键盘开关键
- Shift：Shift 键

---

```javascript
if (
  event.getModifierState("Control") +
    event.getModifierState("Alt") +
    event.getModifierState("Meta") >
  1
) {
  return;
}
```

上面代码表示，只要 Control、Alt、Meta 里面，同时按下任意两个或两个以上的键就返回。

#### 7.10.进度事件

进度事件用来描述资源加载的进度，主要由 AJAX 请求、`<img>`、`<audio>`、`<video>`、`<style>`、`<link>`等外部资源的加载触发，继承了`ProgressEvent`接口。它主要包含以下几种事件。

---

- `abort`：外部资源中止加载时（比如用户取消）触发。如果发生错误导致中止，不会触发该事件。
- `error`：由于错误导致外部资源无法加载时触发。
- `load`：外部资源加载成功时触发。
- `loadstart`：外部资源开始加载时触发。
- `loadend`：外部资源停止加载时触发，发生顺序排在`error`、`abort`、`load`等事件的后面。
- `progress`：外部资源加载过程中不断触发。
- `timeout`：加载超时时触发。

---

注意，除了资源下载，文件上传也存在这些事件。

下面是一个例子。

```javascript
image.addEventListener("load", function(event) {
  image.classList.add("finished");
});

image.addEventListener("error", function(event) {
  image.style.display = "none";
});
```

上面代码在图片元素加载完成后，为图片元素添加一个 finished 的 Class。如果加载失败，就把图片元素的样式设置为不显示。

有时候，图片加载会在脚本运行之前就完成，尤其是当脚本放置在网页底部的时候，因此有可能`load`和`error`事件的监听函数根本不会执行。所以，比较可靠的方式，是用`complete`属性先判断一下是否加载完成。

```javascript
function loaded() {
  // ...
}

if (image.complete) {
  loaded();
} else {
  image.addEventListener("load", loaded);
}
```

由于 DOM 的元素节点没有提供是否加载错误的属性，所以`error`事件的监听函数最好放在`<img>`元素的 HTML 代码中，这样才能保证发生加载错误时百分之百会执行。

`<img src="/wrong/url" onerror="this.style.display='none';" />`

`loadend`事件的监听函数，可以用来取代`abort`事件、`load`事件、`error`事件的监听函数，因为它总是在这些事件之后发生。

```javascript
req.addEventListener("loadend", loadEnd, false);

function loadEnd(e) {
  console.log("传输结束，成功失败未知");
}
```

`loadend`事件本身不提供关于进度结束的原因，但可以用它来做所有加载结束场景都需要做的一些操作。

另外，`error`事件有一个特殊的性质，就是不会冒泡。所以，子元素的`error`事件，不会触发父元素的`error`事件监听函数。

#### 7.11.ProgressEvent 接口

`ProgressEvent`接口主要用来描述外部资源加载的进度，比如 AJAX 加载、`<img>`、`<video>`、`<style>`、`<link>`等外部资源加载。进度相关的事件都继承了这个接口。

浏览器原生提供了`ProgressEvent()`构造函数，用来生成事件实例。

`new ProgressEvent(type, options)`

`ProgressEvent()`构造函数接受两个参数。第一个参数是字符串，表示事件的类型，这个参数是必须的。第二个参数是一个配置对象，表示事件的属性，该参数可选。配置对象除了可以使用`Event`接口的配置属性，还可以使用下面的属性，所有这些属性都是可选的。

---

- `lengthComputable`：布尔值，表示加载的总量是否可以计算，默认是 false。
- `loaded`：整数，表示已经加载的量，默认是 0。
- `total`：整数，表示需要加载的总量，默认是 0。

---

`ProgressEvent`具有对应的实例属性。

---

- `ProgressEvent.lengthComputable`
- `ProgressEvent.loaded`
- `ProgressEvent.total`

---

如果`ProgressEvent.lengthComputable`为 false，`ProgressEvent.total`实际上是没有意义的。

下面是一个例子。

```javascript
var p = new ProgressEvent("load", {
  lengthComputable: true,
  loaded: 30,
  total: 100
});

document.body.addEventListener("load", function(e) {
  console.log("已经加载：" + (e.loaded / e.total) * 100 + "%");
});

document.body.dispatchEvent(p);
// 已经加载：30%
```

上面代码先构造一个`load`事件，抛出后被监听函数捕捉到。

下面是一个实际的例子。

```javascript
var xhr = new XMLHttpRequest();

xhr.addEventListener("progress", updateProgress, false);
xhr.addEventListener("load", transferComplete, false);
xhr.addEventListener("error", transferFailed, false);
xhr.addEventListener("abort", transferCanceled, false);

xhr.open();

function updateProgress(e) {
  if (e.lengthComputable) {
    var percentComplete = e.loaded / e.total;
  } else {
    console.log("不能计算进度");
  }
}

function transferComplete(e) {
  console.log("传输结束");
}

function transferFailed(evt) {
  console.log("传输过程中发生错误");
}

function transferCanceled(evt) {
  console.log("用户取消了传输");
}
```

上面是下载过程的进度事件，还存在上传过程的进度事件。这时所有监听函数都要放在`XMLHttpRequest.upload`对象上面。

```javascript
var xhr = new XMLHttpRequest();

xhr.upload.addEventListener("progress", updateProgress, false);
xhr.upload.addEventListener("load", transferComplete, false);
xhr.upload.addEventListener("error", transferFailed, false);
xhr.upload.addEventListener("abort", transferCanceled, false);

xhr.open();
```

#### 7.12.拖拉事件

**拖拉（drag）**指的是，用户在某个对象上按下鼠标键不放，拖动它到另一个位置，然后释放鼠标键，将该对象放在那里。

拖拉的对象有好几种，包括元素节点、图片、链接、选中的文字等等。在网页中，除了元素节点默认不可以拖拉，其他（图片、链接、选中的文字）都是可以直接拖拉的。为了让元素节点可拖拉，可以将该节点的`draggable`属性设为 true。

```javascript
<div draggable="true">此区域可拖拉</div>
```

`draggable`属性可用于任何元素节点，但是图片（`<img>`）和链接（`<a>`）不加这个属性，就可以拖拉。对于它们，用到这个属性的时候，往往是将其设为 false，防止拖拉这两种元素。

注意，一旦某个元素节点的`draggable`属性设为 true，就无法再用鼠标选中该节点内部的文字或子节点了。

当元素节点或选中的文本被拖拉时，就会持续触发拖拉事件，包括以下一些事件。

---

- `drag`：拖拉过程中，在被拖拉的节点上持续触发（相隔几百毫秒）。
- `dragstart`：用户开始拖拉时，在被拖拉的节点上触发，该事件的`target`属性是被拖拉的节点。通常应该在这个事件的监听函数中，指定拖拉的数据。

---

- `dragend`：拖拉结束时（释放鼠标键或按下 ESC 键）在被拖拉的节点上触发，该事件的`target`属性是被拖拉的节点。它与`dragstart`事件，在同一个节点上触发。不管拖拉是否跨窗口，或者中途被取消，`dragend`事件总是会触发的。

---

- `dragenter`：拖拉进入当前节点时，在当前节点上触发一次，该事件的`target`属性是当前节点。通常应该在这个事件的监听函数中，指定是否允许在当前节点放下（drop）拖拉的数据。如果当前节点没有该事件的监听函数，或者监听函数不执行任何操作，就意味着不允许在当前节点放下数据。在视觉上显示拖拉进入当前节点，也是在这个事件的监听函数中设置。

---

- `dragover`：拖拉到当前节点上方时，在当前节点上持续触发（相隔几百毫秒），该事件的`target`属性是当前节点。该事件与`dragenter`事件的区别是，`dragenter`事件在进入该节点时触发，然后只要没有离开这个节点，`dragover`事件会持续触发。

---

- `dragleave`：拖拉操作离开当前节点范围时，在当前节点上触发，该事件的`target`属性是当前节点。如果要在视觉上显示拖拉离开操作当前节点，就在这个事件的监听函数中设置。

---

- `drop`：被拖拉的节点或选中的文本，释放到目标节点时，在目标节点上触发。注意，如果当前节点不允许 drop，即使在该节点上方松开鼠标键，也不会触发该事件。如果用户按下 ESC 键，取消这个操作，也不会触发该事件。该事件的监听函数负责取出拖拉数据，并进行相关处理。

---

下面的例子展示，如何动态改变被拖动节点的背景色。

```javascript
div.addEventListener(
  "dragstart",
  function(e) {
    this.style.backgroundColor = "red";
  },
  false
);

div.addEventListener(
  "dragend",
  function(e) {
    this.style.backgroundColor = "green";
  },
  false
);
```

上面代码中，div 节点被拖动时，背景色会变为红色，拖动结束，又变回绿色。

下面是一个例子，展示如何实现将一个节点从当前父节点，拖拉到另一个父节点中。

```javascript
/* HTML 代码如下
 <div class="dropzone">
   <div id="draggable" draggable="true">
     该节点可拖拉
   </div>
 </div>
 <div class="dropzone"></div>
 <div class="dropzone"></div>
 <div class="dropzone"></div>
*/

// 被拖拉节点
var dragged;

document.addEventListener(
  "dragstart",
  function(event) {
    // 保存被拖拉节点
    dragged = event.target;
    // 被拖拉节点的背景色变透明
    event.target.style.opacity = 0.5;
  },
  false
);

document.addEventListener(
  "dragend",
  function(event) {
    // 被拖拉节点的背景色恢复正常
    event.target.style.opacity = "";
  },
  false
);

document.addEventListener(
  "dragover",
  function(event) {
    // 防止拖拉效果被重置，允许被拖拉的节点放入目标节点
    event.preventDefault();
  },
  false
);

document.addEventListener(
  "dragenter",
  function(event) {
    // 目标节点的背景色变紫色
    // 由于该事件会冒泡，所以要过滤节点
    if (event.target.className === "dropzone") {
      event.target.style.background = "purple";
    }
  },
  false
);

document.addEventListener(
  "dragleave",
  function(event) {
    // 目标节点的背景色恢复原样
    if (event.target.className === "dropzone") {
      event.target.style.background = "";
    }
  },
  false
);

document.addEventListener(
  "drop",
  function(event) {
    // 防止事件默认行为（比如某些元素节点上可以打开链接），
    event.preventDefault();
    if (event.target.className === "dropzone") {
      // 恢复目标节点背景色
      event.target.style.background = "";
      // 将被拖拉节点插入目标节点
      dragged.parentNode.removeChild(dragged);
      event.target.appendChild(dragged);
    }
  },
  false
);
```

关于拖拉事件，有以下几个注意点。

---

- 拖拉过程只触发以上这些拖拉事件，尽管鼠标在移动，但是鼠标事件不会触发。
- 将文件从操作系统拖拉进浏览器，不会触发`dragstart`和`dragend`事件。

---

- `dragenter`和`dragover`事件的监听函数，用来取出拖拉的数据（即允许放下被拖拉的元素）。由于网页的大部分区域不适合作为放下拖拉元素的目标节点，所以这两个事件的默认设置为当前节点不允许接受被拖拉的元素。如果想要在目标节点上放下的数据，首先必须阻止这两个事件的默认行为。

---

```javascript
<div ondragover="return false">
<div ondragover="event.preventDefault()">
```

上面代码中，如果不取消拖拉事件或者阻止默认行为，就不能在 div 节点上放下被拖拉的节点。

#### 7.13.DragEvent 接口

拖拉事件都继承了`DragEvent`接口，这个接口又继承了`MouseEvent`接口和`Event`接口。

浏览器原生提供一个`DragEvent()`构造函数，用来生成拖拉事件的实例对象。

`new DragEvent(type, options)`

`DragEvent()`构造函数接受两个参数，第一个参数是字符串，表示事件的类型，该参数必须；第二个参数是事件的配置对象，用来设置事件的属性，该参数可选。配置对象除了接受`MouseEvent`接口和`Event`接口的配置属性，还可以设置`dataTransfer`属性要么是`null`，要么是一个`DataTransfer`接口的实例。

`DataTransfer`的实例对象用来读写拖拉事件中传输的数据。

#### 7.14.DataTransfer 接口

##### 7.14.1 概述

所有拖拉事件的实例都有一个`DragEvent.dataTransfer`属性，用来读写需要传递的数据。这个属性的值是一个`DataTransfer`接口的实例。

浏览器原生提供一个`DataTransfer()`构造函数，用来生成`DataTransfer`实例对象。

`var dataTrans = new DataTransfer();`

`DataTransfer()`构造函数不接受参数。

拖拉的数据分成两方面：数据的种类（又称格式）和数据的值。数据的种类是一个 MIME 字符串（比如`text/plain`、`image/jpeg`），数据的值是一个字符串。一般来说，如果拖拉一段文本，则数据默认就是那段文本；如果拖拉一个链接，则数据默认就是链接的 URL。

拖拉事件开始时，开发者可以提供数据类型和数据值。拖拉过程中，开发者通过`dragenter`和`dragover`事件的监听函数，检查数据类型，以确定是否允许放下（drop）被拖拉的对象。比如，在只允许放下链接的区域，检查拖拉的数据类型是否为`text/uri-list`。

发生 drop 事件时，监听函数取出拖拉的数据，对其进行处理。

##### 7.14.2 DataTransfer 的实例属性

`DataTransfer`实例对象有以下属性。

1).DataTransfer.dropEffect

`DataTransfer.dropEffect`属性用来设置放下（drop）被拖拉节点时的效果，会影响到拖拉经过相关区域时鼠标的形状。它可能取下面的值。

---

- `copy`：复制被拖拉的节点
- `move`：移动被拖拉的节点
- `link`：创建指向被拖拉的节点的链接
- `none`：无法放下被拖拉的节点

---

除了上面这些值，设置其他的值都是无效的。

```javascript
target.addEventListener("dragover", function(e) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = "copy";
});
```

上面代码中，被拖拉元素一旦 drop，接受的区域会复制该节点。

`dropEffect`属性一般在`dragenter`和`dragover`事件的监听函数中设置，对于`dragstart`、`drag`、`dragleave`这三个事件，该属性不起作用。因为该属性只对接受被拖拉的节点的区域有效，对被拖拉的节点本身是无效的。进入目标区域后，拖拉行为会初始化成设定的效果。

2).DataTransfer.effectAllowed

`DataTransfer.effectAllowed`属性设置本次拖拉中允许的效果。它可能取下面的值。

---

- `copy`：复制被拖拉的节点
- `move`：移动被拖拉的节点
- `link`：创建指向被拖拉节点的链接

---

- `copyLink`：允许`copy`或`link`
- `copyMove`：允许`copy`或`move`
- `linkMove`：允许`link`或`move`

---

- `all`：允许所有效果
- `none`：无法放下被拖拉的节点
- `uninitialized`：默认值，等同于 all

---

如果某种效果是不允许的，用户就无法在目标节点中达成这种效果。

这个属性与`dropEffect`属性是同一件事的两个方面。前者设置被拖拉的节点允许的效果，后者设置接受拖拉的区域的效果，它们往往配合使用。

`dragstart`事件的监听函数，可以用来设置这个属性。其他事件的监听函数里面设置这个属性是无效的。

```javascript
source.addEventListener("dragstart", function(e) {
  e.dataTransfer.effectAllowed = "move";
});

target.addEventListener("dragover", function(e) {
  ev.dataTransfer.dropEffect = "move";
});
```

只要`dropEffect`属性和`effectAllowed`属性之中，有一个为`none`，就无法在目标节点上完成 drop 操作。

3).DataTransfer.files

`DataTransfer.files`属性是一个 `FileList` 对象，包含一组本地文件，可以用来在拖拉操作中传送。如果本次拖拉不涉及文件，则该属性为空的 `FileList` 对象。

下面就是一个接收拖拉文件的例子。

```javascript
// HTML 代码如下
// <div id="output" style="min-height: 200px;border: 1px solid black;">
//   文件拖拉到这里
// </div>

var div = document.getElementById("output");

div.addEventListener(
  "dragenter",
  function(event) {
    div.textContent = "";
    event.stopPropagation();
    event.preventDefault();
  },
  false
);

div.addEventListener(
  "dragover",
  function(event) {
    event.stopPropagation();
    event.preventDefault();
  },
  false
);

div.addEventListener(
  "drop",
  function(event) {
    event.stopPropagation();
    event.preventDefault();
    var files = event.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
      div.textContent += files[i].name + " " + files[i].size + "字节\n";
    }
  },
  false
);
```

上面代码中，通过`dataTransfer.files`属性读取被拖拉的文件的信息。如果想要读取文件内容，就要使用`FileReader`对象。

```javascript
div.addEventListener("drop", function(e) {
  e.preventDefault();
  e.stopPropagation();

  var fileList = e.dataTransfer.files;
  if (fileList.length > 0) {
    var file = fileList[0];
    var reader = new FileReader();
    reader.onloadend = function(e) {
      if (e.target.readyState === FileReader.DONE) {
        var content = reader.result;
        div.innerHTML = "File: " + file.name + "\n\n" + content;
      }
    };
    reader.readAsBinaryString(file);
  }
});
```

4).DataTransfer.types

`DataTransfer.types`属性是一个只读的数组，每个成员是一个字符串，里面是拖拉的数据格式（通常是 MIME 值）。比如，如果拖拉的是文字，对应的成员就是`text/plain`。

下面是一个例子，通过检查`dataTransfer`属性的类型，决定是否允许在当前节点执行 drop 操作。

```javascript
function contains(list, value) {
  for (var i = 0; i < list.length; ++i) {
    if (list[i] === value) return true;
  }
  return false;
}

function doDragOver(event) {
  var isLink = contains(event.dataTransfer.types, "text/uri-list");
  if (isLink) event.preventDefault();
}
```

上面代码中，只有当被拖拉的节点是一个链接时，才允许在当前节点放下。

5).DataTransfer.items

`DataTransfer.items`属性返回一个类似数组的只读对象（`DataTransferItemList` 实例），每个成员就是本次拖拉的一个对象（`DataTransferItem` 实例）。如果本次拖拉不包含对象，则返回一个空对象。

`DataTransferItemList` 实例具有以下的属性和方法。

---

- `length`：返回成员的数量
- `add(data, type)`：增加一个指定内容和类型（比如`text/html`和`text/plain`）的字符串作为成员
- `add(file)`：增加一个文件作为成员
- `remove(index)`：移除指定位置的成员
- `clear()`：移除所有的成员

---

`DataTransferItem` 实例具有以下的属性和方法。

---

- `kind`：返回成员的种类（string 还是 file）
- `type`：返回成员的类型（通常是 MIME 值）
- `getAsFile()`：如果被拖拉是文件，返回该文件，否则返回`null`
- `getAsString(callback)`：如果被拖拉的是字符串，将该字符传入指定的回调函数处理

##### 7.14.3 DataTransfer 的实例方法

`DataTransfer`对象有以下方法。

1).setData()

`setData`方法用来设置事件所带有的指定类型的数据。它接受两个参数，第一个是数据类型，第二个是具体数据。如果指定的类型在现有数据中不存在，则该类型将写入`types`属性；如果已经存在，在该类型的现有数据将被替换。

`event.dataTransfer.setData("text/plain", "Text to drag");`

上面代码为事件加入纯文本格式的数据。

如果拖拉文本框或者拖拉选中的文本，会默认将文本数据添加到`dataTransfer`属性，不用手动指定。

```javascript
<div
  draggable="true"
  ondragstart="
  event.dataTransfer.setData('text/plain', 'bbb')"
>
  aaa
</div>
```

上面代码中，拖拉数据实际上是 bbb，而不是 aaa。

下面是添加其他类型的数据。由于`text/plain`是最普遍支持的格式，为了保证兼容性，建议最后总是将数据保存一份纯文本的格式。

```javascript
var dt = event.dataTransfer;

// 添加链接
dt.setData("text/uri-list", "http://www.example.com");
dt.setData("text/plain", "http://www.example.com");
// 添加HTML代码
dt.setData("text/html", "Hello there, <strong>stranger</strong>");
dt.setData("text/plain", "Hello there, <strong>stranger</strong>");
// 添加图像的URL
dt.setData("text/uri-list", imageurl);
dt.setData("text/plain", imageurl);
```

可以一次提供多种格式的数据。

```javascript
var dt = event.dataTransfer;
dt.setData("application/x-bookmark", bookmarkString);
dt.setData("text/uri-list", "http://www.example.com");
dt.setData("text/plain", "http://www.example.com");
```

上面代码中，通过在同一个事件上面，存放三种类型的数据，使得拖拉事件可以在不同的对象上面，drop 不同的值。注意，第一种格式是一个自定义格式，浏览器默认无法读取，这意味着，只有某个部署了特定代码的节点，才可能 drop（读取到）这个数据。

2).getData()

`getData`方法接受一个字符串（表示数据类型）作为参数，返回事件所带的指定类型的数据（通常是用`setData`方法添加的数据）。如果指定类型的数据不存在，则返回空字符串。通常只有`drop`事件触发后，才能取出数据。如果取出另一个域名存放的数据，将会报错。

下面是一个`drop`事件的监听函数，用来取出指定类型的数据。

```javascript
function onDrop(event) {
  var data = event.dataTransfer.getData("text/plain");
  event.target.textContent = data;
  event.preventDefault();
}
```

上面代码取出拖拉事件的文本数据，将其替换成当前节点的文本内容。注意，这时还必须取消浏览器的默认行为，因为假如用户拖拉的是一个链接，浏览器默认会在当前窗口打开这个链接。

`getData`方法返回的是一个字符串，如果其中包含多项数据，就必须手动解析。

```javascript
function doDrop(event) {
  var lines = event.dataTransfer.getData("text/uri-list").split("\n");
  for (let line of lines) {
    let link = document.createElement("a");
    link.href = line;
    link.textContent = line;
    event.target.appendChild(link);
  }
  event.preventDefault();
}
```

上面代码中，`getData`方法返回的是一组链接，就必须自行解析。

类型值指定为 URL，可以取出第一个有效链接。

`var link = event.dataTransfer.getData("URL");`

下面是一次性取出多种类型的数据。

```javascript
function doDrop(event){
  var types = event.dataTransfer.types;
  var supportedTypes = ["text/uri-list", "text/plain"];
  types = supportedTypes.filter(function (value) types.includes(value));
  if (types.length)
    var data = event.dataTransfer.getData(types[0]);
  event.preventDefault();
}
```

3).clearData()

`clearData`方法接受一个字符串（表示数据类型）作为参数，删除事件所带的指定类型的数据。如果没有指定类型，则删除所有数据。如果指定类型不存在，则原数据不受影响。

`event.dataTransfer.clearData("text/uri-list");`

上面代码清除事件所带的 URL 数据。

4).setDragImage()

拖动过程中（`dragstart`事件触发后），浏览器会显示一张图片跟随鼠标一起移动，表示被拖动的节点。这张图片是自动创造的，通常显示为被拖动节点的外观，不需要自己动手设置。`setDragImage`方法可以用来自定义这张图片，它接受三个参数，第一个是`img`图片元素或者`canvas`元素，如果省略或为`null`则使用被拖动的节点的外观，第二个和第三个参数为鼠标相对于该图片左上角的横坐标和右坐标。

下面是一个例子。

```javascript
// HTML代码为
// <div id="drag-with-image" class="dragdemo" draggable="true">
     drag me
// </div>

var div = document.getElementById("drag-with-image");
div.addEventListener("dragstart", function(e) {
  var img = document.createElement("img");
  img.src = "http://path/to/img";
  e.dataTransfer.setDragImage(img, 0, 0);
}, false);
```

#### 7.15.触摸操作概述

浏览器的触摸 API 由三个部分组成。

---

- `Touch`：一个触摸点
- `TouchList`：多个触摸点的集合
- `TouchEvent`：触摸引发的事件实例

---

`Touch`接口的实例对象用来触摸点（一根手指或者一根触摸笔），包括位置、大小、形状、压力、目标元素等属性。有时，触摸动作由多个触摸点（多根手指）组成，多个触摸点的集合由`TouchList`接口的实例对象表示。`TouchEvent`接口的实例对象代表由触摸引发的事件，只有触摸屏才会引发这一类事件。

很多时候，触摸事件和鼠标事件同时触发，即使这个时候并没有用到鼠标。这是为了让那些只定义鼠标事件、没有定义触摸事件的代码，在触摸屏的情况下仍然能用。如果想避免这种情况，可以用`event.preventDefault`方法阻止发出鼠标事件。

#### 7.16.Touch 接口

##### 7.16.1 Touch 接口概述

`Touch` 接口代表单个触摸点。触摸点可能是一根手指，也可能是一根触摸笔。

浏览器原生提供`Touch`构造函数，用来生成`Touch`实例。

`var touch = new Touch(touchOptions);`

`Touch`构造函数接受一个配置对象作为参数，它有以下属性。

---

- `identifier`：必需，类型为整数，表示触摸点的唯一 ID。
- `target`：必需，类型为元素节点，表示触摸点开始时所在的网页元素。

---

- `clientX`：可选，类型为数值，表示触摸点相对于浏览器窗口左上角的水平距离，默认为 0。
- `clientY`：可选，类型为数值，表示触摸点相对于浏览器窗口左上角的垂直距离，默认为 0。

---

- `screenX`：可选，类型为数值，表示触摸点相对于屏幕左上角的水平距离，默认为 0。
- `screenY`：可选，类型为数值，表示触摸点相对于屏幕左上角的垂直距离，默认为 0。

---

- `pageX`：可选，类型为数值，表示触摸点相对于网页左上角的水平位置（即包括页面的滚动距离），默认为 0。
- `pageY`：可选，类型为数值，表示触摸点相对于网页左上角的垂直位置（即包括页面的滚动距离），默认为 0。

---

- `radiusX`：可选，类型为数值，表示触摸点周围受到影响的椭圆范围的 X 轴半径，默认为 0。
- `radiusY`：可选：类型为数值，表示触摸点周围受到影响的椭圆范围的 Y 轴半径，默认为 0。

---

- `rotationAngle`：可选，类型为数值，表示触摸区域的椭圆的旋转角度，单位为度数，在 0 到 90 度之间，默认值为 0。

---

- `force`：可选，类型为数值，范围在 0 到 1 之间，表示触摸压力。0 代表没有压力，1 代表硬件所能识别的最大压力，默认为 0。

---

##### 7.16.2 Touch 接口的实例属性

1).Touch.identifier

`Touch.identifier`属性返回一个整数，表示触摸点的唯一 ID。这个值在整个触摸过程保持不变，直到触摸事件结束。

```javascript
someElement.addEventListener(
  "touchmove",
  function(e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      console.log(e.changedTouches[i].identifier);
    }
  },
  false
);
```

2).Touch.screenX，Touch.screenY，Touch.clientX，Touch.clientY，pageX，pageY

`Touch.screenX`属性和`Touch.screenY`属性，分别表示触摸点相对于屏幕左上角的横坐标和纵坐标，与页面是否滚动无关。

`Touch.clientX`属性和`Touch.clientY`属性，分别表示触摸点相对于浏览器视口左上角的横坐标和纵坐标，与页面是否滚动无关。

`Touch.pageX`属性和`Touch.pageY`属性，分别表示触摸点相对于当前页面左上角的横坐标和纵坐标，包含了页面滚动带来的位移。

3).Touch.radiusX，Touch.radiusY，Touch.rotationAngle

`Touch.radiusX`属性和`Touch.radiusY`属性，分别返回触摸点周围受到影响的椭圆范围的 X 轴半径和 Y 轴半径，单位为像素。乘以 2 就可以得到触摸范围的宽度和高度。

`Touch.rotationAngle`属性表示触摸区域的椭圆的旋转角度，单位为度数，在 0 到 90 度之间。

上面这三个属性共同定义了用户与屏幕接触的区域，对于描述手指这一类非精确的触摸，很有帮助。指尖接触屏幕，触摸范围会形成一个椭圆，这三个属性就用来描述这个椭圆区域。

下面是一个示例。

```javascript
div.addEventListener("touchstart", rotate);
div.addEventListener("touchmove", rotate);
div.addEventListener("touchend", rotate);

function rotate(e) {
  var touch = e.changedTouches.item(0);
  e.preventDefault();

  src.style.width = touch.radiusX * 2 + "px";
  src.style.height = touch.radiusY * 2 + "px";
  src.style.transform = "rotate(" + touch.rotationAngle + "deg)";
}
```

4).Touch.force

`Touch.force`属性返回一个 0 到 1 之间的数值，表示触摸压力。0 代表没有压力，1 代表硬件所能识别的最大压力。

5).Touch.target

`Touch.target`属性返回一个元素节点，代表触摸发生时所在的那个元素节点。即使触摸点已经离开了这个节点，该属性依然不变。

#### 7.17. TouchList 接口

`TouchList`接口表示一组触摸点的集合。它的实例是一个类似数组的对象，成员是`Touch`的实例对象，表示所有触摸点。用户用三根手指触摸，产生的`TouchList`实例就会包含三个成员，每根手指的触摸点对应一个`Touch`实例对象。

它的实例主要通过触摸事件的`TouchEvent.touches`、`TouchEvent.changedTouches`、`TouchEvent.targetTouches`这几个属性获取。

它的实例属性和实例方法只有两个。

---

- `TouchList.length`：数值，表示成员数量（即触摸点的数量）。
- `TouchList.item()`：返回指定位置的成员，它的参数是该成员的位置编号（从零开始）。

---

#### 7.18.TouchEvent 接口

##### 7.18.1 概述

`TouchEvent` 接口继承了 `Event` 接口，表示由触摸引发的事件实例，通常来自触摸屏或轨迹板。除了被继承的属性以外，它还有一些自己的属性。

浏览器原生提供`TouchEvent()`构造函数，用来生成触摸事件的实例。

`new TouchEvent(type, options)`

`TouchEvent()`构造函数可以接受两个参数，第一个参数是字符串，表示事件类型；第二个参数是事件的配置对象，该参数是可选的，对象的所有属性也是可选的。除了`Event`接口的配置属性，该接口还有一些自己的配置属性。

---

- `touches`：`TouchList`实例，代表所有的当前处于活跃状态的触摸点，默认值是一个空数组`[]`。
- `targetTouches`：`TouchList`实例，代表所有处在触摸的目标元素节点内部、且仍然处于活动状态的触摸点，默认值是一个空数组`[]`。
- `changedTouches`：`TouchList`实例，代表本次触摸事件的相关触摸点，默认值是一个空数组`[]`。

---

- `ctrlKey`：布尔值，表示 Ctrl 键是否同时按下，默认值为 false。
- `shiftKey`：布尔值，表示 Shift 键是否同时按下，默认值为 false。
- `altKey`：布尔值，表示 Alt 键是否同时按下，默认值为 false。
- `metaKey`：布尔值，表示 Meta 键（或 Windows 键）是否同时按下，默认值为 false。

---

##### 7.18.2 实例属性

`TouchEvent` 接口的实例具有`Event`实例的所有属性和方法，此外还有一些它自己的实例属性，这些属性全部都是只读。

1).TouchEvent.altKey，TouchEvent.ctrlKey，TouchEvent.shiftKey，TouchEvent.metaKey

---

- `TouchEvent.altKey`：布尔值，表示触摸时是否按下了 Alt 键。
- `TouchEvent.ctrlKey`：布尔值，表示触摸时是否按下了 Ctrl 键。
- `TouchEvent.shiftKey`：布尔值：表示触摸时是否按下了 Shift 键。
- `TouchEvent.metaKey`：布尔值，表示触摸时是否按下了 Meta 键（或 Windows 键）。

---

下面是一个示例。

```javascript
someElement.addEventListener(
  "touchstart",
  function(e) {
    console.log("altKey = " + e.altKey);
    console.log("ctrlKey = " + e.ctrlKey);
    console.log("metaKey = " + e.metaKey);
    console.log("shiftKey = " + e.shiftKey);
  },
  false
);
```

2).TouchEvent.changedTouches

`TouchEvent.changedTouches`属性返回一个`TouchList`实例，成员是一组`Touch`实例对象，表示本次触摸事件的相关触摸点。

对于不同的时间，该属性的含义有所不同。

---

- `touchstart`事件：被激活的触摸点
- `touchmove`事件：发生变化的触摸点
- `touchend`事件：消失的触摸点（即不再被触碰的点）

---

下面是一个示例。

```javascript
someElement.addEventListener(
  "touchmove",
  function(e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      console.log(e.changedTouches[i].identifier);
    }
  },
  false
);
```

3).TouchEvent.touches

`TouchEvent.touches`属性返回一个`TouchList`实例，成员是所有仍然处于活动状态（即触摸中）的触摸点。一般来说，一个手指就是一个触摸点。

下面是一个示例。

```javascript
someElement.addEventListener(
  "touchstart",
  function(e) {
    switch (e.touches.length) {
      // 一根手指触摸
      case 1:
        handle_one_touch(e);
        break;
      // 两根手指触摸
      case 2:
        handle_two_touches(e);
        break;
      // 三根手指触摸
      case 3:
        handle_three_touches(e);
        break;
      // 其他情况
      default:
        console.log("Not supported");
        break;
    }
  },
  false
);
```

4).TouchEvent.targetTouches

`TouchEvent.targetTouches`属性返回一个`TouchList`实例，成员是触摸事件的目标元素节点内部、所有仍然处于活动状态（即触摸中）的触摸点。

```javascript
function touches_in_target(ev) {
  return ev.touches.length === ev.targetTouches.length ? true : false;
}
```

上面代码用来判断，是否所有触摸点都在目标元素内。

#### 7.19.触摸事件的种类

触摸引发的事件，有以下几种。可以通过`TouchEvent.type`属性，查看到底发生的是哪一种事件。

---

- `touchstart`：用户开始触摸时触发，它的`target`属性返回发生触摸的元素节点。

---

- `touchend`：用户不再接触触摸屏时（或者移出屏幕边缘时）触发，它的`target`属性与`touchstart`事件一致的，就是开始触摸时所在的元素节点。它的`changedTouches`属性返回一个`TouchList`实例，包含所有不再触摸的触摸点（即`Touch`实例对象）。

---

- `touchmove`：用户移动触摸点时触发，它的`target`属性与`touchstart`事件一致。如果触摸的半径、角度、力度发生变化，也会触发该事件。

---

- `touchcancel`：触摸点取消时触发，比如在触摸区域跳出一个情态窗口（modal window）、触摸点离开了文档区域（进入浏览器菜单栏）、用户的触摸点太多，超过了支持的上限（自动取消早先的触摸点）。

---

下面是一个例子。

```javascript
var el = document.getElementsByTagName("canvas")[0];
el.addEventListener("touchstart", handleStart, false);
el.addEventListener("touchmove", handleMove, false);

function handleStart(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    console.log(touches[i].pageX, touches[i].pageY);
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    console.log(touch.pageX, touch.pageY);
  }
}
```

#### 7.20.表单事件

##### 7.20.1 Input 事件，select 事件，change 事件

以下事件与表单成员的值变化有关。

1).input 事件

`input`事件当`<input>`、`<textarea>`的值发生变化时触发。此外，打开`contenteditable`属性的元素，只要值发生变化，也会触发`input`事件。

`input`事件的一个特点，就是会连续触发，比如用户每次按下一次按键，就会触发一次`input`事件。

2).select 事件

`select`事件当在`<input>`、`<textarea>`中选中文本时触发。

```javascript
// HTML代码为
// <input id="test" type="text" value="Select me!" />

var elem = document.getElementById("test");
elem.addEventListener(
  "select",
  function() {
    console.log("Selection changed!");
  },
  false
);
```

3).Change 事件

`Change`事件当`<input>`、`<select>`、`<textarea>`的值发生变化时触发。它与`input`事件的最大不同，就是不会连续触发，只有当全部修改完成时才会触发，而且`input`事件必然会引发`change`事件。具体来说，分成以下几种情况。

---

- 激活单选框（radio）或复选框（checkbox）时触发。
- 用户提交时触发。比如，从下拉列表（select）完成选择，在日期或文件输入框完成选择。
- 当文本框或 textarea 元素的值发生改变，并且丧失焦点时触发。

---

下面是一个例子。

```javascript
// HTML代码为
// <select size="1" onchange="changeEventHandler(event);">
//   <option>chocolate</option>
//   <option>strawberry</option>
//   <option>vanilla</option>
// </select>

function changeEventHandler(event) {
  console.log("You like " + event.target.value + " ice cream.");
}
```

##### 7.20.2 reset 事件，submit 事件

以下事件发生在表单对象上，而不是发生在表单的成员上。

1).reset 事件

`reset`事件当表单重置（所有表单成员变回默认值）时触发。

2).submit 事件

`submit`事件当表单数据向服务器提交时触发。注意，`submit`事件的发生对象是`form`元素，而不是`button`元素（即使它的类型是`submit`），因为提交的是表单，而不是按钮。

#### 7.21.文档事件

##### 7.21.1 beforeunload 事件，unload 事件，load 事件，error 事件，pageshow 事件，pagehide 事件

以下事件与网页的加载与卸载相关。

1).beforeunload 事件

`beforeunload`事件在窗口将要关闭，或者网页（即`document`对象）将要卸载时触发。它可以用来防止用户不小心关闭网页。

根据标准，只要在该事件的回调函数中，调用了`event.preventDefault()`，或者`event.returnValue`属性的值是一个非空的值，就会自动跳出一个确认框，让用户确认是否关闭网页。如果用户点击“取消”按钮，网页就不会关闭。`event.returnValue`属性的值，会显示在确认对话框之中。

```javascript
window.addEventListener("beforeunload", function(event) {
  event.returnValue = "你确认要离开吗？";
});

window.addEventListener("beforeunload", function(event) {
  event.preventDefault();
});
```

但是，浏览器的行为很不一致，Chrome 就不遵守`event.preventDefault()`，还是会关闭窗口，而 IE 需要显式返回一个非空的字符串。而且，大多数浏览器在对话框中不显示指定文本，只显示默认文本。因此，可以采用下面的写法，取得最大的兼容性。

```javascript
window.addEventListener("beforeunload", function(e) {
  var confirmationMessage = "确认关闭窗口？";

  e.returnValue = confirmationMessage;
  return confirmationMessage;
});
```

需要特别注意的是，许多手机浏览器默认忽视这个事件，而桌面浏览器也可以这样设置，所以这个事件有可能根本不生效。所以，不能依赖它来阻止用户关闭窗口。

2).unload 事件

`unload`事件在窗口关闭或者`document`对象将要卸载时触发，发生在`window`、`body`、`frameset`等对象上面。它的触发顺序排在`beforeunload`、`pagehide`事件后面。`unload`事件只在页面没有被浏览器缓存时才会触发，换言之，如果通过按下“前进/后退”导致页面卸载，并不会触发`unload`事件。

当`unload`事件发生时，`document`对象处于一个特殊状态。所有资源依然存在，但是对用户来说都不可见，UI 互动（`window.open`、`alert`、`confirm`方法等）全部无效。这时即使抛出错误，也不能停止文档的卸载。

```javascript
window.addEventListener("unload", function(event) {
  console.log("文档将要卸载");
});
```

如果在`window`对象上定义了该事件，网页就不会被浏览器缓存。

3).load 事件，error 事件

`load`事件在页面加载成功时触发，`error`事件在页面加载失败时触发。注意，页面从浏览器缓存加载，并不会触发`load`事件。

这两个事件实际上属于进度事件，不仅发生在`document`对象，还发生在各种外部资源上面。浏览网页就是一个加载各种资源的过程，图像（image）、样式表（style sheet）、脚本（script）、视频（video）、音频（audio）、Ajax 请求（XMLHttpRequest）等等。这些资源和`document`对象、`window`对象、`XMLHttpRequestUpload`对象，都会触发`load`事件和`error`事件。

4).pageshow 事件，pagehide 事件

默认情况下，浏览器会在**当前会话（session）**缓存页面，当用户点击“前进/后退”按钮时，浏览器就会从缓存中加载页面。

`pageshow`事件在页面加载时触发，包括第一次加载和从缓存加载两种情况。如果要指定页面每次加载（不管是不是从浏览器缓存）时都运行的代码，可以放在这个事件的监听函数。

第一次加载时，它的触发顺序排在`load`事件后面。从缓存加载时，`load`事件不会触发，因为网页在缓存中的样子通常是`load`事件的监听函数运行后的样子，所以不必重复执行。同理，如果是从缓存中加载页面，网页内初始化的 JavaScript 脚本（比如`DOMContentLoaded`事件的监听函数）也不会执行。

```javascript
window.addEventListener("pageshow", function(event) {
  console.log("pageshow: ", event);
});
```

`pageshow`事件有一个`persisted`属性，返回一个布尔值。页面第一次加载时，这个属性是 false；当页面从缓存加载时，这个属性是 true。

```javascript
window.addEventListener("pageshow", function(event) {
  if (event.persisted) {
    // ...
  }
});
```

`pagehide`事件与`pageshow`事件类似，当用户通过“前进/后退”按钮，离开当前页面时触发。它与`unload`事件的区别在于，如果在`window`对象上定义`unload`事件的监听函数之后，页面不会保存在缓存中，而使用`pagehide`事件，页面会保存在缓存中。

`pagehide`事件的`event`对象有一个`persisted`属性，将这个属性设为 true，就表示页面要保存在缓存中；设为 false，表示网页不保存在缓存中，这时如果设置了`unload`事件的监听函数，该函数将在`pagehide`事件后立即运行。

如果页面包含`frame`或`iframe`元素，则`frame`页面的`pageshow`事件和`pagehide`事件，都会在主页面之前触发。

##### 7.21.2 DOMContentLoaded 事件，readystatechange 事件

以下事件与文档状态相关。

1).DOMContentLoaded 事件

当 HTML 文档下载并解析完成以后，就会在`document`对象上触发`DOMContentLoaded`事件。这时，仅仅完成了 HTML 文档的解析（整张页面的 DOM 生成），所有外部资源（样式表、脚本、`iframe`等等）可能还没有下载结束。也就是说，这个事件比`load`事件，发生时间早得多。

```javascript
document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM生成");
});
```

注意，网页的 JavaScript 脚本是同步执行的，所以定义`DOMContentLoaded`事件的监听函数，应该放在所有脚本的最前面。否则脚本一旦发生堵塞，将推迟触发`DOMContentLoaded`事件。

2).readystatechange 事件

`readystatechange`事件发生在`Document`对象和`XMLHttpRequest`对象，当它们的`readyState`属性发生变化时触发。

```javascript
document.onreadystatechange = function() {
  if (document.readyState == "interactive") {
    // ...
  }
};
```

> IE8 不支持`DOMContentLoaded`事件，但是支持这个事件。因此，可以使用`readystatechange`事件，在低版本的 IE 中代替`DOMContentLoaded`事件。

##### 7.21.3 scroll 事件，resize 事件

以下事件与窗口行为有关。

1).scroll 事件

`scroll`事件在文档或文档元素滚动时触发，主要出现在用户拖动滚动条。

`window.addEventListener('scroll', callback);`

由于该事件会连续地大量触发，所以它的监听函数之中不应该有非常耗费计算的操作。推荐的做法是使用`requestAnimationFrame`或`setTimeout`控制该事件的触发频率，然后可以结合`customEvent`抛出一个新事件。

```javascript
(function() {
  var throttle = function(type, name, obj) {
    var obj = obj || window;
    var running = false;
    var func = function() {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  // 将scroll事件重定义为optimizedScroll事件
  throttle("scroll", "optimizedScroll");
})();

window.addEventListener("optimizedScroll", function() {
  console.log("Resource conscious scroll callback!");
});
```

上面代码中，throttle 函数用于控制事件触发频率，`requestAnimationFrame`方法保证每次页面重绘（每秒 60 次），只会触发一次`scroll`事件的监听函数。也就是说，上面方法将`scroll`事件的触发频率，限制在每秒 60 次。

改用`setTimeout`方法，可以放置更大的时间间隔。

```javascript
(function() {
  window.addEventListener("scroll", scrollThrottler, false);

  var scrollTimeout;
  function scrollThrottler() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        scrollTimeout = null;
        actualScrollHandler();
      }, 66);
    }
  }

  function actualScrollHandler() {
    // ...
  }
})();
```

上面代码中，`setTimeout`指定`scroll`事件的监听函数，每 66 毫秒触发一次（每秒 15 次）。

下面是一个更一般的 throttle 函数的写法。

```javascript
function throttle(fn, wait) {
  var time = Date.now();
  return function() {
    if (time + wait - Date.now() < 0) {
      fn();
      time = Date.now();
    }
  };
}

window.addEventListener("scroll", throttle(callback, 1000));
```

上面的代码将`scroll`事件的触发频率，限制在一秒一次。

`lodash`函数库提供了现成的 throttle 函数，可以直接引用。

`window.addEventListener('scroll', _.throttle(callback, 1000));`

2).resize 事件

`resize`事件在改变浏览器窗口大小时触发，发生在`window`、`body`、`frameset`对象上面。

```javascript
var resizeMethod = function() {
  if (document.body.clientWidth < 768) {
    console.log("移动设备");
  }
};

window.addEventListener("resize", resizeMethod, true);
```

该事件也会连续地大量触发，所以最好像上面的`scroll`事件一样，通过 throttle 函数控制事件触发频率。

##### 7.21.4 hashchange 事件，popstate 事件

以下事件与文档的 URL 变化相关。

1).hashchange 事件

`hashchange`事件在 URL 的`hash`部分（即`#`号后面的部分，包括`#`号）发生变化时触发。如果老式浏览器不支持该属性，可以通过定期检查`location.hash`属性，模拟该事件，下面就是代码。

```javascript
(function(window) {
  if ("onhashchange" in window.document.body) {
    return;
  }

  var location = window.location;
  var oldURL = location.href;
  var oldHash = location.hash;

  // 每隔100毫秒检查一下URL的hash
  setInterval(function() {
    var newURL = location.href;
    var newHash = location.hash;

    if (newHash != oldHash && typeof window.onhashchange === "function") {
      window.onhashchange({
        type: "hashchange",
        oldURL: oldURL,
        newURL: newURL
      });

      oldURL = newURL;
      oldHash = newHash;
    }
  }, 100);
})(window);
```

`hashchange`事件对象除了继承`Event`对象，还有`oldURL`属性和`newURL`属性，分别表示变化前后的 URL。

2).popstate 事件

`popstate`事件在浏览器的`history`对象的当前记录发生显式切换时触发。注意，调用`history.pushState()`或`history.replaceState()`，并不会触发`popstate`事件。该事件只在用户在`history`记录之间显式切换时触发，比如鼠标点击“后退/前进”按钮，或者在脚本中调用`history.back()`、`history.forward()`、`history.go()`时触发。

该事件对象有一个`state`属性，保存`history.pushState`方法和`history.replaceState`方法为当前记录添加的`state`对象。

```javascript
window.onpopstate = function(event) {
  console.log("state: " + event.state);
};
history.pushState({ page: 1 }, "title 1", "?page=1");
history.pushState({ page: 2 }, "title 2", "?page=2");
history.replaceState({ page: 3 }, "title 3", "?page=3");
history.back(); // state: {"page":1}
history.back(); // state: null
history.go(2); // state: {"page":3}
```

上面代码中，`pushState`方法向`history`添加了两条记录，然后`replaceState`方法替换掉当前记录。因此，连续两次 back 方法，会让当前条目退回到原始网址，它没有附带`state`对象，所以事件的`state`属性为`null`，然后前进两条记录，又回到`replaceState`方法添加的记录。

> 浏览器对于页面首次加载，是否触发`popstate`事件，处理不一样，Firefox 不触发该事件。

##### 7.21.5 cut 事件，copy 事件，paste 事件

以下三个事件属于文本操作触发的事件。

---

- `cut`事件：在将选中的内容从文档中移除，加入剪贴板后触发。
- `copy`事件：在选中的内容加入剪贴板后触发。
- `paste`事件：在剪贴板内容被粘贴到文档后触发。

---

这三个事件都有一个`clipboardData`只读属性。该属性存放剪贴的数据，是一个`DataTransfer`对象。

##### 7.21.6 焦点事件

焦点事件发生在`Element`节点和`document`对象上面，与获得或失去焦点相关。它主要包括以下四个事件。

---

- `focus`事件：`Element`节点获得焦点后触发，该事件不会冒泡。
- `blur`事件：`Element`节点失去焦点后触发，该事件不会冒泡。
- `focusin`事件：`Element`节点将要获得焦点时触发，发生在`focus`事件之前。该事件会冒泡。Firefox 不支持该事件。
- `focusout`事件：`Element`节点将要失去焦点时触发，发生在`blur`事件之前。该事件会冒泡。Firefox 不支持该事件。

---

这四个事件的事件对象，带有`target`属性（返回事件的目标节点）和`relatedTarget`属性（返回一个`Element`节点）。对于`focusin`事件，`relatedTarget`属性表示失去焦点的节点；对于`focusout`事件，表示将要接受焦点的节点；对于`focus`和`blur`事件，该属性返回`null`。

由于`focus`和`blur`事件不会冒泡，只能在捕获阶段触发，所以`addEventListener`方法的第三个参数需要设为 true。

```javascript
form.addEventListener(
  "focus",
  function(event) {
    event.target.style.background = "pink";
  },
  true
);
form.addEventListener(
  "blur",
  function(event) {
    event.target.style.background = "";
  },
  true
);
```

上面代码设置表单的文本输入框，在接受焦点时设置背景色，在失去焦点时去除背景色。

浏览器提供一个`FocusEvent`构造函数，可以用它生成焦点事件的实例。

`var focusEvent = new FocusEvent(typeArg, focusEventInit);`

上面代码中，`FocusEvent`构造函数的第一个参数为事件类型，第二个参数是可选的配置对象，用来配置`FocusEvent`对象。

### 8.CSS 操作

CSS 与 JavaScript 是两个有着明确分工的领域，前者负责页面的视觉效果，后者负责与用户的行为互动。但是，它们毕竟同属网页开发的前端，因此不可避免有着交叉和互相配合。

#### 1.HTML 元素的 style 属性

操作 CSS 样式最简单的方法，就是使用网页元素节点的`getAttribute`方法、`setAttribute`方法和`removeAttribute`方法，直接读写或删除网页元素的`style`属性。

```javascript
div.setAttribute("style", "background-color:red;" + "border:1px solid black;");
```

上面的代码相当于下面的 HTML 代码。

`<div style="background-color:red; border:1px solid black;" />`

#### 2.CSSStyleDeclaration 接口

##### 2.1 简介

`CSSStyleDeclaration` 接口用来操作元素的样式。三个地方部署了这个接口。

---

- 元素节点的`style`属性（`Element.style`）
- `CSSStyle`实例的`style`属性
- `window.getComputedStyle()`的返回值

---

`CSSStyleDeclaration` 接口可以直接读写 CSS 的样式属性，不过，连词号需要变成骆驼拼写法。

```javascript
var divStyle = document.querySelector("div").style;

divStyle.backgroundColor = "red";
divStyle.border = "1px solid black";
divStyle.width = "100px";
divStyle.height = "100px";
divStyle.fontSize = "10em";

divStyle.backgroundColor; // red
divStyle.border; // 1px solid black
divStyle.height; // 100px
divStyle.width; // 100px
```

上面代码中，`style`属性的值是一个 `CSSStyleDeclaration` 实例。这个对象所包含的属性与 CSS 规则一一对应，但是名字需要改写，比如`background-color`写成`backgroundColor`。改写的规则是将横杠从 CSS 属性名中去除，然后将横杠后的第一个字母大写。如果 CSS 属性名是 JavaScript 保留字，则规则名之前需要加上字符串 css，比如`float`写成`cssFloat`。

注意，该对象的属性值都是字符串，设置时必须包括单位，但是不含规则结尾的分号。比如，divStyle.width 不能写为 100，而要写为 100px。

另外，`Element.style`返回的只是行内样式，并不是该元素的全部样式。通过样式表设置的样式，或者从父元素继承的样式，无法通过这个属性得到。元素的全部样式要通过`window.getComputedStyle()`得到。

##### 2.2 CSSStyleDeclaration 实例属性

1).CSSStyleDeclaration.cssText

`CSSStyleDeclaration.cssText`属性用来读写当前规则的所有样式声明文本。

```javascript
var divStyle = document.querySelector("div").style;

divStyle.cssText =
  "background-color: red;" +
  "border: 1px solid black;" +
  "height: 100px;" +
  "width: 100px;";
```

> 注意，`cssText`的属性值不用改写 CSS 属性名。

删除一个元素的所有行内样式，最简便的方法就是设置`cssText`为空字符串。

`divStyle.cssText = '';`

2).CSSStyleDeclaration.length

`CSSStyleDeclaration.length`属性返回一个整数值，表示当前规则包含多少条样式声明。

```javascript
// HTML 代码如下
// <div id="myDiv"
//   style="margin: 0 10px; background-color: #CA1; border: 1px solid red;"
// ></div>
var myDiv = document.getElementById("myDiv");
var divStyle = myDiv.style;
divStyles.length; // 3
```

上面代码中，myDiv 元素的行内样式共包含 3 条样式规则。

3).CSSStyleDeclaration.parentRule

`CSSStyleDeclaration.parentRule`属性返回当前规则所属的那个样式块（`CSSRule` 实例）。如果不存在所属的样式块，该属性返回`null`。

该属性只读，且只在使用 `CSSRule` 接口时有意义。

```javascript
var declaration = document.styleSheets[0].rules[0].style;
declaration.parentRule === document.styleSheets[0].rules[0];
// true
```

##### 2.3 CSSStyleDeclaration 实例方法

1).CSSStyleDeclaration.getPropertyPriority()

`CSSStyleDeclaration.getPropertyPriority`方法接受 CSS 样式的属性名作为参数，返回一个字符串，表示有没有设置`important`优先级。如果有就返回`important`，否则返回空字符串。

```javascript
// HTML 代码为
// <div id="myDiv" style="margin: 10px!important; color: red;"/>
var style = document.getElementById("myDiv").style;
style.margin; // "10px"
style.getPropertyPriority("margin"); // "important"
style.getPropertyPriority("color"); // ""
```

上面代码中，`margin`属性有`important`优先级，`color`属性没有。

2).CSSStyleDeclaration.getPropertyValue()

`CSSStyleDeclaration.getPropertyValue`方法接受 CSS 样式属性名作为参数，返回一个字符串，表示该属性的属性值。

```javascript
// HTML 代码为
// <div id="myDiv" style="margin: 10px!important; color: red;"/>
var style = document.getElementById("myDiv").style;
style.margin; // "10px"
style.getPropertyValue("margin"); // "10px"
```

3).CSSStyleDeclaration.item()

`CSSStyleDeclaration.item`方法接受一个整数值作为参数，返回该位置的 CSS 属性名。

```javascript
// HTML 代码为
// <div id="myDiv" style="color: red; background-color: white;"/>
var style = document.getElementById("myDiv").style;
style.item(0); // "color"
style.item(1); // "background-color"
```

上面代码中，0 号位置的 CSS 属性名是`color`，1 号位置的 CSS 属性名是`background-color`。

如果没有提供参数，这个方法会报错。如果参数值超过实际的属性数目，这个方法返回一个空字符值。

4).CSSStyleDeclaration.removeProperty()

`CSSStyleDeclaration.removeProperty`方法接受一个属性名作为参数，在 CSS 规则里面移除这个属性，返回这个属性原来的值。

```javascript
// HTML 代码为
// <div id="myDiv" style="color: red; background-color: white;">
//   111
// </div>
var style = document.getElementById("myDiv").style;
style.removeProperty("color"); // 'red'
// HTML 代码变为
// <div id="myDiv" style="background-color: white;">
```

上面代码中，删除`color`属性以后，字体颜色从红色变成默认颜色。

5).CSSStyleDeclaration.setProperty()

`CSSStyleDeclaration.setProperty`方法用来设置新的 CSS 属性。该方法没有返回值。

该方法可以接受三个参数。

---

- 第一个参数：属性名，该参数是必需的。
- 第二个参数：属性值，该参数可选。如果省略，则参数值默认为空字符串。
- 第三个参数：优先级，该参数可选。如果设置，唯一的合法值是 important，表示 CSS 规则里面的!important。

---

```javascript
// HTML 代码为
// <div id="myDiv" style="color: red; background-color: white;">
//   111
// </div>
var style = document.getElementById("myDiv").style;
style.setProperty("border", "1px solid blue");
```

上面代码执行后，myDiv 元素就会出现蓝色的边框。

#### 3.CSS 模块的侦测

CSS 的规格发展太快，新的模块层出不穷。不同浏览器的不同版本，对 CSS 模块的支持情况都不一样。有时候，需要知道当前浏览器是否支持某个模块，这就叫做“CSS 模块的侦测”。

一个比较普遍适用的方法是，判断元素的 style 对象的某个属性值是否为字符串。

```javascript
typeof element.style.animationName === "string";
typeof element.style.transform === "string";
```

如果该 CSS 属性确实存在，会返回一个字符串。即使该属性实际上并未设置，也会返回一个空字符串。如果该属性不存在，则会返回`undefined`。

```javascript
document.body.style["maxWidth"]; // ""
document.body.style["maximumWidth"]; // undefined
```

上面代码说明，这个浏览器支持`max-width`属性，但是不支持`maximum-width`属性。

注意，不管 CSS 属性名的写法带不带连词线，`style`属性上都能反映出该属性是否存在。

```javascript
document.body.style["backgroundColor"]; // ""
document.body.style["background-color"]; // ""
```

另外，使用的时候，需要把不同浏览器的 CSS 前缀也考虑进去。

```javascript
var content = document.getElementById("content");
typeof content.style["webkitAnimation"] === "string";
```

这种侦测方法可以写成一个函数。

```javascript
function isPropertySupported(property) {
  if (property in document.body.style) return true;
  var prefixes = ["Moz", "Webkit", "O", "ms", "Khtml"];
  var prefProperty = property.charAt(0).toUpperCase() + property.substr(1);

  for (var i = 0; i < prefixes.length; i++) {
    if (prefixes[i] + prefProperty in document.body.style) return true;
  }

  return false;
}

isPropertySupported("background-clip");
// true
```

#### 4.CSS 对象

浏览器原生提供 CSS 对象，为 JavaScript 操作 CSS 提供一些工具方法。

##### 4.1 CSS.escape()

`CSS.escape`方法用于转义 CSS 选择器里面的特殊字符。

`<div id="foo#bar">`

上面代码中，该元素的 id 属性包含一个`#`号，该字符在 CSS 选择器里面有特殊含义。不能直接写成`document.querySelector('#foo#bar')`，只能写成`document.querySelector('#foo\\#bar')`。这里必须使用双斜杠的原因是，单引号字符串本身会转义一次斜杠。

`CSS.escape`方法就用来转义那些特殊字符。

`document.querySelector('#' + CSS.escape('foo#bar'))`

##### 4.2 CSS.supports()

`CSS.supports`方法返回一个布尔值，表示当前环境是否支持某一句 CSS 规则。

它的参数有两种写法，一种是第一个参数是属性名，第二个参数是属性值；另一种是整个参数就是一行完整的 CSS 语句。

```javascript
// 第一种写法
CSS.supports("transform-origin", "5px"); // true

// 第二种写法
CSS.supports("display: table-cell"); // true
```

注意，第二种写法的参数结尾不能带有分号，否则结果不准确。

`CSS.supports('display: table-cell;') // false`

#### 5.window.getComputedStyle()

行内样式（inline style）具有最高的优先级，改变行内样式，通常会立即反映出来。但是，网页元素最终的样式是综合各种规则计算出来的。因此，如果想得到元素实际的样式，只读取行内样式是不够的，需要得到浏览器最终计算出来的样式规则。

`window.getComputedStyle`方法，就用来返回浏览器计算后得到的最终规则。它接受一个节点对象作为参数，返回一个 `CSSStyleDeclaration` 实例，包含了指定节点的最终样式信息。所谓“最终样式信息”，指的是各种 CSS 规则叠加后的结果。

```javascript
var div = document.querySelector("div");
var styleObj = window.getComputedStyle(div);
styleObj.backgroundColor;
```

上面代码中，得到的背景色就是 div 元素真正的背景色。

注意，`CSSStyleDeclaration` 实例是一个活的对象，任何对于样式的修改，会实时反映到这个实例上面。另外，这个实例是只读的。

`getComputedStyle`方法还可以接受第二个参数，表示当前元素的伪元素（比如`:before`、`:after`、`:first-line`、`:first-letter`等）。

`var result = window.getComputedStyle(div, ':before');`

下面的例子是如何获取元素的高度。

```javascript
var elem = document.getElementById("elem-container");
var styleObj = window.getComputedStyle(elem, null);
var height = styleObj.height;
// 等同于
var height = styleObj["height"];
var height = styleObj.getPropertyValue("height");
```

上面代码得到的`height`属性，是浏览器最终渲染出来的高度，比其他方法得到的高度更可靠。由于`styleObj`是 `CSSStyleDeclaration` 实例，所以可以使用各种 `CSSStyleDeclaration` 的实例属性和方法。

有几点需要注意。

---

- `CSSStyleDeclaration` 实例返回的 CSS 值都是绝对单位。比如，长度都是像素单位（返回值包括 px 后缀），颜色是`rgb(#, #, #)`或`rgba(#, #, #, #)`格式。

---

- CSS 规则的简写形式无效。比如，想读取`margin`属性的值，不能直接读，只能读`marginLeft`、`marginTop`等属性；再比如，`font`属性也是不能直接读的，只能读`font-size`等单个属性。

---

- 如果读取 CSS 原始的属性名，要用方括号运算符，比如`styleObj['z-index']`；如果读取骆驼拼写法的 CSS 属性名，可以直接读取`styleObj.zIndex`。

---

- 该方法返回的 `CSSStyleDeclaration` 实例的`cssText`属性无效，返回`undefined`。

---

#### 6.CSS 伪元素

CSS 伪元素是通过 CSS 向 DOM 添加的元素，主要是通过`:before`和`:after`选择器生成，然后用`content`属性指定伪元素的内容。

下面是一段 HTML 代码。

`<div id="test">Test content</div>`

CSS 添加伪元素:before 的写法如下。

```javascript
#test:before {
  content: 'Before ';
  color: #FF0;
}
```

节点元素的`style`对象无法读写伪元素的样式，这时就要用到`window.getComputedStyle()`。JavaScript 获取伪元素，可以使用下面的方法。

```javascript
var test = document.querySelector("#test");

var result = window.getComputedStyle(test, ":before").content;
var color = window.getComputedStyle(test, ":before").color;
```

此外，也可以使用 `CSSStyleDeclaration` 实例的`getPropertyValue`方法，获取伪元素的属性。

```javascript
var result = window
  .getComputedStyle(test, ":before")
  .getPropertyValue("content");
var color = window.getComputedStyle(test, ":before").getPropertyValue("color");
```

#### 7.StyleSheet 接口

##### 7.1 概述

`StyleSheet`接口代表网页的一张样式表，包括`<link>`元素加载的样式表和`<style>`元素内嵌的样式表。

`document`对象的`styleSheets`属性，可以返回当前页面的所有`StyleSheet`实例（即所有样式表）。它是一个类似数组的对象。

```javascript
var sheets = document.styleSheets;
var sheet = document.styleSheets[0];
sheet instanceof StyleSheet; // true
```

如果是`<style>`元素嵌入的样式表，还有另一种获取`StyleSheet`实例的方法，就是这个节点元素的`sheet`属性。

```javascript
// HTML 代码为 <style id="myStyle"></style>
var myStyleSheet = document.getElementById("myStyle").sheet;
myStyleSheet instanceof StyleSheet; // true
```

##### 7.2 实例属性

`StyleSheet`实例有以下属性。

1).StyleSheet.disabled

`StyleSheet.disabled`返回一个布尔值，表示该样式表是否处于禁用状态。手动设置`disabled`属性为 true，等同于在`<link>`元素里面，将这张样式表设为`alternate stylesheet`，即该样式表将不会生效。

注意，`disabled`属性只能在 JavaScript 脚本中设置，不能在 HTML 语句中设置。

2).Stylesheet.href

`Stylesheet.href`返回样式表的网址。对于内嵌样式表，该属性返回`null`。该属性只读。

`document.styleSheets[0].href`

3).StyleSheet.media

`StyleSheet.media`属性返回一个类似数组的对象（`MediaList`实例），成员是表示适用媒介的字符串。表示当前样式表是用于屏幕（screen），还是用于打印（print）或手持设备（handheld），或各种媒介都适用（all）。该属性只读，默认值是 screen。

`document.styleSheets[0].media.mediaText// "all"`

`MediaList`实例的`appendMedium`方法，用于增加媒介；`deleteMedium`方法用于删除媒介。

```javascript
document.styleSheets[0].media.appendMedium("handheld");
document.styleSheets[0].media.deleteMedium("print");
```

4).StyleSheet.title

`StyleSheet.title`属性返回样式表的 title 属性。

5).StyleSheet.type

`StyleSheet.type`属性返回样式表的`type`属性，通常是`text/css`。

`document.styleSheets[0].type // "text/css"`

6).StyleSheet.parentStyleSheet

CSS 的`@import`命令允许在样式表中加载其他样式表。`StyleSheet.parentStyleSheet`属性返回包含了当前样式表的那张样式表。如果当前样式表是顶层样式表，则该属性返回`null`。

```javascript
if (stylesheet.parentStyleSheet) {
  sheet = stylesheet.parentStyleSheet;
} else {
  sheet = stylesheet;
}
```

7).StyleSheet.ownerNode

`StyleSheet.ownerNode`属性返回`StyleSheet`对象所在的 DOM 节点，通常是`<link>`或`<style>`。对于那些由其他样式表引用的样式表，该属性为`null`。

```javascript
// HTML代码为
// <link rel="StyleSheet" href="example.css" type="text/css" />
document.styleSheets[0].ownerNode; // [object HTMLLinkElement]
```

8).StyleSheet.cssRules

`StyleSheet.cssRules`属性指向一个类似数组的对象（`CSSRuleList`实例），里面每一个成员就是当前样式表的一条 CSS 规则。使用该规则的`cssText`属性，可以得到 CSS 规则对应的字符串。

```javascript
var sheet = document.querySelector("#styleElement").sheet;

sheet.cssRules[0].cssText;
// "body { background-color: red; margin: 20px; }"

sheet.cssRules[1].cssText;
// "p { line-height: 1.4em; color: blue; }"
```

每条 CSS 规则还有一个`style`属性，指向一个对象，用来读写具体的 CSS 命令。

```javascript
styleSheet.cssRules[0].style.color = "red";
styleSheet.cssRules[1].style.color = "purple";
```

9).StyleSheet.ownerRule

有些样式表是通过`@import`规则输入的，它的`ownerRule`属性会返回一个`CSSRule`实例，代表那行`@import`规则。如果当前样式表不是通过`@import`引入的，`ownerRule`属性返回`null`。

##### 7.3 实例方法

1).CSSStyleSheet.insertRule()

`CSSStyleSheet.insertRule`方法用于在当前样式表的插入一个新的 CSS 规则。

```javascript
var sheet = document.querySelector("#styleElement").sheet;
sheet.insertRule("#block { color: white }", 0);
sheet.insertRule("p { color: red }", 1);
```

该方法可以接受两个参数，第一个参数是表示 CSS 规则的字符串，这里只能有一条规则，否则会报错。第二个参数是该规则在样式表的插入位置（从 0 开始），该参数可选，默认为 0（即默认插在样式表的头部）。注意，如果插入位置大于现有规则的数目，会报错。

该方法的返回值是新插入规则的位置序号。

注意，浏览器对脚本在样式表里面插入规则有很多限制。所以，这个方法最好放在`try...catch`里使用。

2).CSSStyleSheet.deleteRule()

`CSSStyleSheet.deleteRule`方法用来在样式表里面移除一条规则，它的参数是该条规则在`cssRules`对象中的位置。该方法没有返回值。

`document.styleSheets[0].deleteRule(1);`

#### 8.实例：添加样式表

网页添加样式表有两种方式。一种是添加一张内置样式表，即在文档中添加一个`<style>`节点。

```javascript
// 写法一
var style = document.createElement("style");
style.setAttribute("media", "screen");
style.innerHTML = "body{color:red}";
document.head.appendChild(style);

// 写法二
var style = (function() {
  var style = document.createElement("style");
  document.head.appendChild(style);
  return style;
})();
style.sheet.insertRule(".foo{color:red;}", 0);
```

另一种是添加外部样式表，即在文档中添加一个`<link>`节点，然后将`href`属性指向外部样式表的 URL。

```javascript
var linkElm = document.createElement("link");
linkElm.setAttribute("rel", "stylesheet");
linkElm.setAttribute("type", "text/css");
linkElm.setAttribute("href", "reset-min.css");

document.head.appendChild(linkElm);
```

#### 9.CSSRuleList 接口

`CSSRuleList` 接口是一个类似数组的对象，表示一组 CSS 规则，成员都是 `CSSRule` 实例。

获取 `CSSRuleList` 实例，一般是通过`StyleSheet.cssRules`属性。

```javascript
// HTML 代码如下
// <style id="myStyle">
//   h1 { color: red; }
//   p { color: blue; }
// </style>
var myStyleSheet = document.getElementById("myStyle").sheet;
var crl = myStyleSheet.cssRules;
crl instanceof CSSRuleList; // true
```

`CSSRuleList` 实例里面，每一条规则（`CSSRule` 实例）可以通过`rules.item(index)`或者`rules[index]`拿到。CSS 规则的条数通过`rules.length`拿到。还是用上面的例子。

```javascript
crl[0] instanceof CSSRule; // true
crl.length; // 2
```

注意，添加规则和删除规则不能在 `CSSRuleList` 实例操作，而要在它的父元素 `StyleSheet` 实例上，通过`StyleSheet.insertRule()`和`StyleSheet.deleteRule()`操作。

#### 10.CSSRule 接口

##### 10.1 概述

一条 CSS 规则包括两个部分：CSS 选择器和样式声明。下面就是一条典型的 CSS 规则。

```javascript
.myClass {
  color: red;
  background-color: yellow;
}
```

JavaScript 通过 `CSSRule` 接口操作 CSS 规则。一般通过 `CSSRuleList` 接口（`StyleSheet.cssRules`）获取 `CSSRule` 实例。

```javascript
// HTML 代码如下
// <style id="myStyle">
//   .myClass {
//     color: red;
//     background-color: yellow;
//   }
// </style>
var myStyleSheet = document.getElementById("myStyle").sheet;
var ruleList = myStyleSheet.cssRules;
var rule = ruleList[0];
rule instanceof CSSRule; // true
```

##### 10.2 CSSRule 实例的属性

1).CSSRule.cssText

`CSSRule.cssText`属性返回当前规则的文本，还是使用上面的例子。

`rule.cssText// ".myClass { color: red; background-color: yellow; }"`

如果规则是加载（`@import`）其他样式表，`cssText`属性返回`@import 'url'`。

2).CSSRule.parentStyleSheet

`CSSRule.parentStyleSheet`属性返回当前规则所在的样式表对象（`StyleSheet` 实例），还是使用上面的例子。

`rule.parentStyleSheet === myStyleSheet // true`

3).CSSRule.parentRule

`CSSRule.parentRule`属性返回包含当前规则的父规则，如果不存在父规则（即当前规则是顶层规则），则返回`null`。

父规则最常见的情况是，当前规则包含在`@media`规则代码块之中。

```javascript
// HTML 代码如下
// <style id="myStyle">
//   @supports (display: flex) {
//     @media screen and (min-width: 900px) {
//       article {
//         display: flex;
//       }
//     }
//  }
// </style>
var myStyleSheet = document.getElementById("myStyle").sheet;
var ruleList = myStyleSheet.cssRules;

var rule0 = ruleList[0];
rule0.cssText;
// "@supports (display: flex) {
//    @media screen and (min-width: 900px) {
//      article { display: flex; }
//    }
// }"

// 由于这条规则内嵌其他规则，
// 所以它有 cssRules 属性，且该属性是 CSSRuleList 实例
rule0.cssRules instanceof CSSRuleList; // true

var rule1 = rule0.cssRules[0];
rule1.cssText;
// "@media screen and (min-width: 900px) {
//   article { display: flex; }
// }"

var rule2 = rule1.cssRules[0];
rule2.cssText;
// "article { display: flex; }"

rule1.parentRule === rule0; // true
rule2.parentRule === rule1; // true
```

4).CSSRule.type

`CSSRule.type`属性返回一个整数值，表示当前规则的类型。

最常见的类型有以下几种。

---

- 1：普通样式规则（`CSSStyleRule` 实例）
- 2：`@import`规则
- 3：`@media`规则（`CSSMediaRule` 实例）
- 4：`@font-face`规则

---

##### 10.3 CSSStyleRule 接口

如果一条 CSS 规则是普通的样式规则（不含特殊的 CSS 命令），那么除了 `CSSRule` 接口，它还部署了 `CSSStyleRule` 接口。

`CSSStyleRule` 接口有以下两个属性。

1).CSSStyleRule.selectorText

`CSSStyleRule.selectorText`属性返回当前规则的选择器。

```javascript
var stylesheet = document.styleSheets[0];
stylesheet.cssRules[0].selectorText; // ".myClass"
```

注意，这个属性是可写的。

2).CSSStyleRule.style

`CSSStyleRule.style`属性返回一个对象（`CSSStyleDeclaration` 实例），代表当前规则的样式声明，也就是选择器后面的大括号里面的部分。

```javascript
// HTML 代码为
// <style id="myStyle">
//   p { color: red; }
// </style>
var styleSheet = document.getElementById("myStyle").sheet;
styleSheet.cssRules[0].style instanceof CSSStyleDeclaration;
// true
```

`CSSStyleDeclaration` 实例的`cssText`属性，可以返回所有样式声明，格式为字符串。

```javascript
styleSheet.cssRules[0].style.cssText;
// "color: red;"
styleSheet.cssRules[0].selectorText;
// "p"
```

##### 10.4 CSSMediaRule 接口

如果一条 CSS 规则是`@media`代码块，那么它除了 `CSSRule` 接口，还部署了 `CSSMediaRule` 接口。

该接口主要提供`media`属性和`conditionText`属性。前者返回代表`@media`规则的一个对象（`MediaList` 实例），后者返回`@media`规则的生效条件。

```javascript
// HTML 代码如下
// <style id="myStyle">
//   @media screen and (min-width: 900px) {
//     article { display: flex; }
//   }
// </style>
var styleSheet = document.getElementById("myStyle").sheet;
styleSheet.cssRules[0] instanceof CSSMediaRule;
// true

styleSheet.cssRules[0].media;
//  {
//    0: "screen and (min-width: 900px)",
//    appendMedium: function,
//    deleteMedium: function,
//    item: function,
//    length: 1,
//    mediaText: "screen and (min-width: 900px)"
// }

styleSheet.cssRules[0].conditionText;
// "screen and (min-width: 900px)"
```

#### 11.window.matchMedia()

##### 11.1 基本用法

`window.matchMedia`方法用来将 CSS 的`MediaQuery`条件语句，转换成一个 `MediaQueryList` 实例。

```javascript
var mdl = window.matchMedia("(min-width: 400px)");
mdl instanceof MediaQueryList; // true
```

注意，如果参数不是有效的`MediaQuery`条件语句，`window.matchMedia`不会报错，依然返回的一个 `MediaQueryList` 实例。

`window.matchMedia('bad string') instanceof MediaQueryList // true`

##### 11.2 MediaQueryList 接口的实例属性

`MediaQueryList` 实例有三个属性。

1).MediaQueryList.media

`MediaQueryList.media`属性返回一个字符串，表示对应的 `MediaQuery`条件语句。

```javascript
var mql = window.matchMedia("(min-width: 400px)");
mql.media; // "(min-width: 400px)"
```

2).MediaQueryList.matches

`MediaQueryList.matches`属性返回一个布尔值，表示当前页面是否符合指定的 `MediaQuery` 条件语句。

```javascript
if (window.matchMedia("(min-width: 400px)").matches) {
  /* 当前视口不小于 400 像素 */
} else {
  /* 当前视口小于 400 像素 */
}
```

下面的例子根据`mediaQuery`是否匹配当前环境，加载相应的 CSS 样式表。

```javascript
var result = window.matchMedia("(max-width: 700px)");

if (result.matches) {
  var linkElm = document.createElement("link");
  linkElm.setAttribute("rel", "stylesheet");
  linkElm.setAttribute("type", "text/css");
  linkElm.setAttribute("href", "small.css");

  document.head.appendChild(linkElm);
}
```

3).MediaQueryList.onchange

如果 `MediaQuery` 条件语句的适配环境发生变化，会触发`change`事件。`MediaQueryList.onchange`属性用来指定`change`事件的监听函数。该函数的参数是`change`事件对象（`MediaQueryListEvent` 实例），该对象与 `MediaQueryList` 实例类似，也有`media`和`matches`属性。

```javascript
var mql = window.matchMedia("(max-width: 600px)");

mql.onchange = function(e) {
  if (e.matches) {
    /* 视口不超过 600 像素 */
  } else {
    /* 视口超过 600 像素 */
  }
};
```

上面代码中，`change`事件发生后，存在两种可能。一种是显示宽度从 700 像素以上变为以下，另一种是从 700 像素以下变为以上，所以在监听函数内部要判断一下当前是哪一种情况。

##### 11.3 MediaQueryList 接口的实例方法

`MediaQueryList` 实例有两个方法`MediaQueryList.addListener()`和`MediaQueryList.removeListener()`，用来为`change`事件添加或撤销监听函数。

```javascript
var mql = window.matchMedia("(max-width: 600px)");

// 指定监听函数
mql.addListener(mqCallback);

// 撤销监听函数
mql.removeListener(mqCallback);

function mqCallback(e) {
  if (e.matches) {
    /* 视口不超过 600 像素 */
  } else {
    /* 视口超过 600 像素 */
  }
}
```

#### 12.CSS 事件

##### 12.1 transitionEnd 事件

CSS 的**过渡效果（transition）**结束后，触发`transitionEnd`事件。

```javascript
el.addEventListener("transitionend", onTransitionEnd, false);

function onTransitionEnd() {
  console.log("Transition end");
}
```

`transitionEnd`的事件对象具有以下属性。

---

- `propertyName`：发生`transition`效果的 CSS 属性名。
- `elapsedTime`：`transition`效果持续的秒数，不含`transition-delay`的时间。
- `pseudoElement`：如果`transition`效果发生在伪元素，会返回该伪元素的名称，以“`::`”开头。如果不发生在伪元素上，则返回一个空字符串。

---

实际使用`transitionend`事件时，可能需要添加浏览器前缀。

```javascript
el.addEventListener("webkitTransitionEnd", function() {
  el.style.transition = "none";
});
```

##### 12.2 animationstart 事件，animationend 事件，animationiteration 事件

CSS 动画有以下三个事件。

---

- `animationstart`事件：动画开始时触发。
- `animationend`事件：动画结束时触发。
- `animationiteration`事件：开始新一轮动画循环时触发。如果`animation-iteration-count`属性等于 1，该事件不触发，即只播放一轮的 CSS 动画，不会触发`animationiteration`事件。

---

```javascript
div.addEventListener("animationiteration", function() {
  console.log("完成一次动画");
});
```

这三个事件的事件对象，都有`animationName`属性（返回产生过渡效果的 CSS 属性名）和`elapsedTime`属性（动画已经运行的秒数）。对于`animationstart`事件，`elapsedTime`属性等于 0，除非`animation-delay`属性等于负值。

```javascript
var el = document.getElementById("animation");

el.addEventListener("animationstart", listener, false);
el.addEventListener("animationend", listener, false);
el.addEventListener("animationiteration", listener, false);

function listener(e) {
  var li = document.createElement("li");
  switch (e.type) {
    case "animationstart":
      li.innerHTML = "Started: elapsed time is " + e.elapsedTime;
      break;
    case "animationend":
      li.innerHTML = "Ended: elapsed time is " + e.elapsedTime;
      break;
    case "animationiteration":
      li.innerHTML = "New loop started at time " + e.elapsedTime;
      break;
  }
  document.getElementById("output").appendChild(li);
}
```

上面代码的运行结果是下面的样子。

```javascript
Started: elapsed time is 0
New loop started at time 3.01200008392334
New loop started at time 6.00600004196167
Ended: elapsed time is 9.234000205993652
```

`animation-play-state`属性可以控制动画的状态（暂停/播放），该属性需求加上浏览器前缀。

```javascript
element.style.webkitAnimationPlayState = "paused";
element.style.webkitAnimationPlayState = "running";
```

### 9.Mutation Observer API

#### 1.概述

Mutation Observer API 用来监视 DOM 变动。DOM 的任何变动，比如节点的增减、属性的变动、文本内容的变动，这个 API 都可以得到通知。

概念上，它很接近事件，可以理解为 DOM 发生变动就会触发 `Mutation Observer` 事件。但是，它与事件有一个本质不同：事件是同步触发，也就是说，DOM 的变动立刻会触发相应的事件；`Mutation Observer` 则是异步触发，DOM 的变动并不会马上触发，而是要等到当前所有 DOM 操作都结束才触发。

这样设计是为了应付 DOM 变动频繁的特点。举例来说，如果文档中连续插入 1000 个`<p>`元素，就会连续触发 1000 个插入事件，执行每个事件的回调函数，这很可能造成浏览器的卡顿；而 `Mutation Observer` 完全不同，只在 1000 个段落都插入结束后才会触发，而且只触发一次。

`Mutation Observer` 有以下特点。

---

- a.它等待所有脚本任务完成后，才会运行（即异步触发方式）。
- b.它把 DOM 变动记录封装成一个数组进行处理，而不是一条条个别处理 DOM 变动。
- c.它既可以观察 DOM 的所有类型变动，也可以指定只观察某一类变动。

---

#### 2.MutationObserver 构造函数

使用时，首先使用`MutationObserver`构造函数，新建一个观察器实例，同时指定这个实例的回调函数。

`var observer = new MutationObserver(callback);`

上面代码中的回调函数，会在每次 DOM 变动后调用。该回调函数接受两个参数，第一个是变动数组，第二个是观察器实例，下面是一个例子。

```javascript
var observer = new MutationObserver(function(mutations, observer) {
  mutations.forEach(function(mutation) {
    console.log(mutation);
  });
});
```

#### 3.MutationObserver 的实例方法

##### 3.1 observe()

`observe`方法用来启动监听，它接受两个参数。

---

- 第一个参数：所要观察的 DOM 节点
- 第二个参数：一个配置对象，指定所要观察的特定变动

---

```javascript
var article = document.querySelector("article");

var options = {
  childList: true,
  attributes: true
};

observer.observe(article, options);
```

上面代码中，`observe`方法接受两个参数，第一个是所要观察的 DOM 元素是 article，第二个是所要观察的变动类型（子节点变动和属性变动）。

观察器所能观察的 DOM 变动类型（即上面代码的`options`对象），有以下几种。

---

- `childList`：子节点的变动。
- `attributes`：属性的变动。
- `characterData`：节点内容或节点文本的变动。
- `subtree`：所有后代节点的变动。

---

想要观察哪一种变动类型，就在`option`对象中指定它的值为 true。需要注意的是，如果设置观察`subtree`的变动，必须同时指定`childList`、`attributes`和`characterData`中的一种或多种。

除了变动类型，`options`对象还可以设定以下属性：

---

- `attributeOldValue`：布尔值，表示观察`attributes`变动时，是否需要记录变动前的属性值。
- `characterDataOldValue`：布尔值，表示观察`characterData`变动时，是否需要记录变动前的值。
- `attributeFilter`：数组，表示需要观察的特定属性（比如`['class','src']`）。

---

```javascript
// 开始监听文档根节点（即<html>标签）的变动
mutationObserver.observe(document.documentElement, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true
});
```

对一个节点添加观察器，就像使用`addEventListener`方法一样，多次添加同一个观察器是无效的，回调函数依然只会触发一次。但是，如果指定不同的`options`对象，就会被当作两个不同的观察器。

下面的例子是观察新增的子节点。

```javascript
var insertedNodes = [];
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    for (var i = 0; i < mutation.addedNodes.length; i++)
      insertedNodes.push(mutation.addedNodes[i]);
  });
});
observer.observe(document, { childList: true });
console.log(insertedNodes);
```

##### 3.2 disconnect()，takeRecords（）

`disconnect`方法用来停止观察。调用该方法后，DOM 再发生变动，也不会触发观察器。

`observer.disconnect();`

`takeRecords`方法用来清除变动记录，即不再处理未处理的变动。该方法返回变动记录的数组。

`observer.takeRecords();`

下面是一个例子。

```javascript
// 保存所有没有被观察器处理的变动
var changes = mutationObserver.takeRecords();

// 停止观察
mutationObserver.disconnect();
```

#### 4.MutationRecord 对象

DOM 每次发生变化，就会生成一条变动记录（`MutationRecord` 实例）。该实例包含了与变动相关的所有信息。`Mutation Observer` 处理的就是一个个`MutationRecord`实例所组成的数组。

`MutationRecord`对象包含了 DOM 的相关信息，有如下属性：

---

- `type`：观察的变动类型（`attribute`、`characterData`或者`childList`）。
- `target`：发生变动的 DOM 节点。
- `addedNodes`：新增的 DOM 节点。
- `removedNodes`：删除的 DOM 节点。
- `previousSibling`：前一个同级节点，如果没有则返回`null`。
- `nextSibling`：下一个同级节点，如果没有则返回`null`。
- `attributeName`：发生变动的属性。如果设置了`attributeFilter`，则只返回预先指定的属性。
- `oldValue`：变动前的值。这个属性只对`attribute`和`characterData`变动有效，如果发生`childList`变动，则返回`null`。

---

#### 5.应用示例

##### 5.1 子元素的变动

下面的例子说明如何读取变动记录。

```javascript
var callback = function(records) {
  records.map(function(record) {
    console.log("Mutation type: " + record.type);
    console.log("Mutation target: " + record.target);
  });
};

var mo = new MutationObserver(callback);

var option = {
  childList: true,
  subtree: true
};

mo.observe(document.body, option);
```

上面代码的观察器，观察`<body>`的所有下级节点（`childList`表示观察子节点，`subtree`表示观察后代节点）的变动。回调函数会在控制台显示所有变动的类型和目标节点。

##### 5.2 属性的变动

下面的例子说明如何追踪属性的变动。

```javascript
var callback = function(records) {
  records.map(function(record) {
    console.log("Previous attribute value: " + record.oldValue);
  });
};

var mo = new MutationObserver(callback);

var element = document.getElementById("#my_element");

var options = {
  attributes: true,
  attributeOldValue: true
};

mo.observe(element, options);
```

上面代码先设定追踪属性变动（`'attributes': true`），然后设定记录变动前的值。实际发生变动时，会将变动前的值显示在控制台。

##### 5.3 取代 DOMContentLoaded 事件

网页加载的时候，DOM 节点的生成会产生变动记录，因此只要观察 DOM 的变动，就能在第一时间触发相关事件，因此也就没有必要使用`DOMContentLoaded`事件。

```javascript
var observer = new MutationObserver(callback);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
```

上面代码中，监听`document.documentElement`（即 HTML 节点）的子节点的变动，`subtree`属性指定监听还包括后代节点。因此，任意一个网页元素一旦生成，就能立刻被监听到。

下面的代码，使用`MutationObserver`对象封装一个监听 DOM 生成的函数。

```javascript
(function(win) {
  "use strict";

  var listeners = [];
  var doc = win.document;
  var MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
  var observer;

  function ready(selector, fn) {
    // 储存选择器和回调函数
    listeners.push({
      selector: selector,
      fn: fn
    });
    if (!observer) {
      // 监听document变化
      observer = new MutationObserver(check);
      observer.observe(doc.documentElement, {
        childList: true,
        subtree: true
      });
    }
    // 检查该节点是否已经在DOM中
    check();
  }

  function check() {
    // 检查是否匹配已储存的节点
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      // 检查指定节点是否有匹配
      var elements = doc.querySelectorAll(listener.selector);
      for (var j = 0; j < elements.length; j++) {
        var element = elements[j];
        // 确保回调函数只会对该元素调用一次
        if (!element.ready) {
          element.ready = true;
          // 对该节点调用回调函数
          listener.fn.call(element, element);
        }
      }
    }
  }

  // 对外暴露ready
  win.ready = ready;
})(this);

ready(".foo", function(element) {
  // ...
});
```
