
// v-html 指令: 将html文本解析为html
htmlUpdater(node, value, key) {
    node.innerHTML = value
    new Watcher(this.vm, key, (newValue) => {
        node.innerHTML = newValue
    })
}

//v-on指令 为dom绑定事件
onUpdater(node, value, key, eventName) {
    node.addEventListener(eventName, value)
    new Watcher(this.vm.$options.methods, key, (newValue) => {
        node.addEventListener(eventName, newValue)
    },(oldVlaue)=>{
        // 移除之前的事件处理函数
        // console.log('.', oldVlaue);
        node.removeEventListener(eventName, oldVlaue)
    })
}