## 一、简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。

```js
let vm = new Vue({
 el: '#el',
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```
不是响应式的，Vue中data成员是在Vue初始化的时候通过 new Observer 将其响应式处理；
新添加的成员，只是在实例上新加了一个属性，没有经过observe处理，所以该成员不是响应式的
 　

　

　



### 2、请简述 Diff 算法的执行过程

　查找两颗树每个节点的差异，有几种算法，把第一棵树的上所有节点和第二棵树上所有节点进行对比，
 会比较n的平方次，找到差异后，再循环更新差异的部分，调用名为 patch 的函数，比较新旧节点，
 一边比较一边给真实的 DOM 打补丁。 patch 函数接收两个参数 oldVnode 和 Vnode 分别
 代表新的节点和之前的旧节点,这个函数会比较 oldVnode 和 vnode 是否是相同的, 
 即函数 sameVnode(oldVnode, vnode),


　

　



 

## 二、编程题

### 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。

 　

　

### 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。

 　

　

### 3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图：

<img src="images/Ciqc1F7zUZ-AWP5NAAN0Z_t_hDY449.png" alt="Ciqc1F7zUZ-AWP5NAAN0Z_t_hDY449" style="zoom:50%;" />

<b style="color:red">Snabbdom 版本升级过快, 新版本中 h、init 函数的引入方式如下：</b>

```js
import { h }    from 'snabbdom/build/package/h'
import { init } from 'snabbdom/build/package/init'
// 下面内容请按需导入
import { classModule } from 'snabbdom/build/package/modules/class'
import { propsModule } from 'snabbdom/build/package/modules/props.js'
import { styleModule } from 'snabbdom/build/package/modules/style.js'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners.js'
```

