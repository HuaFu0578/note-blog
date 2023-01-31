# Web前端开发笔记

## H5 API

### 获取地理信息

```js
// window.navigator.geolocation
//必须放在https协议或file协议下
window.navigator.geolocation.getCurrentPosition(function(postion){
    console.log(postion);
},function(){
    console.log("failed");
});
//获取的对象为：
Position={
    coords:{
        accuracy:123445,
        altitude:null,
        altitudeAccuracy:null,
        heading:null,
        latitude:23.4545,
        longitude:123.3456,
        speed:null,
        __proto__:Coordinates,
    },
    timestamp:230459230,
    __proto__:Position
}
```

### 四行搭建简易服务器

```js
let express require("express");
let app = new express();
app.use(express.static("./page"));
app.listen(12580);//端口号大于8000或等于80
```

### 重力感应

```js
//只有带有陀螺仪的设备才支持体感
//苹果11.1.x以及之后设备的页面只有在https的协议下才能使用这些接口（包括微信浏览器）

//alpha: 指北（指南针） [0,360) 当为0时指正北,180指正南
//beta: 平放时为0,如果将手机立起来(短边接触桌面),直立时为90。
//gamma: 平放时为0,如果将手机立起来(长边接触桌面),直立时为90。

//自行理解：建立空间坐标系，X轴指右，Y轴指前，Z轴指上
//alpha旋转轴为Z轴，beta旋转轴为X轴，gamma旋转轴为Y轴
//旋转方向满足右手法则：大拇指指向正方向，四指弯向为旋转正方向（即逆时针方向为正）
window.addEventListener("deviceorientation",function(e){
        var oDev = document.getElementById("dev");
    oDev.innerHTML = "alpha:" + e.alpha + "<br/> beta:" + e.beta
        + "<br/> gamma:" + e.gamma;

});
```

### 运动感应

```js
window.addEventListener("devicemotion",function(e){
    var oDev = document.getElementById("dev");
        var a_x = e.acceleration.x,
            a_y = e.acceleration.y,
            a_z = e.acceleration.z;
        oDev.innerHTML = "a_x:" + a_x + "<br/> a_y:" + a_y 
        + "<br/> a_z:" + a_z;
    if (Math.abs(a_x) > 9 ||Math.abs(a_y) > 9 ||Math.abs(a_z) > 9) {
        alert("在摇晃");
    }
});
```

### requistAnimationFrame动画优化

requistAnimationFrame兼容性极差

屏幕刷新频率：60HZ,如果变化一秒超过60次，必然会有一些动画帧会被丢掉。

```js
//requestAnimationFrame相当于setTimeout
//requestAnimationFrame每秒钟60帧，可以准时执行每一帧
//setInterval理论上可以，但是前提是函数执行时间必须小于等于1/60秒
setInterval(function(){},1000/60);
var timer=null;
timer=requestAnimationFrame(fn);
cancelAnimationFrame(timer);//取消动画，相当于clearTimeout

//兼容性差，如果还想使用，可以采取一定补救
window.requestAnimationFrame = (function(){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
     function(fn){
        window.setTimeout(fn,1000/60);
    };
}());
window.cancelAnimationFrame = (function(){
    return window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
     function(timer){
        window.clearTimeout(timer);
    };
});
```

### localStorage

cookie:每次请求的时候都有可能传送许多无用的信息到后端
localStorage:长期存放在浏览器，写入localStorage(无论窗口是否关闭)
sessionStorage:这次会话临时需要存储的变量，每次窗口关闭会自动清空

localStorage和cookie对比：
&emsp;&emsp;1、localStorage在发送数据时不会将数据发出去，cookie会将所有的数据发出去。
&emsp;&emsp;2、cookie存储的内容比较少，4k;localStorage存储的内容较多，5M左右。

```js
//localStorage 只能存字符串
localStorage.name="hfull";
localStorage.setItem("age",18);
localStorage.getItem("age");
localStorage.removeItem("age");
localStorage.arr=JSON.stringify([1,2,3]);
console.log(JSON.parse(localStorage.arr));
```

### history

```js
history.pushState({value:value},null,"#"+value);
//回退事件
//只要url变化就会触发  popstate比hashchange事件先触发
window.addEventListener("popstate",function(e){
    console.log(e);
});
//hash值（锚点）变化会触发
window.addEventListener("hashchange",function(e){
    console.log(e);
})
```

### worker

worker兼容性不好，基本不用
worker：多线程，真的多线程，不是伪多线程
worker不能操作DOM，没有window对象，不能读取文件
可以发ajax，可以计算
在worker中继续创建worker,理论上可以，但是没有任何浏览器支持。

```js
//主线程和辅线程用postMessage发送消息，onmessage接受消息
var worke = new Worker("./worker.js");
worker.postMessage({
    name:"hfull",
});
worker.onmessage(function(e){
    console.log(e.data);
});
worker.terminate();//停止执行


/*****worker.js*****/
this.onmessage=function(e){
    console.log(e.data);
    var abc=123;
    this.post(abc);//发消息
    this.close();//自己停止执行
}

// importScript("math.js");
//可以通过该方法引入其他js文件
```

# ES6语法糖

## 变量定义

### 1. let  

1. 块级作用域
2. 临时死区

### 2. const 常量定义

储存常量的内存空间里的值不能改变

## 展开与收集运算符

ES6可以处理数组，ES7可以处理对象
作用：简化书写长度，提升开发效率

### ES7 ...运算符

```js
let obj1={
    name:"obj1",
    age:19
}
let obj2{
    innerObj:{
        name:"inner",
        str:"test"
    }
}
//对象克隆
//浅层克隆
let simpleCopy={
    ...obj1,
    ...obj2,
}
//嵌套不太复杂的深层克隆
let deepCopy={
    obj1:{
        ...obj1,
    }
    obj2:{
        innerObj:{
            ...innerObj,
        }
    }
}
```

### ES6 destructuring 解构

  解构(结构化赋值):
    &nbsp;&nbsp;&nbsp;&nbsp;解构过程中，具备赋值和变量声明两个功能
    &nbsp;&nbsp;&nbsp;&nbsp;目的在于把等号两边的相似的内部值取出来

## 箭头函数

  作用：函数目的指向性更强，可读性更好，简化代码，提升开发效率
1、箭头函数必须存在变量中
2、return可以省略，同时大括号也要去掉 ```let sum=(a,b)=>a+b;```
3、 当函数形参为一个时，可以去掉括号
4、 形参不能重复，ES5中重复不会报错，但ES6报错

### 箭头函数特点

1、 不用写function关键字
2、 只能作为函数使用，不能new，没有原型
3、参数不能重复命名
4、返回值可以不写return，但是有时需要配合｛｝
5、 内部arguments this由定义时外围最接近一层的非箭头函数的arguments和this决定其值

## ES5 Object.defineProperty

注意：
&nbsp;&nbsp;&nbsp;&nbsp;value、writable和get、set不能同时使用
作用：双向数据绑定的核心方法，主要做数据劫持操作（监控属性变化），同时是后期ES6中许多语法糖的底层实现核心方法

```js
var o = {
    name: "test"
};

function observer(obj) {
    if (!obj || typeof obj !== "object") {
        return obj;
    }
    var keyArr = keyArr || Object.keys(obj),
        changeKeys = keyArr.filter(function (key) {
            return keyArr.indexOf(key) > -1;
        });
        console.log(changeKeys)
    Object.keys(obj).forEach(function (key) {
        propertyDefine(obj, key, obj[key]);
    });
}

function propertyDefine(obj, key, val) {
    observer(val);
    Object.defineProperty(obj, key, {
        get() {
            return val;
        },
        set(value) {
            if (value === val) return;
            val = value;
            update();
        }
    });
}

function update() {
    console.log("写入完成")
}
observer(o);

//监控数组
let arr=[];
let {push,pop,shift,unshift,slice,splice}=Array.prototype;
let arrMethod=[push,pop,shift,unshift,slice,splice];
arrMethod.forEach(method=>{
    Object.defineProperty(Array.prototype,method,{
        value:(function(){
            return (...arg)=>{
                method.apply(arr,arg);
                update();
            }
        }()),
    });
})
```

## ES5 数据劫持

VUE双向数据绑定核心功能由Observer、Compile、Watcher三部分实现，其中Observer部分功能实现由Object.defineProperty实现。
&nbsp;&nbsp;&nbsp;&nbsp;Observer：监测数据变化进行相应回调（数据劫持）;

## ES6 Proxy & Reflect (兼容性不好)

简介：植入代理式的思想，以简洁易懂的方式控制对外部对象的访问。
总结：利用内置的set、get方法控制属性的读写功能用处较大，其余has、deleteProperty等方法在工作中不常用，兼容不好
例如：

```js
let oData={
    val:"hello",
    _val:"cccc",//私有属性
};
let oProxyData=new Proxy(oData,{
    set(target,key,value,receiver){
        Reflect.set(target,key,value);
        updata();
    },
    get(target,key,receiver){
        Reflect.get(target,key);
    },
    has(target,key){
        return key.indexOf("_") != -1 ? false : key in oData;
    },
    deleteProperty(target,key){

    },
});
function updata(){
    console.log("更新");
}
//直接对oProxyData变量进行读写
oProxyData.val=10;//更新
oProxyData.name="javascrpt";//增加属性也能监听到，更新
console.log( "_val" in oProxyData);//私有属性回返回false，被屏蔽掉
console.log(delete oProxyData.val);
```

## Class(构造函数)

### ES5 Class

构造函数，私有属性，公有属性，私有属性继承，公有属性继承

```js
/*原型继承问题*/
//方法一  
Obj1.prototype.__proto__=Obj2.prototype;
//方法二
Object.setPrototypeOf(Obj1.prototype,Obj2.prototype);
//方法三
Obj1.prototype=Object.create(Obj2.prototype,{
    constructor:Obj1.prototype,
});
//方法...

```

### ES6 Class

核心变化：
&nbsp;&nbsp;&nbsp;&nbsp;class、constructor、static、extends、super

```js
//ES6语法
//私有属性 公有属性 静态属性  函数属性
class Plane(){
    //static alive=true; //ES7语法,ES6不支持非方法的静态属性
    static alive(){
        return true;
    }
    constructor(name){
        this.name=name||"plainFly";
        this.blood=100;
        // return {
        //     oil:"gas",
        // }
        //如果构造函数返回值为一个对象，
        //则构造的对象会以该对象为基础添加属性等
    },
    fly(){
        console.log("flying");
    },
    //name=10;  //ES7语法 私有属性
    //ES6 不能在原型上添加属性
}
var oPl=new Plane();
console.log(oPl);
oPl.fly();

//继承
class AttackPlane extends Plane{
    constructor(name){
        super(name);//相当于Plane.apply
        this.logo="hello";
    },
    bullet(){
        console.log("shot");
    }
}
var oAP=new AttackPlane("攻击机");

```

class定义的类，注意情况：
1、必须使用new
2、定义的原型和静态属性都不能枚举
3、静态属性要放到Plane 而非原型

### 模拟实现Class

```js
function _classCallCheck(_this,_constructor){
    if(!(_this instanceof _constructor)){
        throw "TypeError:Class constructor"+_constructor+
        "cannot be invoked without 'new'";  
    }
}
function _defineProperties(target,props){
    //Object.defineProperty
    props.forEach(function(ele){
        Object.defineProperty(target,ele.key,{
            value:ele.value,
            writable:true,
            configurable:true,
        });
    });
}
/**
 * 处理共有属性和静态属性
*/
function _createClass(_constructor,_prototypeProps,_staticProps){
    if(_prototypeProps){
        _defineProperties(_constructor.prototype,_prototypePros);
    }
    if(_staticProps){
        _defineProperties(_constructor,_staticPros);
    }
}
var Plane=(function(){
    function Plane(name){
        //判断是否以new的方式来执行
        _classCallCheck(this,Plane);
        //把私有属性 公有属性 静态属性 赋上
        this.name=name||"plainFly";
        this.blood=100;
    }
    _createClass(Plane,[{
        key:"fly",
        value:function(){
            console.log("flying");
        }
    }],[{
        key:"alive",
        value:function(){
            return true;
        }
    }])
    return Plane;
}());

/*继承*/
function _inherit(sub,sup){
    Object.setPrototypeOf(sub.prototype,sup.prototype);
}
var AttackPlane=(function(Plane){
    _inherit(AttackPlane,Plane);//公有属性继承
    function AttackPlane(name){
        _classCallCheck(this,AttackPlane);
        var _this=this;
        var that=Plane.call(_this,name);//私有属性继承
        if(typeof that==="object"){
            _this=that;
        }
        _this.logo="hello";
        return _this;
    }
    _createClass(AttackPlane,[{
        key:"bullet",
        value:function(){
            console.log("shot");
        },
    }],[{
        key:"alive",
        value:function(){
            return true;
        }
    }]);
    return AttackPlane;
}(Plane));
```

## ES7 Class提案属性

新特性：
&nbsp;&nbsp;&nbsp;&nbsp;static property = xxx; 静态属性
&nbsp;&nbsp;&nbsp;&nbsp;property = xxx; 私有属性
&nbsp;&nbsp;&nbsp;&nbsp;@decorator 装饰器

需要下载

```npm
npm install @babel/plugin-proposal-decorators
npm install @babel/plugin-proposal-class-properties
```

需要配置

```js
{
    "plugins":[
        ["@babel/plugin-proposal-decorators",{"legacy":true}],
        ["@babel/plugin-proposal-class-properties",{"loose":true}],
    ],
}
```

ES7使用例子

```js
@skin
class Search {
    static msg = "static property";
    constructor() {
        this.keyword = "baidu";
        this.num = 50;
    }
    @myReadOnly //装饰私有属性
    url = "www.baidu.com";
    @dealData //装饰原型上属性
    getContent(){  //函数属性
    //填坑 此处不要使用箭头函数，函数属性有descriptor.value
    //而箭头函数属于私有属性，有descriptor.initializer
        return "HUAWEI";
    }，
    @checkKW("handsome")
    checkKeyWord(){
        return "key word has checked";
    }
}
/**
 * target 类名，这里为Search
*/
function skin(target){
    target.staticPros="abcde"; //可以通过该方法添加静态属性
}
/**
 * proto 原型
 * key 属性名
 * descriptor {writable,configurable,enumable,initializer()} 描述器
*/
function myReadOnly(proto,key,descriptor){
    descriptor.writable=false;
    descriptor.initializer=function(){
        return 666; //该函数的返回值决定该修饰属性的值
    }
}
/**
 * proto 原型
 * key 属性名
 * descriptor {writable,configurable,enumable,value()} 描述器
*/
function dealData(proto,key,descriptor){

}
//此处是利用函数装饰，其他利用名称装饰
function checkKW(str){
    return function(proto,key,descriptor){

    }
}
```

## Set和Map

（兼容性不是很好）

### Set

简介；Set为ES6提供的构造函数，能够造出一种新的存储结构
特点：只有属性值，成员值唯一（不重复）
用途：可以转成数组，本身具备去重，交集，并集，差集作用等。

```js
// 必须满足接口，[]、""、arguments、NodeList
let set=new Set([1,2,true,[3,6],{name:"hfull"}]);
set.add(1);
set.delete(1);
set.clear();
set.has(1000);
//取值
set.forEach(val=>{
    console.log(val);
});
for(let val of set){
    console.log(val);
}


// []=>Set
let arr=[1,2,3,4,5];
let set2=new Set(arr);
// Set=>[]
// Array.from  (ES6) 将类数组及具有迭代特性接口的值转成数组
let newArr=Array.from(set2);//方法一
let newArr2=[...set2];//方法二
console.log(newArr,newArr2);

{ //创建死区，只是为了在同一文件中使用同一名称变量
    //并集
    let arr1=[1,2,3,4,3,5,1];
    let arr2=[3,3,5,2,6,1,2];
    let unionSet=new Set([...arr1,...arr2]);
    //交集
    let set1=new Set(arr1);
    let set2=new Set(arr2);
    let crossSet=[...set1].filter(ele=>set2.has(ele));
    //差集
    let diffArr1=[...set1].filter(ele=>!set2.has(ele));
    let diffArr2=[...set2].filter(ele=>!set1.has(ele));
    let diffSet=[...diffArr1,...diffArr2];
}
```

### Map

简介：Map是ES6提供的构造函数，能够创造一种新的储存数据的结构，本质上是键值对的集合。
特点：key对应value,key和value唯一，任何值都可以当属性。
用途：可以让对象当属性，去重等。
原理实现：链接链表、hash算法、桶

```js
//初始化
let map=new Map([["name","hfull"],["age",20],[{},"****"]]);
//API
map.set({},"++++");//赋值
map.get("name");//取值
map.delete("name");//删除
map.clear();//全部删除
map.has("name");
map.keys();//返回所有key的集合
map.forEach(function(ele,key,self){});

//如果使用for of 遍历
for(let val of map){
    console.log(val);//val为键值对，例如["name","hfull"]
}
```

### Map存储原理及模拟实现

链表：对象内某个属性指向下一个对象
hash算法：将不定的值转成特定范围的值
桶：用数组构建桶，数组内用对象占位置，通过hash算法决定某个键值对放置在哪个桶的哪个位置，将该键值对存入对象

#### Map特点

1、不重复
2、字符串、对象、Null、NaN、[]、function(){}、10
3、set get、has、delete clear

```js
function MyMap(kwArr) {
    this.init(kwArr);
}
MyMap.prototype = {
    init(arr) {
        //初始化 桶
        this.bucketNumber = 8;
        this.bucket = new Array(this.bucketNumber);
        for (let i = 0, len = this.bucket.length; i < len; i++) {
            this.bucket[i] = {
                _type: "bucket" + i,
                next: null,
            }
        }

        if (arr && arr.length) {
            arr.forEach(ele => this.set(...ele));
        }
    },
    makeHash(key) {
        //key可能为string、number、boolean、
        //[]、{}、null、function(){}、undefined、NaN
        let hash = 0;
        if (typeof key === "string") {//string
            //定义规则。
            //例如，如果字符串长度≥3时，前三个字符ASCII码累加，
            //然后映射到[0,8)
            for (let i = 0; i < 3; i++) {
                hash += key.charCodeAt(i) || 0;
            }
        } else {
            if (typeof key === "number" || typeof key === "boolean") {
                //number、boolean、NaN
                hash = isNaN(key) ? 0 : +key;
            } else if (typeof key === "object") {
                //[]、{}、null
                hash = 1;
            } else {//function(){}、undefined
                hash = 2;
            }

        }
        return hash %= this.bucketNumber;
    },
    getBucketPos(key) {
        return this.bucket[this.makeHash(key)];
    },
    set(key, value) {
        let bucketPosition = this.getBucketPos(key);
        while (bucketPosition.next) {
            if (bucketPosition.next.key === key) {
                bucketPosition.next.value = value;
                return;
            } else {
                bucketPosition = bucketPosition.next;
            }

        }
        bucketPosition.next = {
            key,
            value,
            next: null,
        }
    },
    get(key) {
        let bucketPosition = this.getBucketPos(key);
        while (bucketPosition) {
            if (bucketPosition.key === key) {
                return bucketPosition.value;
            } else {
                bucketPosition = bucketPosition.next;
            }
        }
    },
    delete(key) {
        let bucketPosition = this.getBucketPos(key);
        while (bucketPosition.next) {
            if (bucketPosition.next.key === key) {
                bucketPosition.next = bucketPosition.next.next;
                return true;
            } else {
                bucketPosition = bucketPosition.next;
            }
        }
        return false;
    },
    has(key) {
        let bucketPosition = this.getBucketPos(key);
        while (bucketPosition) {
            if (bucketPosition.next && bucketPosition.next.key === key) {
                return true;
            } else {
                bucketPosition = bucketPosition.next;
            }
        }
        return false;
    },
    clear() {
        this.init();
    }
}

let map = new MyMap([
    ["name", "hfull"],
    ["age", 18],
    ["sex", "male"]
]);
console.log(map);
```

## Promise异步编程

&emsp;&emsp;异步编程简介：无论在浏览器环境还是node环境都需要JavaScript的异步编程，如在浏览器环境中的定时器、事件、ajax等或是node环境中的文件读取、事件等。伴随着异步编程就有回调机制，异步编程免不了回调。

异步编程问题：产生回调地狱，难于维护和扩展。
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;try、catch只能捕捉同步代码中出现的异常。
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;同步并发的异步操作存在一定的问题。
解决方案： ES6 Promise可以解决回调地狱，以及同步并发的异步问题。

&emsp;&emsp;jQuery的Callbacks和Lodash的after都是解决回调问题的其他方法

### Promise使用

```js
//excutor function 同步执行
let promise = new Promise((resolve,reject)=>{
    //异步操作
    setTimeout(()=>{
        Math.random()*100 > 60 ? resolve("ok"): reject("fail");
    },1000);
});
//Promise内部状态，pending(等待)，onFulFilled(成功)，onReject(失败)
//注册回调,异步执行
//宏任务（setTimeout）     微任务
//微任务有优先执行权

//then 可以链式操作
//上一个then不抛出错误的话，下一个then会执行成功函数
//返回值作为下一个then注册函数的执行参数
//如果返回值为Promise对象，则下一个then的执行取决于该对象的执行函数
promise.then((val)=>{//微任务
    console.log(val);
    return new Promise((resolve,reject)=>{
        reject("newPromise:fail");
    });
},(reason)=>{
    console.log(reason);
    return "fail then1:param";
}).then((val)=>{
    console.log("ok then2:",val);
},(reason)=>{
    console.log("fail then2:",reason);
});
```

#### then 注册回调返回值

#### catch 异常捕获

```js
let promise = new Promise((resolve,reject)=>{
    throw new Error("test error");
});
//失败函数捕获
promise.then(null,(reason)=>{
    console.log(reason);
});
//链式调用时如果有空then，则相当于不存在可忽视
//catch捕获
//catch后面可以继续链式调用
promise.then().catch((error)=>{
    console.log(error);
    }).then((val)=>{
        console.log(val,"after catch: ok");
    },(reason)=>{
        console.log(reason,"after ctach: fail");
    })
```

#### finally 最后处理函数

#### Promise.all 同步并发异步的结果

```js
let oPro = new Promise(()=>{});
//Promise.all参数为数组，数组元素必须为Promise对象，其会将
//多个Promise实例包装成一个新的Promise实例。
//全部成功时数组内元素的返回值组成数组，只要有失败时返回最先被reject失败
//状态的值
Promise.all([oPro,oPro,oPro]).then((val)=>{
    console.log(val);//val为数组
});
```

#### Promise.race 谁先成功处理谁

```js
let oPro = new Promise(()=>{});
//Promise.race([p1,p2,p3]);里面的哪个结果获得的快，就返回那个结果，
//不管结果本身成功或失败。谁的状态先发生改变就返回谁的状态
Promise.race([oPro,oPro,oPro]).then((val)=>{
    console.log(val);
},(reason)=>{
    console.log(reason);
});
```

### Promise模拟实现

点击查看 [Promise规范][promise-standard]

```js
//考虑兼容性，用ES5实现
function MyPromise(excutor) {
    this.status = "pending";
    this.resolveValue = null;
    this.rejectReason = null;
    this.resolveCallbackList = [];
    this.rejectCallbackList = [];
    try {
        excutor(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
        this.reject(e);
    }
}
MyPromise.prototype = {
    resolve(val) {
        if (this.status === "pending") {
            this.status = "FulFilled";
            this.resolveValue = val;
            this.resolveCallbackList.forEach(function (cbFn) {
                cbFn();
            });
        }
    },
    reject(reason) {
        if (this.status === "pending") {
            this.status = "Rejected";
            this.rejectReason = reason;
            this.rejectCallbackList.forEach(function (cbFn) {
                cbFn();
            });
        }
    },
    then(onFulFilled, onRejected) {
        var self = this;
        self._dealNullThen(onFulFilled)._dealNullThen(onRejected);
        return new MyPromise(function (resolve, reject) {
            if (self.status === "FulFilled") {
                //模拟异步执行，此为宏任务，底层代码为微任务
                setTimeout(function () {
                    try {
                        var nextResolveValue = onFulFilled(self.resolveValue);
                        self._dealReturnValPromse(nextResolveValue, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            } else if (self.status === "Rejected") {
                setTimeout(function () {
                    try {
                        var nextRejectValue = onRejected(self.rejectReason);
                        self._dealReturnValPromse(nextRejectValue, resolve, reject, true);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            } else if (self.status === "pending") {
                self.resolveCallbackList.push(function () {
                    setTimeout(function () {
                        try {
                            var nextResolveValue = onFulFilled(self.resolveValue);
                            self._dealReturnValPromse(nextResolveValue, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                self.rejectCallbackList.push(function () {
                    setTimeout(function () {
                        try {
                            var nextRejectValue = onRejected(self.rejectReason);
                            self._dealReturnValPromse(nextRejectValue, resolve, reject, true);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
    },
    _dealNullThen(fn) { //处理空then情况
        if (!fn) {
            fn = function (val) {
                return val;
            }
        }
        return this;
    },
    _dealReturnValPromse(returnVal, resolve, reject, isRejected) {
        if (returnVal instanceof MyPromise) {
            //若返回值为MyPromise对象，则后面的执行状态由该对象来决定
            returnVal.then(function (val) {
                resolve(val);
            }, function (reason) {
                reject(reason);
            });
        } else {
            //如果返回值不为MyPromise对象，则执行回调函数
            if (!isRejected) {
                resolve(returnVal);
            } else {
                reject(returnVal);
            }
        }
    },
};
MyPromise.race = function (promiseArr) {
    return new MyPromise(function (resolve, reject) {
        promiseArr.forEach(function (ele) {
            ele.then(resolve, reject);
        });
    });
};
//全部成功才执行成功回调，只要有一个失败就执行失败回调
MyPromise.all = function (promiseArr) {
    return new MyPromise(function (resolve, reject) {
        var returnValueArr = [],
            count = 0;
        for (var i = 0, len = promiseArr.length; i < len; i++) {
            (function (i) {
                promiseArr[i].then(function (val) {
                    returnValueArr[i] = val;
                    if (++count == len) {
                        resolve(returnValueArr);
                    }
                }, function (reason) {
                    reject(reason);
                });
            }(i));
        }
    });
};
```

## ES6 Symbol

数据结构：第七种数据结构Symbol
特点：唯一，可作为对象的属性，有静态属性Symbol.iterator

## ES6 Iterator

&emsp;&emsp;**迭代器目的**：标准化迭代操作。

&emsp;&emsp;**迭代模式**：提供一种方法可以顺序获得聚合对象中的各个元素，是一种最简单也是最常见的设计模式。它可以让用户透过特定的接口巡访集合中的每一个元素而不用了解底层的实现。
&emsp;&emsp;**迭代器简介**：依照与迭代模式的思想而实现，分内部迭代器和外部迭代器。

&emsp;&emsp;&emsp;&emsp;**内部迭代器**：本身是函数，该函数内部定义好迭代规则，完全接受整个迭代过程，外部只需要一次初始调用。
&emsp;&emsp;&emsp;&emsp;Array.prototype.forEach、jQuery.each内部迭代器

&emsp;&emsp;&emsp;&emsp;**外部迭代器**：本身是函数，执行返回迭代对象，迭代下一个元素必须显式调用，调用复杂度增加，但灵活性增强。
&emsp;&emsp;&emsp;&emsp;function outerIterator(){}外部迭代器

```js
//模拟写自己外部迭代器
function OuterIterator(o){
    let curIndex=0;
    let next=()=>{
        return {
            value:o[curIndex],
            done:o.length == ++curIndex,
        }
    }
    return {
        next,
    }
}
let arr=[1,2,3];
let oIt=outerIterator(arr);
oIt.next();
oIt.next();
oIt.next();
```

### 部署Iterator

```js
let obj={
    0:"a",
    1:"b",
    2:"c",
    length:3,
    //要能迭代，必须部署Iterator，符合ES6
    [Symbol.iterator]:function (){
        let curIndex=0;
        let next = () => {
            return {
                value: this[curIndex],
                done: this.length == curIndex++,
            }
        };
        return{
            next,
        }
    },
}
console.log([...obj]);
```

### Generator

Generator简介：生成器，本身为函数，执行后返回迭代对象，函数内部要配合yield使用，Generator函数分段执行，遇到yield即暂停。
特点：
&emsp;&emsp;function和函数名之间需要带*
&emsp;&emsp;函数体内yield表达式，产出不同的内部状态（值）

```js
//示例 Generator产生迭代对象
function *test(){
    let val1= yield "a";
    console.log(val1);//val1的值为第二次next中传入的值
    yield "b";
    yield "c";
    return "d";
}
let oG=test();
oG.next();//{value:"a",done:false}
oG.next();//{value:"b",done:false}
oG.next();//{value:"c",done:false}
oG.next();//{value:"d",done:true}
```

改造前面的代码

```js
let obj={
    0:"a",
    1:"b",
    2:"c",
    length:3,
    //要能迭代，必须部署Iterator，符合ES6
    [Symbol.iterator]:function (){
        let curIndex=0;
       while(curIndex != this.length){
           yield this[curIndex++];
       };
    },
}
console.log([...obj]);
```

Generator函数使用

```js
function *read(path){
    let val1 = yield readFile(path);
    let val2 = yield readFile(val1);
    let val3 = yield readFile(val2);
    return val3;
}
let oG = read();
let {value, done} = oG.next();
value.then((val)=>{
    let {value, done} = oG.next();
    value.then((val)=>{
        let {value, done} = oG.next();
        value.then((val)=>{
            console.log(val);
        });
    });
});

//递归优化
function Co(oIterator){
    return new Promise((res,rej)=>{
        let next = (data)=>{
            let {value, done} = oIterator.next(data);
            if(done){
                res(value);
            }else{
                value.then((val)=>{
                    next(val);
                },rej);
            }
        };
        next();
    });
}
//使用
Co(read()).then((val)=>{
    console.log(val);
});
```

#### Promise化

```js
let fs = require("fs");
let path="./data.txt";
let format="utf-8";
//原始函数
function readFile(){
    return new Promise((res,rej)=>{
        fs.readFile(path,format,(err,data)=>{
                if(err){
                    rej(err);
                }else{
                    res(data);
                }
            });
    });
}
//对函数进行promise化   （npm i bluebird）
function promisify(fn){
    return (...arg)=>{
        return new Promise((res,rej)=>{
            fn(...arg,(err,data)=>{
                 if(err){
                    rej(err);
                }else{
                    res(data);
                }
            });
        });
    };
}
let readFilePromisify=promisify(fs.readFile);
readFilePromisify(path,format).then((val)=>{
    console.log(val);
});
//进一步对对象内异步方法进行promise化
function promisifyAll(){
    for(let key in obj){
        let fn=obj[key];
        if(typeof fn === "function"){
            obj[key + "Async"] = promisify(fn);
        }
    }
}
promisifyAll(fs);
fs.readFileAsync(path,format).then((val)=>{
    console.log(val);
});
```

### async & await

async简介：async函数，是Generator语法糖，通过babel编译后可以看出它就是Generator+Promise+Co(递归)思想实现的，配合await使用。
目的：优雅的解决异步操作问题。

```js
//解决回调地狱
//try catch
//同步并发的异步结果
async function read(path){
    try{
        let val1 = await readFile(path);
        let val2 = await readFile(val1);
        let val3 = await readFile(val2);
    }catch(e){
        console.log(e);//能够捕获异常
    }

    return val3;
}
read(path).then((val)=>{
    console.log(val);
});
//解决同步并发的异步问题
//Promise.all有局限性，一个异常其他也不能出结果
Promise.all([readFile(path1),readFile(path2),readFile(path3)])
.then((val)=>{
    console.log(val);
},(reason)=>{
    console.log(reason);
});
//使用async和await可以解决
```

*******************************

## 问题及想法总结

1、查找资料学习**hash算法**

[promise-standard]:https://promisesaplus.com

