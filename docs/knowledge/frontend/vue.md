<!--
 * @Description: file description
 * @Author: LiuHuaifu
 * @Date: 2019-07-22 18:48:55
 * @LastEditors: your name
 * @LastEditTime: 2019-12-05 23:22:41
 -->
# Vue {ignore}

优点：
1、性能更好
2、视图、数据分离
3、维护成本低

[toc]

## 知识回顾

### 浏览器渲染过程

1.解析HTML,构建DOM树
2.解析CSS,生成CSS规则树
3.合并DOM树和CSS规则树，生成render树
4.布局render树，负责元素尺寸、位置的计算
5.绘制render树，绘制页面像素信息
6.浏览器会将各层信息发送给GPU,GPU将各层合成

### 重排

1.添加或者删除可见的DOM元素
2.元素位置改变
3.元素尺寸改变
4.内容改变
5.页面渲染器初始化
6.浏览器窗口尺寸改变
[各CSS属性对重排重绘的影响][css重排重绘]

#### 触发重排的属性

&emsp;&emsp;offsetTop.offsetLeft、offsetWidth、offsetHeight
&emsp;&emsp;scrollTop.scrollLeft、scrollWidth、scrollHeight
&emsp;&emsp;clientTop.clientLeft、clientWidth、clientHeight
&emsp;&emsp;getComputedStyle()

## 虚拟DOM

## MVVM

M:Model(数据)
V:View(视图)
VM:ViewModel

## Vue语法

1. 在html结构中可以使用{{}},里面为插值表达式
2. 使用的数据，必须先在data中存在
3. 数据要先存在，才能进行数据绑定
4. 通过索引的方式、改变数组长度的方式更改数组，不能渲染视图
5. 数组变异方法：push、pop、shift、unshift、sort、reverse、splice
6. 对象属性改变自动更新页面，```使用$set; vm.$set(obj,key,value)```
7. 可以通过```$el```来获取其挂载的元素
8. vue更改数据是同步，渲染视图是异步，更改的数据会放入队列中
9. ```$nextTick``` 当dom渲染完成后的回调函数，

    ```js
    vm.$nextTick(()=>{});//参数为回调函数，在里面能获取渲染后的数据
    ````

10. ```$mount``` 将vue挂载到某个元素上

## vue指令

1. **v-pre** 不对插值表达式进行编译
2. **v-cloak** 当编译完会自动移除该指令，可以用来防止加载空档时闪烁
3. **v-once** 保持初次渲染时的值，进行数据改变时不会更新渲染
4. **v-html** ===`innerHTML` 注意数据来源，防止XSS攻击
5. **v-text** ===`text`
6. **v-if**  template标签相当于小程序block标签
7. **v-else-if**
8. **v-else**
9. **v-show** 当满足条件时显示，与`v-if`的区别在于，`v-show`是行间样式`display:none`,元素存在于HTML中,而`v-if`不会去渲染，用一行注释代替该位置有一个元素
    【注意】:`v-show`在`template`元素中不会生效
10. **v-bind:** <==> `:` 绑定属性
    【注意】绑定class属性时，如果有多个类名，要用数组表示，如果需要通过变量布尔值切换类名，可以用对象，key为类名，value为布尔值，或者直接在数组中用简单判断，绑定的class属性作用只是添加类名，并不会移除类名
    绑定style属性时，里面不能直接使用data里的变量，要使用需要用对象形式并以小驼峰形式写key，value,如果要绑定多个值，也需要用数组形式 `冲突时，:style优先级>style`
11. **v-on:** <===>`@` 绑定监听事件
    【注意】事件的回调函数不能和data里数据重名，先找data里再找methods里，data的属性可以是函数，但是this指向为window,methods里this指向vue内部实例
12. **v-for** `v-for="(item,index) in array"` 与`:key`配合使用 template可以使用`v-for`，但是不能给`:key`,`:key`必须给真实元素
    循环遍历对象，`v-for="(value,key) in object"`
    遍历数字`v-for="item in number"`
    遍历字符串`v-for="item in string"`
13. **v-model** 双向数据绑定，实质是value+input语法糖，`<input v-model="content"/> <span>{{content}}</span>`
    可以使用的有:
    `input text`
    `input checkbox` 如果v-model为布尔值，则返回选中状态，如果为数组，则返回value值
    `input radio`
    `textarea`
    `select`
14. **v-slot** 插槽

    ```js
    //html中使用
    <template v-slot:slotName>文字区</template>
    <template #slotName>文字区</template>  
    //v-slot: ==> #


    /*******/
    {
        template:`<button>
                    <slot name="slotName"></slot>
                </button>`,
    }

    ```

## 自定义指令

```js
Vue.directive(name,fnOrObj);// name为指令名字，使用时用v-name,第二个参数为函数或者对象
```

```html
<div id="app">
    <input type="text" v-model="content" v-slice:9.number="content"/>
</div>
```

```js
/*第二个参数为函数*/
//:9表示传入参数，.number表示修饰符
Vue.directive("slice", (el, bindings, vnode)=>{//该函数相当于bind和update结合
    //el为绑定的元素，bindings为绑定对象，里面包含绑定数据有关的一些属性，vnode为虚拟节点
    const val = bindings.value.slice(0, 5);
    vnode.context.content=val;//vnode.context为Vue实例，这句话相当于vm.content=val;
});

/*第二个参数为对象*/
Vue.directive("slice", {
    bind (el, bindings, vnode) { //只执行一次，当指令绑定给元素时
    const context = vnode.context;
    const dataName=bindings.expression;
    const numFlag = bindings.modifiers.number;
    let sliceLen = bindings.arg || 5;
    let initVal = context[dataName];
    if(numFlag){
        initVal = initVal.replace(/[^0-9]/g,"");
    }
    initVal = initVal.slice(0,sliceLen);
    el.value = initVal;
    context[dataName] = initVal;

    el.oninput=e=>{
        let val = e.target.value;
        if(numFlag){
             val = val.replace(/[^0-9]/g,"");
        }
        let dealedVal = val.slice(0,sliceLen);
        context[dataName] = dealedVal;
        el.value = dealedVal;
    }

    },
    update (el, bindings, vnode) { //当虚拟DOM重新渲染时执行update,第一次进入页面不会执行
    //当绑定的数据更新时会重新渲染虚拟DOM
    const numFlag = bindings.modifiers.number;
    let  value = context[bindings.expression];
    if(numFlag){
         value = value.replace(/[^0-9]/g,"");
    }
    value = value.slice(0,bindings.arg || 5);
    el.value = value;
    context[bindings.expression] = value;
    },
    inserted (el, bindings, vnode){//当指令绑定的元素插入页面时执行

    }
});

const vm = new Vue({
    el:"#app",
    data:{
        content:"",
    },
    methods:{

    },
});

const vm1 =new Vue({
    el:"#app1",
    directives:{ //定义自定义局部指令
        slice (el, bindings, vnode){
             //key值为局部指令名字，value为函数或对象，和全局指令的第二个参数一样

        }
    },
});
```

## 过滤器

```html
<div id = "app">
{{ money | toMoney(2) }} <!-- 变量 管道符 过滤器名   可以有多个管道符+过滤器-->

</div>
```

```js
Vue.filter("toMoney",(value,param)=>{ //value为管道符前的变量的值
return (value * param).toLocaleString();
});

const vm = new Vue({
    el:"#app",
    data:{
        money:1000000,//1,000,000
    }
});

const vm1 =new Vue({
    el:"#app1",
    filters:{ //定义自定义局部过滤器
        toMoney (value, param)=>{

        }
    },
});
```

## Vue生命周期

 ```js
const vm = new Vue({
    el:"#app",
    data:{
        name:"",
    },
    /*生命周期函数*/
    beforeCreate(){

    },
    created(){
        //可以在这里调用ajax
    },
    beforeMount(){

    },
    mounted(){
        //ajax
    },
    beforeUpdate(){

    },
    updated(){

    },
    beforeDestroy(){

    },
    destroyed(){

    },
});
 ```

## 计算属性和侦听器

```html
<div id = "app">
    {{person}}{{person1}}
</div>
```

```js
const vm = new Vue({
    el:"#app",
    data:{
       name:"hfull",
       age:18,
       person1:"",
    },
    //属性查找顺序：data > methods > computed
    computed:{  //计算属性  初次渲染就会执行
        // person(){
        //     return `姓名：${this.name},年龄：${this.age}`;
        // }
        person:{ //一般不写成对象形式，除非使用双向数据绑定时使用
            get(){//等于上面的函数

            },
            set(val){ //不可配置，为person赋值不起作用，但是还是会执行set函数

            },
        }
    },
    watch:{ //侦听器   初次渲染不会执行，只有数据改变才执行
        // name(newVal){
        //     this.person1=`姓名：${name},年龄：${age}`;
        // },
        // age(){
        //     this.person1=`姓名：${name},年龄：${age}`;
        // }
        name:{
            handler(newVal){ //等于上面的函数

            },
            immediate:true,  //是否立即执行，如果为true，则初次渲染就会执行
            //不需要依赖生命周期函数进行配合
        },
        age:{
            handler(){

            },
        }
    }
});
//侦听器还可以使用vm.$watch()
vm.$watch("name",()=>{//侦听的属性和要执行的函数

},{//该对象为配置
    immediate:true,
});

```

## Vue组件

### 全局组件

```js
// Vue.component(cmpName,config);  //组件名字和组件配置
Vue.component("hello-world",{
    //组件名小驼峰和连字符最后在html中都可以使用连字符，但是小驼峰不能直接在html中写小驼峰，因为html的标签不识别大写字母，会将大写转成小写
    //最好不要使用单标签形式，html规范不支持，在.vue文件中不存在这个问题
    data(){ //写成函数形式是为了封闭作用域
        return {
            msg:"hello world",
        }
    },
    template:"<div>{{msg}}</div>",
});
```

### 局部组件

常用局部组件

```js
const vm = new Vue({
    el:"#app",
    data:{

    },
    components:{
        HelloWorld:{//key为组件名，value为配置，和全局组件配置完全一样
        //组件名大驼峰、小驼峰、连字符，使用时都用连字符

        },
    }
})
```

### 组件使用

```html
<div id="app">
    <my-component a="1" b="2" :content="content" :title="title"></my-component>
</div>
```

```js
const vm = new Vue({
    el:"#app",
    data:{
        content:"内容测试文字",
        title:"标题文字",
    },
    components:{
        myComponent:{
            // props:["content","title"],//组件属性使用前必须注册
            //未注册的属性会保留在行间，注册过的属性不会留在行间
            props:{
                content:{
                    type:String,
                    default:"默认文字",
                },
                title:{
                    type:String,
                    required:true, //属性必须传
                },
                arr:{
                    type:Array,
                    default:()=>[1,2,3],
                    //如果类型为对象或数组，则default为函数,返回值为默认值
                },
                num:{
                    type:Number,
                    validator(){//属性校验
                        //返回true为成功校验，false为校验失败
                    },
                }
            },
            template:`<div>
                        <h3>{{ title }}</h3>
                        <p>{{ content }}</p>
                    </div>`,
        },
    },
});
```

#### 练习-热点搜索

```html
    <div id="app">
        <news-list :news-list="newsList"></news-list>
    </div>
```

```js
//练习 热点搜索
        const vm = new Vue({
            el: "#app",
            data: {
                newsList: [{
                    title: "标题文字1",
                    index: "123万",
                    id: 0,
                }, {
                    title: "标题文字2",
                    index: "43万",
                    id: 1,
                }]
            },
            components: {
                newsList: {
                    props: ["newsList"],
                    template: `
                    <ul class="news-list">
                        <h3 class="search-title">搜索热点</h3>
                        <news
                            v-for="(item,index) in newsList"
                            :key="item.id"
                            :ranking="index + 1"
                            :title="item.title"
                            :index="item.index"
                        ></news>
                   </ul>`,
                    components: {
                        news: {
                            data() {
                                return {
                                    hotClass: "",
                                };
                            },
                            created() {
                                switch (this.ranking) {
                                    case 1:
                                        this.hotClass = "hot1";
                                        return;
                                    case 2:
                                        this.hotClass = "hot2";
                                        return;
                                    case 3:
                                        this.hotClass = "hot3";
                                        return;
                                    default:
                                        return;
                                }
                            },
                            props: ["ranking", "index", "title"],
                            template: `
                            <li class="news">
                                <div class="content">
                                    <div class="ranking" :class="hotClass">{{ranking}}</div>
                                    <div class="title">{{title}}</div>
                                </div>
                                <div class="index">{{index}}</div>
                            </li>`,
                        },
                    },
                },
            },
        });
```

### 组件间通信

#### 父组件向子组件传递数据

```html
<div id="app">
    <my-component a="1" b="2" :content="content" :title="title"></my-component>
</div>
```

```js
const vm = new Vue({
    el:"#app",
    // data:{
    //     content:"内容测试文字",
    //     title:"标题文字",
    // },
        //方法一：通过对子组件注册属性一级级传值
        //方法二：vm.$parent 父组件实例  vm.$children 子组件实例组成的数组（官方不推荐使用）
        //方法三：使用provide和inject 也不建议使用
    provide:{
        content:"内容测试文字",
        title:"标题文字",
    },
    components:{
        myComponent:{
            inject:["title"],
            // props:["title"],
            // inheritAttrs:false, //控制未注册的属性不显示在行间，但元素本身的属性不会隐藏，如class属性
            template:`<div>
                        <h3>{{ title }}</h3>
                        <my-p v-bind="$attrs"></my-p> //未注册的属性存在于$attrs中,将$attrs中所有的值通过v-bind传递给子组件
                    </div>`,
            components:{
                myP:{
                    // created(){
                    //     this.content = this.$parent.$parent.content;
                    // },
                    // props:["content"],
                    inject:["content"],
                    template:`<p>{{ content }}</p>`,
                }
            }
        },
    },
});
```

#### 子组件向父组件传递数据

```html
<div id="app">
    <my-component @click="func" @like="like"></my-component>
    <!-- 由于自定义组件不能正常感点击等事件，使用.native修饰符使其具有原生组件的感知能力,但是监听的事件是组件的整体事件 -->
</div>
```

```js
/*
1. $children 不建议使用，常用于应急或写库
2. 引用ref DOM或组件都可使用，数据在$refs里,$refs.domName(ref="domName")为引用的DOM元素,
   如果rf设置的是组件，则$refs.cmpName(ref="cmpName")为组件实例，可以在父级中拿到,
   不同DOM的ref值不能一样，否则会覆盖，使用v-for除外，其会返回一个数组
3. 利用在子组件中运行父组件函数方法参数传值，$listeners 存放将组件通过 @ 绑定的事件的函数
   $emit("click",params) 触发的事件名称，参数;v-on将所用$listeners的时间绑定到v-on组件
*/
const vm = new Vue({
    el:"#app",
    methods:{
        func:(data){
            console.log(data);
        },
        like(){
            console.log("like");
        },
    },
    components:{
        myComponent:{
            data(){
                return {
                    msg:"hello",
                };
            },
            methods:{
                handleClick(){
                    this.$emit("click",this.msg);
                    this.$emit("like");
                },
            },
            template:`<div> div demo
                    <button @click="handleClick">点击</button>
                    <button v-on="$listeners">click</button> //不能传参
                     </div>`,
        },
    },
});
```

#### 兄弟组件之间传递数据

event bus 时间总线

```js
Vue.prototype.bus = new Vue();
const vm = new Vue({
    el:"#app",
    components:{
        myContent:{
            data(){
                return {
                    content:"",
                };
            },
            created(){
                this.bus.$on("click",content=>{ //订阅消息
                    this.content = content;
                    console.log(content);
                });
            },
            methods:{
                handleClick(){
                    this.$emit("click",this.msg);
                    this.$emit("like");
                },
            },
            template:`<div>{{ content }}</div>`,
        },
        myInput:{
            data(){
                return {
                    inputVal:""
                };
            },
            template:`<div>
                        <input type="text" v-model.lazy="inputVal"/>
                        <button @click="handleClick">提交</button>
                      </div>`,
            methods:{
                handleClick(){
                    this.bus.$emit("click",this.inputVal); //发布消息
                },
            },
        }
    },
});
```

#### 组件双向通信

Vue单向数据流，父组件传的数据，子组件可以使用，但是不要更改，如要修改，先放到自己data里并且不能有引用值，必须解除引用值成为新的引用值在修改

```html
<div id="app">
    <div>当前计数：{{count}}</div>
    <hr/>
    <!-- <my-count :value="count" @input="handleInput"></my-count> -->
    <!-- <my-count v-model="count"></my-count> -->
    <my-count :value="count" @update:value="handleInput"></my-count>
    <my-count :value.sync="count"></my-count> <!--上面两者等价 -->
</div>
```

```js
// :value + @input => v-model
// :value.sync =:value + @update:value [应该不需要子组件注册方法]
Vue.component("myCount",{
    props:['value'],
    mounted(){
        setInterval(()=>{
            let value = this.value + 1;
            this.$emit("input",value); //发布消息
        },1000);
    },
});
const vm = new Vue({
    el:"#app",
    data:{
        count:100,
    },
    methods:{
        handleInput(val){ //订阅消息
            this.count = val;
        },
    }
});
```

## 脚手架

### 安装脚手架

```shell
npm install -g @vue/cli      //安装脚手架，用于生成项目

npm install -g @vue/cli-service-global   //快速原型开发，编译.vue文件

npm uninstall vue-cli -g   //如果之前安装过旧版本（非3.x）脚手架，需要先卸载旧版本

npm install -g @vue/cli-init //如果仍然需要使用旧版本的vue init功能，可以全局安装一个桥接工具

插件名字:Vetur
```

### .vue文件

```html
<template>
    <div>运行使用vue serve App.vue</div>
</template>
<script>
    export default {

    }
</script>
<style>

</style>
<!-- <style>

</style scoped>  加上scoped，只在相应组件作用域起作用-->
```

### 利用脚手架搭建项目

```shell
vue create <projectName> //在终端命令行创建项目

//根据需求安装依赖文件

//可以设置preset预设，预设文件在用户目录下.vuerc文件

cd <projectName>  //切换到项目目录下

npm run serve  //开启服务器，localhost:8080默认映射为public目录
//src目录为工作目录，assets放置静态资源

//vue配置文件，vue.config.js

vue ui //另一种创建项目方式

```

## 路由

前端路由不刷新网页，后端路由刷新网页

### 安装

`vue add router`
安装完毕在src目录下生成view目录和router.js(路由的配置)

### 解读router.js

`Vue.use();//必须要有`
在实例上添加两个属性：$router、$route

```js
export default new Router({
    mode:'history',//路由有两种模式，hash和history,默认hash,切换模式为history
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      //使用函数是为了懒加载
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
```

### 手写路由配置

```html
<!-- 表示路由展示的区域 -->
<router-view/>
表示跳转到的页面
<router-link tag='li' to='/'>Home</router-link>
 <!--默认生成a标签，可以指定生成的标签名-->
<router-link :to='{name:"home"}'> <!--可以根据对象属性跳转-->
```

```js
// import Vue from 'vue';
// import Router from 'vue-router';
// import Home form './views/Home';

Vue.use(Router);

export default new Router({
    mode:'history',
    linkExactActiveClass:'active-exact', //可以修改自动生成的class类名
    linkActiveClass:'active',
    routes:[
        {
            path:'/',
            name:'home',
            component:Home,
        },
        {
            path:'/learn',
            name:'learn',
            component:()=>import('./views/Learn'),
            redirect:'/learn/second-router',//重定向
            // redirect(to){ //rediect还可以是函数
            //     //to包含跳转的信息
            // },
            children:[
                {
                    path:'second-router',//不加斜杠，直接找父级路由的路径下目录
                    name:'second-router',
                    component:()=>import('./views/Second-router'),
                }
            ],
        },
    ]
});

//$router.push() //将页面压入栈
//$router.replace() //将页面栈最后的页面替换
//$router.go()  //页面跳转
```

********

### 导航守卫&动态路由

```js
/*导航守卫*/
//路由生命周期函数
beforeRouteLeave(to, from, next){//路径将要被改变时执行的函数
    //to为去到的地方包含的信息
    //from为从哪儿去包含的信息，当前组件所在的路径包含的信息
    //next 是否进行跳转，执行跳转，不执行不跳转
},

beforeRouteUpdate(to, from, next){
    //路径被切换，但是组件被复用，还在使用原来的组件时触发
}
beforeRouteEnter(to, from, next){
    //组件内守卫
    //由于路由还未进来，this不可使用，为undefined
    //如果想使用实例
    next(vm=>{
        //在这里使用实例
    });
},

beforeEnter(to, from, next){
    //路由独享守卫
    //只能守卫一个路径   (守卫router.js中home)
}

//在引用路由的文件中使用
router.beforeEach((to, from, next)=>{
    //全局守卫
});
//顺序： 全局守卫=>路由独享守卫=>组件内守卫

router.beforeResolve((to, from, next)=>{
    //路由内都被解析完成后执行
});

router.afterEach(()=>{
    //所有执行完毕执行
});
```

```html
<router-link :to='{name:"other",params:{id:123}}'>
     <!--如果使用？questionid=123，使用query:{id:123}-->
</router-link>
```

```js
/*动态路由*/
{
    path:"other/:id",// :id动态路由
    name:"other",
    component:()=>import('./views/Other'),
}

//取值时
// $router.params.xxx  //通过冒号传参
// $router.query.xxx   //通过问号传参
```

#### 全局守卫

- beforeEach
- beforeResolve
- afterEach

#### 路由独享守卫

- beforeEnter

#### 组件内守卫

- beforeRouteLeave
- beforeRouteEnter
- beforeRouteUpdate

### 完整的导航解析流程

导航被触发。
在失活的组件里调用离开守卫。
调用全局的 `beforeEach` 守卫。
在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
在路由配置里调用 `beforeEnter。`
解析异步路由组件。
在被激活的组件里调用 `beforeRouteEnter。`
调用全局的 `beforeResolve` 守卫 (2.5+)。
导航被确认。
调用全局的 `afterEach` 钩子。
触发 DOM 更新。
用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数。

### 路由元信息

```js
{
    path:"/",
    name:"home",
    meta:{
        //路由元信息，自己随便起
    }
}
```

## Vuex

安装`vue add vuex`
安装完后多了个`store.js`

```js
// import Vue from 'vue'
// import Vuex from 'vuex'

//import addStd from '@/components/std/AddStd';  //@代表的是src目录 

Vue.use(Vuex) //向实例注册了方法$store  $store.state

export default new Vuex.Store({

    strict:process.env.NODE_ENV !== "production", //不为生产环境时开启严格模式
    modules:{ //模块

    //key值为模块的名字，value为模块配置


    /*根据功能让vuex分出模块

        (namespaced:false)

        state会放到每个模块下，getters、mutations、actions会放到全局

        获取state用this.$store.state.modulesName.xxx

        获取getters，直接使用this.$store.getters.xxx

        获取mutations，直接使用this.$store.commit("xxx",payLoad)

        获取actions，直接使用this.$store.dispatch("xxx",payLoad)

        (namespaced:true) 建议使用命名空间

        使用mapGetters、mapMutations、mapActions可以正常使用，但是mapState不可使用
        需要在模块下加上namespaced:true,则使用时如下

        mapState("modulesName",['varName'])

        mapGetters("modulesName",['varName'])

        mapMutations("moduleName/methodName",payLoad)

        mapActions("modulesName/methodName",payLoad)

        this.$store.state.moduleName.xxx

        this.$store['moduleName/getters'].xxx

        this.$store.commit('moduleName/xxx')

        this.$store.dispatch('moduleName/xxx')
    */

        student:{ //可以将value对象放置在/src/store，另建文件再导入使用

            state:{},
            getters:{},
            mutations:{},
            actions:{},
        }
    }
    state: { //数据写在state中

    name:"hfull",
    age:18,
    stdList:[],
  },

    getters:{ //相当于计算属性
      //根据state内数据得到的值

    person(state,getters){ //可以通过getters获取里面其他属性的值

        return `姓名:${state.name} 年龄:${state.age}` //使用参数得到state里的值
    },
  },

    mutations: {//更改vuex的状态，只能进行同步操作
      // Vuex单向数据流，如要更改状态，只能在mutations里更改

        changeStdList(state, payLoad){  //payLoad通过组件传过来的所有参数

            state.stdList.push({
                    name:"hfullest",
                    age:20,
                });

    //在组件需要使用时，使用this.$store.commit("changeStdList",{name:"Danker",age:18});
    }
  },
    actions: { //异步操作放到actions里，提交mutations，让mutations更改状态

    changeStdList( {commit}, payLoad){//可以与mutations重名，参数为context上下文对象，有commit属性

    commit("changeStdList", payLoad)//为mutations里的changeStdList
    },

    //在组件需要使用时，使用this.$store.dispatch("changeStdList",{name:"Danker",age:18});
  }
})


import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
//将vuex内的属性会方法扩展到组件内使用

mapState(['name','age','sex']) //返回类似计算属性的函数组成的对象

//如果需要改名，则参数为对象，key为改过的变量名称，value为函数，函数参数为state对象

mapState({
    modName:state=>state.name,
})

//在计算属性中铺开用...
computed:{
    ...mapState(['name','age','sex']),

    // ...mapGetters(['person']),

    ...mapGetters({
        newPerson:'person',//更改变量名， 不需使用函数，使用字符串就可
    })
},
methods:{
    // ...mapMutations(['changeStdList']),
    handleClick(){
        this.changeStdList({name:"Danker",age:18});
    },
    ...mapActions(['changeStdList']),
},
//取数据还可以使用
`this.$store.state.xxx`
`this.$store.getters.xxx`

//改数据使用
`this.$store.commit("xxx",payLoad)`//使用mutations
`this.$store.dispatch("xxx",payLoad)`//使用actions
```

## vue-cli配置

使用`npm run build`打包
默认js文件下生成.map映射文件，方便出错找出错行
vue使用webpack打包，可以对其进行配置

```js
/*根目录下 vue.config.js*/
const path = require("path");
module.exports={
    productionSourceMap:false, //是否打包sourceMap

    outputDir:'./newDist', //设置输出目录

    publicPath:proccess.env.NODE_ENV ==="production"?'http://www.hfullest.com':'/', //公共路径

    assetsDir:'', //静态资源目录（js css img等）

    chainWebPack:config=>{ //通过该函数获取隐藏webpack的配置参数
        //为src/views文件夹设置别名"_v"
        config.resolve.alias.set('_v',path.resolve(__dirname,'src/views'));
    },

    configureWebpack:{ //对webpack进行配置，跟webpack配置完全一样
        plugin:[],
    },

    //请求数据设置代理
    devServer:{
        proxy:{//设置代理，方便请求数据，同时方便跨域
            '/api/chat/sendMsg/':{
                target:'http://api.duyiedu.com',
            }
        }
    },

    //将样式如less样式文件注入全局，vue add style-resources-loader
    pluginOptions:{//安装完毕后自动生成该属性
        'style-resources-loader':{
            preProccessor:'less',
            patterns:[
                //将less文件注入全局
                path.resolve(__dirname, 'src/assets/style/var.less'),
            ]
        }
    }
}
```

`axios`包进行数据请求

```js
// 在组件内使用import axios from "axios";
//使用axios请求数据
axios.get(url,{
    params:{//要传递的参数

    }
}).then(res=>{ //返回的是Promise对象
    console.log(res);
})
```

## 单元测试

单元测试是指对软件中的最小可测试单元进行检查和验证。

### TDD 测试驱动开发

Test Drive Development

### BDD 行为驱动开发

Behavior Drive Development

### 测试工具

#### 1. mocha & chai

- mocha：测试框架
  > vue脚手架内部就安装好了，不需要再次引入
  > 自己安装：mocha mocha-webpack

- chai：断言库，断定左边的和右边的是否相等
  > 三种断言风格：should、expect、assert
  > www.chaijs.com

##### 用法

- 套件
  > describe('套件名字', () => {})

- 用例
  > it('用例名字', () => {})

###### chai的基本用法

- 判断相等
  > 判断基本类型 expect(1).to.be.equal(1);
  
  > 判断引用类型：expect({a: 1}).to.be.deep.equal({a: 1})   /   expect({a: 1}).to.be.eql({a: 1})

  > deep标记：该标记可以让其后的断言不是比较对象本身，而是递归比较对象的键值对

- 判断不等
  > expect(2).to.be.not.equal(1);

- 判断大于
  > expect(10).to.be.above(5);

  > expect(10).to.be.greaterThan(5);


- 判断小于
  > expect(5).to.be.below(10);

  > expect(5).to.be.lessThan(10);

- 判断大于等于
  > expect(10).to.be.at.least(10);

  > expect(10).to.be.not.lessThan(10);

- 判断小于等于
  > expect(5).to.be.at.most(5);

  > expect(5).to.be.not.greaterThan(5);

- 判断长度
  > expect([1, 2, 3]).to.be.lengthOf(3);

- 判断为truthy，(除了false、undefined、null、正负0、NaN、""的值)
  > expect(1).to.be.ok;

- 判断为true、false、null、undefined、NaN
  > expect(true).to.be.true;

  > expect(false).to.be.false;

  > expect(null).to.be.null;

  > expect(undefined).to.be.undefined;

  > expect(NaN).to.be.NaN;

- 判断包含
  > expect('shanshan').to.be.include('s'); 包含

  > expect('shanshan').to.be.contain('s'); 包含

  > expect('shanshan').to.be.match(/s/); 匹配

##### 使用实例

判断功能是否正确使用`chai`断言库 &emsp;&emsp;[chai官方网站][chai]
使用单元测试会生成test文件夹
`/tests/unit/*.(spec|test).js` 测试文件放到`tests/unit`下，且必须以`.spec.js`或者`.test.js`结尾

```js
//   tests/unit/example.spec.js

import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

//测试用例
it("测试abs传入正数，期待返回与输入相同",()=>{
    expect(1+1).to.be.equal(2);
    //equal 相当于===  用于基本数据类型，不能用于对象等引用值，
    //如果判断两个对象键值对是否相等，使用to.be.deep.equal()简写为to.be.eql()
    expect({}).to.be.eql({});//比较引用值使用eql

});

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })
})
```

```js
/*测试HelloWorld组件*/
import HelloWorld from "@/components/HelloWorld";
import Vue from 'vue';
import {expect} from "chai";
import { mount } from "@vue/test-utils";

describe("HelloWorld.vue",()=>{
    it("测试msg属性，能否正常渲染,原生",()=>{
       const msg = 'hello world';
       const Construcor = Vue.extend(HelloWorld);//Vue.extend通过实例返回构造器
       const vm = new Constructor({
           propsData:{
               msg
           }
       }).$mount();
   const domInner = vm.$el.getElementsByTagName('h1')[0].innerHTML;
    expect(domInner).to.be.include(msg);
    });

    it("测试msg属性，能否正常渲染,vue test-utils库",()=>{
        const msg = 'hello world';
        const wrapper = mount(HelloWorld,{
            propsData:{
                msg
            }
        });//dom对象
        // wrapper.getProps({msg});
        const domInner = wrapper.find("h1").text();
        expect(domInner).to.be.include(msg);
        //wrapper.vm可以取得实例获得data数据
        //wrapper.find().element 取得真正的dom元素
        //shadowMount不渲染子组件，只渲染当前的组件

        //模拟函数使用sinon
        // sinon.spy();
    });
})

```

#### 使用sinon库


运行测试使用`npm run test:unit`

[vue-test-utils API 官网][vue-test-utils]

#### 2. jest

主流测试框架

## element组件库

[element组件库官网][element组件]

## Vue其他补充

`$event` 事件对象

### 修饰符

`@keyup.enter` `@keyup.13`  
&emsp;&emsp;给键盘修饰符起别名：

```js

Vue.config.keyCodes={
    // f1Key:112  //不能小驼峰式，只能连字符
    'f1-key':112
}
```

如果`v-model.lazy`则触发`onchange`事件

`v-model.number` 绑定返回的数据为数字类型

`v-model.trim`

### 挂载流程

el （存在）==>template(不存在) ==> div#app.outerHTML作为模板 ==> AST抽象语法树 ==> render ==> Vnode ==> 真实的DOM元素 ==> 替换
    (不存在) ==> `$mount` (存在) ==>上面流程
    &emsp;&emsp;&emsp;&emsp;(不存在) ==> 直接返回，什么也不干

```js
const vm = new Vue({
    el:"#app",
    template:"<h2>{{msg}}</h2>",//DOM字符串
    render (createElement) {
        // return createElement("h1",{
        //     class:"haahahh",
        //     style:{
        //         fontSize:"20px",
        //         color:"red",
        //     },
        //     domProps:{
        //         innnerHTML:"这个地方的domProps权重大于下面的子元素"
        //     }
        // },[
        //     '第一个子元素',
        //     createElement("p","第二个子元素")
        //  ]);


    const tag = "div";
        //jsx语法
        return (// <>中间写dom， {}中间写js
            <tag class="hahah"
             style={{fontSize:"20px",color:"red"}}
             on-click={()=>{console.log("dsfkfj")}}
             >
            <p>这是p标签</p>
            </tag>
        )
    },
    data:{
        msg:"hello world"
    }
});
```

## Vue SSR服务器渲染

### 什么是服务器渲染

服务器端渲染，客户端渲染

1. 这里的渲染指什么？
    `页面的计算过程`
2. 计算过程指什么？
3. web页面的发展史（页面逻辑角度）
   1. 静态页面（document）
   2. 后端模板渲染（smarty(php),JSP(JAVA),volocity,freemarker(JAVA),jinja2(python)）
   3. 前后端分离
        前端：交互+样式
        后端：业务+数据
   4. vue服务器端渲染
        前端：html,css,js
        后端：node(npm,yarn)

### 为什么要使用服务器渲染？

1. SEO（搜索引擎优化）
    meta keyword discription
    title
    content(页面内容)
2. 目的
   提高网站搜索自然排名，获取更高的流量，更好的用户体验

### vue-ssr

`vue-server-renderer`

```js
const express = require("express");
const Vue = require("vue");
const fs = require("fs");
const renderer = require("vue-server-renderer");

const server = new express();
const render = renderer.createRenderer({
    template:fs.readFileSync("./index.html","utf8"),//在index.html文件中body中添加注释：<body><!--vue-ssr-outlet--></body>
});

let app = new Vue({
    template:`<div>{{info}}</div>`,
    data:{
        info:"Vue ssr render",
    },
    components:{
        home:{
            template:`<div><input type="text" v-model="msg"/>{{msg}}</div>`,
            data(){
                return{
                    msg:'I am a child component',
                }
            }
        }
    },
});

render.renderToString(app,{
    title:'ssr demo', //在index.html中 <title>{{title}}</title>
    init:'<script>console.log("init");</script>'  // <body> {{{init}}} </body>
},(err, html)=>{
    console.log(html);//html字符串
});

server.get("/getSSR",(req,res){
    res.end();
});

server.listen(12306,()=>{
    console.log('server is running at 12306');
});
```

webpack文件

```js
const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports={
    mode:"development",
    entry:"./server-entry.js",
    target:"node",//运行环境
    output:{
        filename:'server.bundle.js',
        path:path.resolve(__dirname,"../dist"),
        libraryTarget:'commonjs2',
    },
    module:{

    },
    plugin:[

    ],
}
```


-------------------

## 自学心得——Vue踩坑

### 解决深层对象双向绑定无法更新视图

利用vue插值表达式可以使用函数，将对象转成字符串，再在子组件中解析成对象，由此完成父组件对子组件的视图更新

使用`axios`请求参数时，`post`请求传参后端不能正常接收，必须使用`axios`的`qs`模块的`qs.stringify()`将对象参数转换

需求：当hover到元素上时，width动态增加，并且transition过渡动画，如何使用vue动态修改伪类下的属性？
有一种方式是动态添加css Rules

[css重排重绘]:https://www.csstriggers.com/
[chai]:https://www.chaijs.com
[vue-test-utils]:https://www.vue-test-utils.vuejs.org/zh/api/
[element组件]:https://element.eleme.cn/#/zh-CN
