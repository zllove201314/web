## Vue.js 源码剖析-响应式原理、虚拟 DOM、模板编译和组件化

### 简答题

#### 1、请简述 Vue 首次渲染的过程。

第一步、Vue初始化，实例成员、静态成员
首先进行vue的初始化，即初始化实例成员及静态成员.

第二步、new Vue()
初始化结束以后，调用vue的构造函数new Vue()，在构造函数中调用this._init()方法

第三步、this.init()
this.init()相当于整个项目的入口，在这个方法中，最终调用vm.$mount()

第四步、vm.$mount()
这个$mount()是src/platform/web/entry-runtime-with-compiler.js中定义的，核心作用是把模板编译为render函数，判断是否有render选项，如果没有，则会获取template选项，如果template也没有，会把el中的内容作为模板，通过compileToFunctions()方法将模板编译为render函数，编译好以后，将render存入到options.render中。

第五步、vm.$mount()
调用src/platforms/web/runtime/index.js文件中的$mount方法,这个方法中会重新获取el，因为如果是运行时版本的话，是不会走entry-runtime-with-compiler.js这个入口中获取el，所以如果是运行时版本的话，我们会在runtime/index.js的$mount()中重新获取el。

第六步、mountComponent(this,el)
这个方法在src/core/instance/lifecycle.js中定义的,首先判断是否有render选项，如果没有但是传入了模板，并且当前是开发环境，则发出警告（运行时版本不支持编译器），触发beforeMount钩子函数（开始挂载之前），定义updateComponents函数但是并未调用，这个函数中调用render()和update()两个方法，render是生成虚拟dom，update是将虚拟dom转化为真实dom并挂载到页面上，

创建Watcher实例对象，创建时，传递函数updateComponents，然后调用get方法，创建完毕后，触发钩子函数mounted(),挂载结束，返回vue实例。

第七步、Watcher.get()
创建完watcher，会调用一次get，在get方法中会调用updateComponent(),updateComponent会调用实例化时传入的render（）或者是编译模板以后生成的render（），返回vnode。然后调用vm._update（），调用vm.__patch__方法，将虚拟dom转化为真实dom并挂载到页面上，将生成的真实dom记录到vm.$el()中

　

　

#### 2、请简述 Vue 响应式原理。

数据响应式是指，当数据发生变化自动更新视图，不需要手动操作dom，

第一步、入口，initState（）
vm状态的初始化，整个响应式是从init方法中开始的，在init方法中，调用initState方法初始化状态，在initState方法中调用initData（），将data属性注入到vue实例上，并且调用observe（）将其转化为响应式对象，observe是响应式的入口

第二步、observe（value）
位于src/core/observer/index.js，首先判断value是否是对象，如果不是对象直接返回，判断value对象是否有

__ob__,如果有证明value已经做过响应化处理，是响应式数据，则直接返回，如果没有，则在第三步创建observer对象，并将其返回。

第三步、Observe()
位于src/core/observer/index.js,给value对象定义不可枚举的__ob__属性，记录当前的observer对象，
进行数组的响应化处理，设置数组中的方法push、pop、sort等，这些方法会改变原数组，所以当这些方法被调用的时候，
会发送通知，找到observe对象中的dep，调用dep.notify()方法，然后调用数组中的每一个成员，对其进行响应化处理，
如果成员是对象，也会将转化为响应式对象，如果value是对象的话，会调用walk()，遍历对象中的每一个成员，调用defineReactive()

第四步、defineReactive
src/core/observer/index.js,为每一个属性创建dep对象，如果当前属性是对象，递归调用observe().

getter:为每一个属性收集依赖，如果当前属性是对象，也为对象的每一个属性收集依赖，最终返回属性值。

setter:保存新值，如果新值是对象，则调用observe,派发更新（发送通知），调用dep.notify()

第五步、依赖收集
在watcher对象的get方法中调用pushTarget，会把当前的watcher记录Dep.target属性，访问的data成员的时候收集依赖，
访问值的时候会调用defineReactive的getter中收集依赖，把属性对应的watcher对象添加到dep的subs数组中，如果属性是对象，
则给childOb收集依赖，目的是子对象添加和删除成员时发送通知。

第六步、Watcher
当数据发生变化时，会调用dep.notify()，调用watcher对象的update()方法，在update方法中会调用queueWatcher()，
方法中会判断watcher是否被处理，如果没有，则将其添加到queue队列中，并调用flushSchedulerQueue()刷新任务队列，在
flushSchedulerQueue中，会触发beforeUpdate钩子函数，然后调用watcher.run（），然后清空上一次的依赖，触发actived
钩子函数，触发update钩子函数。

　

　

#### 3、请简述虚拟 DOM 中 Key 的作用和好处。

可以在v-for中为每一个节点设置key属性，以便跟踪每一个节点的身份，从而重用、重新排序现有元素。

好处：可以很大程度减少dom的操作，减少diff和渲染所需要的时间，提升性能。

　

　

#### 4、请简述 Vue 中模板编译的过程。
模板编译的主要目的是将模板template转化为渲染函数render

抽象语法树：AST，使用对象的形式描述树形的代码结构

模板编译是将模板字符串首先转化为AST对象，然后优化AST对象，优化的过程是在标记静态根节点，然后吧优化号的AST对象转化为字符串形式的代码，
最终把字符串形式代码通过newFunction转化为匿名函数，这个匿名函数就是最终生成的函数render函数，模板编译就是啊模板字符串转化为渲染函数。
　

　

　